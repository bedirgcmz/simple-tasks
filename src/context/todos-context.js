import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

export const TodoListContext = createContext();

export const TodoListProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const STORAGE_KEY = 'user_todos';
console.log(todos);
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const initialTodo = {
    id: '0',
    title: 'Welcome Simple Tasks',
    description: 'Lets create new ToDos. This is your first ToDo!',
    category: 'Others',
    status: 'pending',
    createdAt: formatDate(new Date()),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    reminderTime: '1 day before',
    completedAt: null,
  };

  const calculateReminderTime = (dueDate, reminderOption) => {
    const dueDateObj = new Date(dueDate);
    const reminderMap = {
      "5 minutes before": 5 * 60 * 1000,
      "10 minutes before": 5 * 60 * 1000,
      "30 minutes before": 5 * 60 * 1000,
      "1 hour before": 1 * 60 * 60 * 1000,
      "2 hours before": 2 * 60 * 60 * 1000,
      "5 hours before": 2 * 60 * 60 * 1000,
      "1 day before": 24 * 60 * 60 * 1000,
    };
    const reminderOffset = reminderMap[reminderOption || "2 hours before"];
    return new Date(dueDateObj.getTime() - reminderOffset);
  };

  const scheduleNotification = async (todo) => {
    try {
      const reminderTime = calculateReminderTime(todo.dueDate, todo.reminderTime);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Reminder: ${todo.title}`,
          body: `Don't forget your task: ${todo.description}`,
          sound: true,
        },
        trigger: reminderTime,
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
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

  useEffect(() => {
    loadTodos();
    const requestNotificationPermission = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Notification permissions are required.');
      }
    };
    requestNotificationPermission();
  }, []);

  const addTodo = async (newTodo) => {
    const updatedTodos = [newTodo, ...todos];
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
    await scheduleNotification(newTodo);
  };

  const deleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  const updateTodo = (id, updatedTodo) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, ...updatedTodo } : todo
    );
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  const value = {
    todos,
    addTodo,
    deleteTodo,
    updateTodo,
    scheduleNotification
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
