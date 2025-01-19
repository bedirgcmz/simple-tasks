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
        category: 'School',
        status: "pending",
        createdAt: '2025-01-01',
        dueDate: '2025-01-16',
        completedAt: null,
      },
      {
        id: '2',
        title: 'Read a book',
        description: 'Complete reading "Clean Code" Complete reading "Clean Code" Complete reading "Clean Code" Complete reading "Clean Code" Complete reading "Clean Code"',
        category: 'School',
        status: "done",
        createdAt: '2025-01-02',
        dueDate: '2025-01-16',
        completedAt: '2025-01-14',
      },
      {
        id: '15',
        title: 'Read a book',
        description: 'Complete reading "Clean Code"',
        category: 'School',
        status: "done",
        createdAt: '2025-01-02',
        dueDate: '2025-01-16',
        completedAt: '2025-01-14',
      },
      {
        id: '3',
        title: 'Get rest',
        description: 'You deserve it',
        category: 'Family',
        status: "pending",
        createdAt: '2025-01-05',
        dueDate: '2025-01-17',
        completedAt: null,
      },
      {
        id: '4',
        title: 'Call mom',
        description: 'Have a chat with mom about the weekend plans',
        category: 'Family',
        status: "done",
        createdAt: '2025-01-04',
        dueDate: '2025-01-05',
        completedAt: '2025-01-05',
      },
      {
        id: '5',
        title: 'Buy groceries',
        description: 'Get milk, bread, and eggs from the store',
        category: 'Shopping',
        status: "pending",
        createdAt: '2025-01-10',
        dueDate: '2025-01-12',
        completedAt: null,
      },
      {
        id: '6',
        title: 'Buy a new phone',
        description: 'Find the best deal on a smartphone',
        category: 'Shopping',
        status: "done",
        createdAt: '2025-01-03',
        dueDate: '2025-01-06',
        completedAt: '2025-01-06',
      },
      {
        id: '7',
        title: 'Watch a movie',
        description: 'Enjoy a classic film with friends',
        category: 'Fun',
        status: "pending",
        createdAt: '2025-01-15',
        dueDate: '2025-01-18',
        completedAt: null,
      },
      {
        id: '8',
        title: 'Attend a concert',
        description: 'Live performance by a favorite artist',
        category: 'Fun',
        status: "done",
        createdAt: '2025-01-05',
        dueDate: '2025-01-07',
        completedAt: '2025-01-07',
      },
      {
        id: '9',
        title: 'Prepare project slides',
        description: 'Create slides for the upcoming presentation',
        category: 'Work',
        status: "pending",
        createdAt: '2025-01-12',
        dueDate: '2025-01-20',
        completedAt: null,
      },
      {
        id: '10',
        title: 'Submit report',
        description: 'Send the finalized report to the manager',
        category: 'Work',
        status: "done",
        createdAt: '2025-01-02',
        dueDate: '2025-01-03',
        completedAt: '2025-01-03',
      },
      {
        id: '11',
        title: 'Go hiking',
        description: 'Plan a trip with friends to explore nature',
        category: 'Friends',
        status: "pending",
        createdAt: '2025-01-14',
        dueDate: '2025-02-20',
        completedAt: null,
      },
      {
        id: '12',
        title: 'Celebrate birthday',
        description: 'Throw a surprise birthday party for a friend',
        category: 'Friends',
        status: "done",
        createdAt: '2025-01-05',
        dueDate: '2025-01-06',
        completedAt: '2025-01-06',
      },
      {
        id: '13',
        title: 'Organize files',
        description: 'Sort and backup old documents',
        category: 'Others',
        status: "pending",
        createdAt: '2025-01-13',
        dueDate: '2025-01-19',
        completedAt: null,
      },
      {
        id: '14',
        title: 'Renew passport',
        description: 'Complete application for passport renewal',
        category: 'Others',
        status: "done",
        createdAt: '2025-01-02',
        dueDate: '2025-01-08',
        completedAt: '2025-01-08',
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
