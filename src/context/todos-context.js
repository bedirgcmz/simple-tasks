import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment-timezone'; // moment-timezone'ı kullandık
import * as Localization from "expo-localization";
import translations from "../locales/translations";
import { scheduleNotification, cancelNotification } from "../utils/notificationUtils"; 
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { router } from 'expo-router'
import { Alert } from "react-native";
import { testNotificationLog } from '../utils/test';
import { migrateOldTodosSafely } from "../utils/migrateUtils";


// Bildirimlerin nasıl işleneceğini tanımla
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// 📌 **Bildirim Yönlendirme Durumunu İzleyen Hook**
export function useNotificationListener(setNotificationRedirect) {
  useEffect(() => {
    if (!setNotificationRedirect) return;

    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const todoId = response.notification.request.content.data.todoId;
      if (todoId) {
        setNotificationRedirect(todoId);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);
}

// Android için özel kanal oluştur
async function configureAndroidChannel() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
}

configureAndroidChannel();

export const TodoListContext = createContext();

export const TodoListProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [showCongrats, setShowCongrats] = useState(false);
  const [dueTime, setDueTime] = useState('00:00');
  const STORAGE_KEY = 'user_todos';
  const STORAGE_USERNAME_KEY = "user_username";
  const STORAGE_USERNAME_LANGUAGE = "user_language_simpletask";
  const STORAGE_USERNAME_IMAGE = "user_image_simpletask";
  const STORAGE_USER_CATEGORIES = "user_custom_categories";
  const [userCategories, setUserCategories] = useState([]); // Kullanıcı kategorileri
  // const deviceLanguage = Localization.locale.split("-")[0]; // Cihazın varsayılan dili
  // const defaultLanguage = ["en", "sv", "de", "tr"].includes(deviceLanguage) ? deviceLanguage : "en"; 
  const locales = Localization.getLocales?.() ?? [];
  const deviceLanguage = locales[0]?.languageCode || locales[0]?.languageTag?.split("-")[0] || "en";
  const defaultLanguage = ["en", "sv", "de", "tr"].includes(deviceLanguage) ? deviceLanguage : "en";
  const [language, setLanguage] = useState(defaultLanguage); // Başlangıçta geçerli bir dil ata
  const [notificationRedirect, setNotificationRedirect] = useState(null); // 📌 Bildirim yönlendirme durumu
  const [username, setUsername] = useState("");
  const [userIconImage, setUserIconImage] = useState("icon24");
  // const t = (key) => translations[language][key] || key;
  const t = (key) => translations?.[language]?.[key] || key;

//  useEffect içinde async fonksiyon ile resim ve dil secimini baslangicta yukle
useEffect(() => {
  const loadUserLanguage = async () => {
    try {
      const storedUserLanguage = await AsyncStorage.getItem(STORAGE_USERNAME_LANGUAGE);
      if (storedUserLanguage && ["en", "sv", "de", "tr"].includes(storedUserLanguage)) {
        setLanguage(storedUserLanguage); //  Kayıtlı dili yükle
      } else {
        await AsyncStorage.setItem(STORAGE_USERNAME_LANGUAGE, defaultLanguage);
        setLanguage(defaultLanguage); //  Geçerli dili ata
      }
    } catch (error) {
      console.error("❌ Error loading language:", error);
    }
  };
  const loadUserImage = async () => {
    try {
      const storedUserImage = await AsyncStorage.getItem(STORAGE_USERNAME_IMAGE);
      if (storedUserImage) {
        setUserIconImage(storedUserImage); //  Kayıtlı resmi yükle
      } else {
        await AsyncStorage.setItem(STORAGE_USERNAME_IMAGE, userIconImage);
      }
    } catch (error) {
      console.error("❌ Error loading language:", error);
    }
  };
  loadUserLanguage();
  loadUserImage()
}, []);

useEffect(() => {
  const loadUserCategories = async () => {
    try {
      const storedCategories = await AsyncStorage.getItem(STORAGE_USER_CATEGORIES);
      if (storedCategories) {
        setUserCategories(JSON.parse(storedCategories));
      }
    } catch (error) {
      console.error("Error loading user categories:", error);
    }
  };
  loadUserCategories();
}, []);

const saveUserCategories = async (newCategories) => {
  try {
    await AsyncStorage.setItem(STORAGE_USER_CATEGORIES, JSON.stringify(newCategories));
  } catch (error) {
    console.error("Error saving user categories:", error);
  }
};

const addUserCategory = async (newCategory, setCategory) => {
  if (!newCategory.trim()) return;

  const allCategories = [...categories[language], ...userCategories];

  if (allCategories.includes(newCategory)) {
    Alert.alert(t("Category_exists_alert"));
    return;
  }

  const updatedCategories = [...userCategories, newCategory];
  setUserCategories(updatedCategories);
  await saveUserCategories(updatedCategories);
  setCategory(newCategory); // Yeni eklenen kategoriye geç
};

const getCategories = () => {
  return [...categories[language], ...userCategories]; // Varsayılan ve kullanıcı kategorilerini birleştir
};

const deleteUserCategory = async (categoryToDelete) => {
  try {
    // Kullanıcının eklediği kategorilerden kaldır
    const updatedCategories = userCategories.filter(cat => cat !== categoryToDelete);
    setUserCategories(updatedCategories);
    await saveUserCategories(updatedCategories);

    // Eğer bu kategoriye ait görevler varsa, onların kategorisini "Others" yap
    const updatedTodos = todos.map(todo => 
      todo.category === categoryToDelete ? { ...todo, category: "Others" } : todo
    );

    setTodos(updatedTodos);
    await saveTodos(updatedTodos);
    
  } catch (error) {
    console.error("❌ Error deleting category:", error);
  }
};



    //Todolarin kategorilerini dile gore degistirme
    const categories = {
      en: [
        "School",
        "Finance",
        "Shopping",
        "Family",
        "Travel",
        "Health",
        "Home",
        "Friends",
        "Work",
        "Fun",
        "Others",
      ],
      tr: [
        "Okul",
        "Finans",
        "Alışveriş",
        "Aile",
        "Seyahat",
        "Sağlık",
        "Ev",
        "Arkadaşlar",
        "İş",
        "Eğlence",
        "Diğerleri",
      ],
      sv: [
        "Skola",
        "Ekonomi",
        "Shopping",
        "Familj",
        "Resa",
        "Hälsa",
        "Hem",
        "Vänner",
        "Arbete",
        "Nöje",
        "Övrigt",
      ],
      de: [
        "Schule",
        "Finanzen",
        "Einkaufen",
        "Familie",
        "Reisen",
        "Gesundheit",
        "Zuhause",
        "Freunde",
        "Arbeit",
        "Spaß",
        "Sonstiges",
      ],
    };

    const translateTodosCategories = async (pLang) => {
      try {
        const translatedTodos = todos.map(todo => {
          // Eski kategoriyi bul
          const oldCategory = todo.category;
          
          // Yeni dildeki karşılığını bul
          let newCategory = oldCategory;
    
          Object.keys(categories).forEach(lang => {
            const index = categories[lang].indexOf(oldCategory);
            if (index !== -1) {
              newCategory = categories[pLang][index]; // Yeni dildeki karşılık
            }
          });
    
          return { ...todo, category: newCategory };
        });
    
        // AsyncStorage'a kaydet
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(translatedTodos));
    
        // State'i güncelle
        if (todos.length > 0) {
          setTodos(translatedTodos);
      }
      } catch (error) {
        console.error("Error translating categories:", error);
      }
    };

  const initialTodo = {
    id: '0',
    title: t("IT_title"),
    description: t("IT_description"),
    category: categories[language]?.[10] || "Others",
    status: 'pending',
    createdAt: moment().format('YYYY-MM-DD'),
    dueDate: moment().add(7, 'days').format('YYYY-MM-DD'), 
    dueTime: "12:00:00",
    reminderTime: '1 day before',
    completedAt: null,
    isRecurring: false,
    repeatGroupId: null,
    repeatDays: null,
    notificationId : null
  };


