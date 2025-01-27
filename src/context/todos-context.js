import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import moment from 'moment';

// TodoListContext oluşturuluyor
export const TodoListContext = createContext();

export const TodoListProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [showCongrats, setShowCongrats] = useState(false); // Animasyon componentini kontrol etmek icin
  const [dueTime, setDueTime] = useState('00:00'); // New state for dueTime
  const STORAGE_KEY = 'user_todos';

  // Varsayılan ilk görev
  const initialTodo = {
    id: '0',
    title: 'Welcome Simple Tasks',
    description: 'Lets create new ToDos. This is your first ToDo!',
    category: 'Others',
    status: 'pending',
    createdAt: moment().format('YYYY-MM-DD'), // Use moment.js to format date
    dueDate: moment().add(7, 'days').toISOString(), // Add 7 days for due date
    reminderTime: '1 day before',
    completedAt: null,
  };

  // Reminder time calculation using moment.js
  const calculateReminderTime = (dueDate, dueTime, reminderOption) => {
    // dueDate: '2025-01-30' (YYYY-MM-DD format)
    // dueTime: '10:06' (HH:mm format)
    // reminderOption: '1 hour before' gibi bir değer
  // console.log("son saat",dueTime);
    // İlk olarak, dueDate ve dueTime'ı birleştiriyoruz
    const dueDateTime = moment(dueDate + 'T' + dueTime, 'YYYY-MM-DD HH:mm');
    // console.log('Son tarih (momentjs):', dueDateTime.format()); // Son tarihi logluyoruz
    
  
    // reminderOption'ı dakika cinsinden eşleştiren bir map oluşturuyoruz
    const reminderMap = {
      "5 minutes before": 5,
      "10 minutes before": 10,
      "30 minutes before": 30,
      "1 hour before": 60,
      "2 hours before": 120,
      "6 hours before": 360,
      "1 day before": 1440,
      "1 week before": 10080,
    };
  
    // Eğer reminderOption doğru gelirse, onu kullanıyoruz
    const reminderOffset = reminderMap[reminderOption] || 120; // Default olarak 2 saat önceyi seçiyoruz
  
    // Reminder time'ı hesaplıyoruz
    const reminderTime = dueDateTime.subtract(reminderOffset, 'minutes');
  
    // console.log('Hatırlatıcı zamanı (momentjs):', reminderTime.format()); // Hatırlatıcı zamanını logluyoruz
  
    return reminderTime; // Hatırlatıcı zamanını döndürüyoruz
  };
  


  // Bildirim zamanlama fonksiyonu
  const scheduleNotification = async (todo) => {
    try {
      const reminderTime = calculateReminderTime(todo.dueDate, todo.dueTime, todo.reminderTime);
      console.log("Reminder time:", reminderTime.format()); // Log reminder time
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Reminder: ${todo.title}`,
          body: `Don't forget your task...`,
          sound: true,
        },
        trigger: {
          seconds: reminderTime.diff(moment(), 'seconds'),
        },
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  // AsyncStorage'den görevleri yükleme
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

  // Görevleri AsyncStorage'e kaydetme
  const saveTodos = async (updatedTodos) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTodos));
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  };

  // Bildirim izni isteme
  useEffect(() => {
    loadTodos();
    const requestNotificationPermission = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Please allow notifications so that you do not miss your tasks.');
      }
    };
    requestNotificationPermission();
  }, []);

  // Yeni görev ekleme
  const addTodo = async (newTodo) => {
    const updatedTodos = [newTodo, ...todos];
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
    await scheduleNotification(newTodo); // Bildirim planlama
  };

  // Görev silme
  const deleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  // Görev güncelleme
  const updateTodo = (id, updatedTodo) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, ...updatedTodo } : todo
    );
    
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  // Context değerlerini sağlayan obje
  const value = {
    todos,
    addTodo,
    deleteTodo,
    updateTodo,
    setDueTime, // Provide the setter for dueTime to be used in the TimePicker
    scheduleNotification,
    showCongrats, 
    setShowCongrats
  };

  return <TodoListContext.Provider value={value}>{children}</TodoListContext.Provider>;
};

// TodoListContext kullanımı için özel hook
export const useTodoListContext = () => {
  const context = useContext(TodoListContext);
  if (context === undefined) {
    throw new Error('useTodoListContext must be used within a TodoListProvider');
  }
  return context;
};
