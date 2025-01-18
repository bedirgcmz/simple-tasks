import React from 'react'
import { Stack } from 'expo-router'

const DynamicLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{title: 'Dynamic Categori Home',  headerShown: false }}  />
      <Stack.Screen name="[day]" options={{ title: 'Dynamic Categori page', headerShown: false }} />
    </Stack>
  )
}

export default DynamicLayout