// const loadTodos = async () => {
//   try {
//     const storedTodos = await AsyncStorage.getItem(STORAGE_KEY);

//     if (storedTodos && storedTodos !== "[]") { 
//       const parsedTodos = JSON.parse(storedTodos);
//       if (Array.isArray(parsedTodos) && parsedTodos.length > 0) {
//         setTodos(parsedTodos);
//       }
//     } else { 
//       const defaultTodos = [initialTodo];
//       await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTodos));
//       setTodos(defaultTodos);
//     }
//   } catch (error) {
//     console.error("❌ Error loading todos:", error);
//   }
// };


const loadTodos = async () => {
  try {
    const storedTodos = await AsyncStorage.getItem(STORAGE_KEY);

    if (storedTodos && storedTodos !== "[]") { 
      const parsedTodos = JSON.parse(storedTodos);
      if (Array.isArray(parsedTodos) && parsedTodos.length > 0) {
        return parsedTodos;
      }
    } 
    // Eğer hiç kayıt yoksa initial todo dön
    return [initialTodo];

  } catch (error) {
    console.error("❌ Error loading todos:", error);
    return [initialTodo]; // Hata olursa da yine başlangıç todo'su dön
  }
};


  const saveTodos = async (updatedTodos) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTodos));
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  };

  const addTodo = async (newTodo) => {
    setTodos((prev) => {
      const updated = [newTodo, ...prev];
      saveTodos(updated); // güncel listeyi kaydet
      return updated;
    });
  };
  
  
  const deleteTodo = async (id) => {
    // 🚀 `todos` dizisini kontrol et, null veya undefined hatalarını önle
    if (!todos || todos.length === 0) {
    console.warn(t("No_todos_found"));
    return;
    }

    // 🚀 Eğer son todo ise, silmeyi iptal et ve kullanıcıya uyarı göster
    if (todos.length === 1) {
        // alert(t("Last_todo_alert"));
        Alert.alert(t("Last_todo_alert"));
        return;
    }
    try {
      // console.log(`🗑 Deleting todo: ${id}`);
  
      const todoToDelete = todos.find((todo) => todo.id === id);
      if (todoToDelete) {
        // console.log(todoToDelete);
        await cancelNotification(todoToDelete.notificationId); // 📌 Önce bildirimi iptal et
      }
  
      const updatedTodos = todos.filter((todo) => todo.id !== id);
      setTodos(updatedTodos);
      await saveTodos(updatedTodos);
      // testNotificationLog(updatedTodos);
  
      // // 📋 **Silinen todo’nun bildirim kayıtlarını tekrar kontrol et**
      // const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      // console.log("📋 Scheduled Notifications AFTER DELETE:", JSON.stringify(scheduledNotifications, null, 2));
  
    } catch (error) {
      console.log("❌ Error in deleteTodo:", error);
    }
  };

  // useEffect(() => {
  //   // testNotificationLog(todos)
  // },[todos])

  const updateTodo = async (id, updates) => {
    const currentTodo = todos.find((t) => t.id === id);
    if (!currentTodo) return;
  
    let updatedTodo = { ...currentTodo, ...updates };
  
    // 🔁 Status güncellemesiyle bildirim kontrolü
    if (updates.status) {
      if (updates.status === "done") {
        await cancelNotification(currentTodo.notificationId);
        updatedTodo.notificationId = null;
      } else if (updates.status === "pending") {
        const newNotificationId = await scheduleNotification(updatedTodo, t, language);
        updatedTodo.notificationId = newNotificationId;
      }
    }
  
    // 🔄 Todo'yu güncelle
    setTodos((prev) => {
      const updated = prev.map((todo) => (todo.id === id ? updatedTodo : todo));
      saveTodos(updated);
      return updated;
    });
  };
  
  const updateTodoFully = async (id, updatedFields) => {
    const existingTodo = todos.find((t) => t.id === id);
    if (!existingTodo) return;
  
    // Bildirimi iptal et (varsa)
    if (existingTodo.notificationId) {
      await cancelNotification(existingTodo.notificationId);
    }
  
    const updatedTodo = {
      ...existingTodo,
      ...updatedFields,
      notificationId: null,
    };
  
    // Yeni bildirim sadece 'pending' ise ayarlanır
    if (updatedTodo.status === "pending") {
      const newNotificationId = await scheduleNotification(updatedTodo, t, language);
      updatedTodo.notificationId = newNotificationId;
    }
  
    // Güncelle
    setTodos((prev) => {
      const updated = prev.map((todo) => (todo.id === id ? updatedTodo : todo));
      saveTodos(updated);
      return updated;
    });
  };
  
  const deleteAllInGroup = async (groupId) => {
    try {
      const groupTodos = todos.filter((todo) => todo.repeatGroupId === groupId);
      const hasOtherGroup = todos.some(
        (todo) => todo.repeatGroupId && todo.repeatGroupId !== groupId
      );
      const hasNonGroupTodo = todos.some((todo) => !todo.repeatGroupId);
  
      // 🔒 Eğer bu grup silinirse sistemde başka todo kalmıyorsa:
      if (!hasOtherGroup && !hasNonGroupTodo) {
        const fallbackTodo = { ...groupTodos[0] };
  
        // Tek todo haline getir
        fallbackTodo.id = Date.now().toString();
        fallbackTodo.isRecurring = false;
        fallbackTodo.repeatGroupId = null;
        fallbackTodo.repeatDays = null;
  
        // Bildirimi iptal et (varsa)
        if (fallbackTodo.notificationId) {
          await cancelNotification(fallbackTodo.notificationId);
          fallbackTodo.notificationId = null;
        }
  
        // Yeni bildirim kur
        const newNotificationId = await scheduleNotification(fallbackTodo, t, language);
        fallbackTodo.notificationId = newNotificationId;
  
        // Sadece fallback todo’yu kaydet
        setTodos([fallbackTodo]);
        await saveTodos([fallbackTodo]);
        return;
      }
  
      // 🔕 Grup içindeki tüm bildirimleri iptal et
      for (const todo of groupTodos) {
        if (todo.notificationId) {
          await cancelNotification(todo.notificationId);
        }
      }
  
      // 🎯 Sadece bu grubu kaldır
      const updated = todos.filter((todo) => todo.repeatGroupId !== groupId);
      setTodos(updated);
      await saveTodos(updated);
    } catch (error) {
      console.error("❌ deleteAllInGroup içinde hata:", error);
    }
  };
  


  // const deleteAllInGroup = async (groupId) => {
  //   try {
  //     const groupTodos = todos.filter((todo) => todo.repeatGroupId === groupId);
  
  //     // 📛 Bildirimleri iptal et
  //     for (const todo of groupTodos) {
  //       if (todo.notificationId) {
  //         await cancelNotification(todo.notificationId);
  //       }
  //     }
  
  //     // ✅ Todos listesini filtrele
  //     const updated = todos.filter((todo) => todo.repeatGroupId !== groupId);
  //     setTodos(updated);
  //     await saveTodos(updated);
  //   } catch (error) {
  //     console.error("❌ deleteAllInGroup içinde hata:", error);
  //   }
  // };
  

