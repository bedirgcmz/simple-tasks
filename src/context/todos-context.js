import { createContext, useContext, useState } from 'react';

// 1. Context oluştur
export const TodoListContext = createContext();

// 2. Provider bileşeni
export const TodoListProvider = ({ children }) => {
  // Todos state
  const [todos, setTodos] = useState(
    [
      {
        id: '1',
        title: 'Learn React Native',
        description: 'Practice building a simple app',
        status: "pending",
        createdAt: '2025-01-01T00:00:00.000Z',
        dueDate: '2025-01-15T00:00:00.000Z',
        completedAt: null,
      },
      {
        id: '2',
        title: 'Read a book',
        description: 'Complete reading "Clean Code"',
        status: "done",
        createdAt: '2025-01-02T00:00:00.000Z',
        dueDate: '2025-01-16T00:00:00.000Z',
        completedAt: '2025-01-14T00:00:00.000Z',
      },
      {
        id: '3',
        title: 'Get rest',
        description: 'You deserve it',
        status: "pending",
        createdAt: '2025-01-05T00:00:00.000Z',
        dueDate: '2025-01-23T00:00:00.000Z',
        completedAt: '2025-01-09T00:00:00.000Z',
      },
      {
        id: '4',
        title: 'Buy a computer',
        description: 'Complete last project, Complete last project, Complete last project, Complete last project, Complete last project',
        status: "done",
        createdAt: '2025-01-05T00:00:00.000Z',
        dueDate: '2025-01-08T00:00:00.000Z',
        completedAt: '2025-01-09T00:00:00.000Z',
      },
      {
        id: '5',
        title: 'Buy a computer',
        description: 'Complete last project',
        status: "pending",
        createdAt: '2025-01-05T00:00:00.000Z',
        dueDate: '2025-01-16T00:00:00.000Z',
        completedAt: '2025-01-19T00:00:00.000Z',
      },
    ]
  );

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
