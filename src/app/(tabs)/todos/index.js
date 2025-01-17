import React, { useEffect } from 'react';
import { FlatList, ScrollView, StatusBar } from 'react-native';
import { useTodoListContext } from '../../../context/todos-context';
import Todo from '../../../components/todo';

const TodosScreen = () => {
  const { todos } = useTodoListContext();

  // useEffect(() => {
  //   StatusBar.setBarStyle('dark-content', true); // Light content for this screen
  // }, []);

  return (
    <>
      <FlatList
      className="p-2 bg-white"
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
      <Todo todo={item} index={index}/>
        )}
      />
    <StatusBar style="dark"/>

    </>
  );
};

export default TodosScreen;

