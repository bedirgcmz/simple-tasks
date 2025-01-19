import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Context oluştur
export const TodoListContext = createContext();

// 2. Provider bileşeni
export const TodoListProvider = ({ children }) => {
  // Todos state
  const [todos, setTodos] = useState([]);

  // AsyncStorage anahtar
  const STORAGE_KEY = 'user_todos';

  // Initial data
  const initialTodo = {
    id: '0',
    title: 'Welcome Task',
    description: 'This is your first todo!',
    category: 'Others',
    status: 'pending',
    createdAt: new Date().toISOString(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    completedAt: null,
  };

  // Verileri AsyncStorage'dan yükleme
  const loadTodos = async () => {
    try {
      const storedTodos = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      } else {
        // Eğer veri yoksa initialTodo'yu ekle
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([initialTodo]));
        setTodos([initialTodo]);
      }
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  };

  // Verileri AsyncStorage'a kaydetme
  const saveTodos = async (updatedTodos) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTodos));
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  };

  // İlk yüklemede todos verisini yükle
  useEffect(() => {
    loadTodos();
  }, []);

  // Todo ekleme fonksiyonu
  const addTodo = (newTodo) => {
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  // Todo silme fonksiyonu
  const deleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  // Todo güncelleme fonksiyonu
  const updateTodo = (id, updatedTodo) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, ...updatedTodo } : todo
    );
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  // Context value
  const value = {
    todos,
    addTodo,
    deleteTodo,
    updateTodo,
  };

  return <TodoListContext.Provider value={value}>{children}</TodoListContext.Provider>;
};

// 3. Custom hook
export const useTodoListContext = () => {
  const context = useContext(TodoListContext);

  if (context === undefined) {
    throw new Error('useTodoListContext must be used within a TodoListProvider');
  }

  return context;
};
