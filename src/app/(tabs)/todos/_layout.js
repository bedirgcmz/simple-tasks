import React from 'react'
import { Stack } from 'expo-router'

const TodosLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'All Tasks' }} />
      <Stack.Screen name="[id]" options={{ title: 'Task Details' }} />
    </Stack>
  )
}

export default TodosLayout
