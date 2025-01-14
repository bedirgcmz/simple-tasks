import { createContext, useContext, useState } from 'react';

// 1. Context oluştur
export const TodoListContext = createContext();

// 2. Provider bileşeni
export const TodoListProvider = ({ children }) => {
  // Todos state
  const [todos, setTodos] = useState([
    {
      id: '1',
      title: 'Learn React Native',
      description: 'Practice building a simple app',
      createdAt: '2025-01-01',
      dueDate: '2025-01-10',
      completedAt: null,
    },
    {
      id: '2',
      title: 'Read a book',
      description: 'Complete reading "Clean Code"',
      createdAt: '2025-01-02',
      dueDate: '2025-01-15',
      completedAt: '2025-01-14',
    },
  ]);

  // Todo ekleme fonksiyonu
  const addTodo = (newTodo) => {
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  // Todo silme fonksiyonu
  const deleteTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  // Todo güncelleme fonksiyonu
  const updateTodo = (id, updatedTodo) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? { ...todo, ...updatedTodo } : todo))
    );
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
