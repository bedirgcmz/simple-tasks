import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment-timezone'; // moment-timezone'ı kullandık
import * as Localization from "expo-localization";
import translations from "../locales/translations";
import { scheduleNotification, cancelNotification } from "../utils/notificationUtils"; 
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Bildirimlerin nasıl işleneceğini tanımla
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

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
  const deviceLanguage = Localization.locale.split("-")[0];
  const [language, setLanguage] = useState(deviceLanguage || "en");

  const t = (key) => translations[language][key] || key;

  const initialTodo = {
    id: '0',
    title: 'Welcome Simple Tasks',
    description: 'Lets create new ToDos. This is your first ToDo!',
    category: t("Others"),
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
        setTodos(JSON.parse(storedTodos));
      } else {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([initialTodo]));
        setTodos([initialTodo]);
      }
    } catch (error) {
      console.error('Error loading todos:', error);
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
    await scheduleNotification(newTodo , t);
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
      console.log(`🔄 Güncellenen Todo için Bildirim Yönetimi: ${id}`);
      
      // **ÖNCE** eski bildirimi iptal et
      await cancelNotification(id);
      
      // **SONRA** yeni bildirimi oluştur
      setTimeout(async () => {
        await scheduleNotification(updatedTodo, t);
      }, 1000); // 1 saniye gecikme ile yeni bildirimi planla
    }
  };
  

  useEffect(() => {
    loadTodos();
  }, []);

  const value = {
    todos,
    addTodo,
    deleteTodo,
    updateTodo,
    setDueTime, 
    showCongrats, 
    setShowCongrats,
    language, 
    setLanguage, 
    t
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
