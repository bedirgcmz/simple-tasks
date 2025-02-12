import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment-timezone'; // moment-timezone'ı kullandık
import * as Localization from "expo-localization";
import translations from "../locales/translations";
import { scheduleNotification, cancelNotification } from "../utils/notificationUtils"; 
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { router } from 'expo-router'


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
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const todoId = response.notification.request.content.data.todoId;
      console.log("📩 Bildirime tıklandı, yönlendirilecek todoId:", todoId);
      
      if (todoId) {
        setNotificationRedirect(todoId); // 📌 Bildirim yönlendirmesini başlat
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
  const deviceLanguage = Localization.locale.split("-")[0];
  const [language, setLanguage] = useState(deviceLanguage || "en");
  const [notificationRedirect, setNotificationRedirect] = useState(null); // 📌 Bildirim yönlendirme durumu
  const [username, setUsername] = useState("");
  

  const t = (key) => translations[language][key] || key;


    //Todlarin kategorilerini dile gore degistirme
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
    category: categories[deviceLanguage]?.[10] || "Others",
    status: 'pending',
    createdAt: moment().format('YYYY-MM-DD'),
    dueDate: moment().add(7, 'days').format('YYYY-MM-DD'), 
    dueTime: "12:00:00",
    reminderTime: '1 day before',
    completedAt: null,
  };

  const loadTodos = async () => {
    try {
        const storedTodos = await AsyncStorage.getItem(STORAGE_KEY);

        if (storedTodos) {
            const parsedTodos = JSON.parse(storedTodos);
            
            if (Array.isArray(parsedTodos) && parsedTodos.length > 0) {
                setTodos(parsedTodos);
            } else {
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([initialTodo]));
                setTodos([initialTodo]);
            }
        } else {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([initialTodo]));
            setTodos([initialTodo]);
        }
    } catch (error) {
        console.error('❌ Error loading todos:', error);
    }
};


  const saveTodos = async (updatedTodos) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTodos));
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  };

  // Yeni görev ekleme ve bildirim zamanlama
  const addTodo = async (newTodo) => {
    const updatedTodos = [newTodo, ...todos];
    setTodos(updatedTodos);
    saveTodos(updatedTodos);

    // Bildirim zamanla
    await scheduleNotification(newTodo , t, language);
  };

  const deleteTodo = async (id) => {
    try {
      console.log(`🗑 Deleting todo: ${id}`);
  
      const todoToDelete = todos.find((todo) => todo.id === id);
      if (todoToDelete) {
        console.log(todoToDelete);
        await cancelNotification(id); // 📌 Önce bildirimi iptal et
      }
  
      const updatedTodos = todos.filter((todo) => todo.id !== id);
      setTodos(updatedTodos);
      await saveTodos(updatedTodos);
  
      // 📋 **Silinen todo’nun bildirim kayıtlarını tekrar kontrol et**
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      console.log("📋 Scheduled Notifications AFTER DELETE:", JSON.stringify(scheduledNotifications, null, 2));
  
    } catch (error) {
      console.log("❌ Error in deleteTodo:", error);
    }
  };
  

  const updateTodo = async (id, updatedTodo) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, ...updatedTodo } : todo
    );
  
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  
    if (updatedTodo.status === "done") {
      await cancelNotification(id);
    } else if (updatedTodo.reminderTime || updatedTodo.dueDate || updatedTodo.dueTime) {
      // console.log(`🔄 Güncellenen Todo için Bildirim Yönetimi: ${id}`);
      
      // **ÖNCE** eski bildirimi iptal et
      await cancelNotification(id);
      
      // **SONRA** yeni bildirimi oluştur
      setTimeout(async () => {
        await scheduleNotification(updatedTodo, t);
      }, 1000); // 1 saniye gecikme ile yeni bildirimi planla
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
    loadTodos().then(() => {
      setUsername(t("Guest"));
      loadUsername();
  });
  }, []);

  useEffect(() => {
    translateTodosCategories(language);
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

  const value = {
    todos,
    setTodos,
    addTodo,
    deleteTodo,
    updateTodo,
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
    translateTodosCategories,
    categories
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


