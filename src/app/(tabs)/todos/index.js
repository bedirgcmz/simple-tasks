// import { View, Text, Pressable } from 'react-native'
// import React from 'react'
// import { Link, router } from 'expo-router'
// import myTodos from '../../../../assets/data/todo-list';


import React from 'react';
import { View, Text, FlatList, ScrollView } from 'react-native';
import { useTodoListContext } from '../../../context/todos-context';
import Todo from '../../../components/todo';

const TodosScreen = () => {
  const { todos } = useTodoListContext();
console.log(todos[0]);
  return (
    <ScrollView>
      <Todo todo={todos[0]} />
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.title}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />
    </ScrollView>
  );
};

export default TodosScreen;

