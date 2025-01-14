import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { Link, router } from 'expo-router'
import myTodos from '../../../../assets/data/todo-list';


const TodosScreen = () => {
  const firstTodo = myTodos[0]; 
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>All Todos Screen</Text>
      <Link href="/todos/1">Task 1</Link>
      <Pressable onPress={() => router.push('/todos/2')}>
        <Text>Task 2</Text>
      </Pressable>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{firstTodo.title}</Text>
      <Text>{firstTodo.description}</Text>
      <Text>{firstTodo.dueDate}</Text>
    </View>
      
    </View>
  )
}

export default TodosScreen
