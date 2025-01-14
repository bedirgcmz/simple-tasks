import React from 'react'
import { Stack } from 'expo-router'

const TodosLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'All ToDo' }} />
      <Stack.Screen name="[id]" options={{ title: 'Todo Details' }} />
    </Stack>
  )
}

export default TodosLayout
