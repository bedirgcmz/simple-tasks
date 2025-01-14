import React from 'react';
import { FlatList, ScrollView } from 'react-native';
import { useTodoListContext } from '../../../context/todos-context';
import Todo from '../../../components/todo';

const TodosScreen = () => {
  const { todos } = useTodoListContext();
console.log(todos[0]);
  return (
      <FlatList
      className="p-2 bg-white"
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
      <Todo todo={item} index={index}/>
        )}
      />
  );
};

export default TodosScreen;

