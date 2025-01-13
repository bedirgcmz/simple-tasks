import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { Link, router } from 'expo-router'

const TodosScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>All Todos Screen</Text>
      <Link href="/todos/1">Task 1</Link>
      <Pressable onPress={() => router.push('/todos/2')}>
        <Text>Task 2</Text>
      </Pressable>
    </View>
  )
}

export default TodosScreen