const updateAllInGroup = async (groupId, newTodos, options = { skipNotification: false }) => {
  const oldGroupTodos = todos.filter((t) => t.repeatGroupId === groupId);

  // 1. Eski bildirimleri iptal et
  for (const oldTodo of oldGroupTodos) {
    if (oldTodo.notificationId) {
      await cancelNotification(oldTodo.notificationId);
    }
  }

  // 2. Eski todoları sil, yenileri ekle
  const updated = [
    ...todos.filter((t) => t.repeatGroupId !== groupId),
    ...newTodos,
  ];
  setTodos(updated);
  await saveTodos(updated);

  // 3. Yeni bildirimleri planla (opsiyonel)
  if (!options.skipNotification) {
    for (const newTodo of newTodos) {
      const notificationId = await scheduleNotification(newTodo, t, language);
      newTodo.notificationId = notificationId;
    }

    // tekrar save et notificationId'ler eklenmiş haliyle
    setTodos((prev) => {
      const withNotis = prev.map((todo) => {
        const found = newTodos.find((nt) => nt.id === todo.id);
        return found ? found : todo;
      });
      saveTodos(withNotis);
      return withNotis;
    });
  }
};

  //Username islemleri
  const loadUsername = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem(STORAGE_USERNAME_KEY);
      if (storedUsername) {
        setUsername(storedUsername);
      } else {
        // İlk kez açılıyorsa, varsayılan kullanıcı adı olarak "Guest" ata
        await AsyncStorage.setItem(STORAGE_USERNAME_KEY, t("Guest"));
        setUsername(t("Guest"));
      }
    } catch (error) {
      console.error("Error loading username:", error);
    }
  };
  const updateUsername = async (newUsername) => {
    try {
      await AsyncStorage.setItem(STORAGE_USERNAME_KEY, newUsername); // AsyncStorage'a kaydet
      setUsername(newUsername); // State'i güncelle
    } catch (error) {
      console.error("Error saving username:", error);
    }
  };

    useEffect(() => {
      const initApp = async () => {
        const loadedTodos = await loadTodos(); // önce kesinlikle datayı al
    
        const migratedTodos = await migrateOldTodosSafely(loadedTodos); // migrasyonu uygula
        setTodos(migratedTodos); // en son state'e ata
    
        await saveTodos(migratedTodos); // dosyaya kaydet
        await loadUsername(); // diğer ayarları yap
      };
      initApp();
    }, []);


  useEffect(() => {
    const translateCategories = async () => {
      await translateTodosCategories(language);
    };
    translateCategories();
  }, [language]);
  
  


   // 📌 **Bildirim Dinleyiciyi Burada Kullan**
   useNotificationListener(setNotificationRedirect);

   // 📌 **Bildirim yönlendirmesini yönet**
   useEffect(() => {
     if (notificationRedirect) {
       router.replace(`/dynamicid/${notificationRedirect}`); // 📌 replace kullanarak kesin yönlendirme yap
       setNotificationRedirect(null); // 📌 Yönlendirme tamamlandı, state’i sıfırla
     }
   }, [notificationRedirect]);

   useEffect(() => {
    setUserCategories((prev) => [...prev]); // Kullanıcı kategorileri değişmeden koru
  }, [language]);
  


  const value = {
    todos,
    setTodos,
    addTodo,
    deleteTodo,
    updateTodo,
    updateTodoFully,
    setDueTime, 
    showCongrats, 
    setShowCongrats,
    language, 
    setLanguage, 
    t,
    username, 
    setUsername,
    loadUsername,
    updateUsername,
    STORAGE_KEY,
    STORAGE_USERNAME_LANGUAGE,
    STORAGE_USERNAME_IMAGE,
    translateTodosCategories,
    categories,
    userIconImage,
    setUserIconImage,
    saveUserCategories,
    userCategories,
    addUserCategory,
    getCategories,
    deleteUserCategory,
    deleteAllInGroup,
    updateAllInGroup
  };

  return <TodoListContext.Provider value={value}>{children}</TodoListContext.Provider>;
};

export const useTodoListContext = () => {
  const context = useContext(TodoListContext);
  if (context === undefined) {
    throw new Error('useTodoListContext must be used within a TodoListProvider');
  }
  return context;
};


