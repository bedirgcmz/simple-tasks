import React from 'react'
import { Stack } from 'expo-router'

const DynamicLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{title: 'Add ToDo',  headerShown: false }}  />
      <Stack.Screen name="[day]" options={{ title: 'Todo Details', headerShown: false }} />
    </Stack>
  )
}

export default DynamicLayout
