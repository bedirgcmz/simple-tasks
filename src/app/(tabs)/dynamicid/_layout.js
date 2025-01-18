import React from 'react'
import { Stack } from 'expo-router'

const DynamicLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{title: 'Dynamic Id home',  headerShown: false }}  />
      <Stack.Screen name="[id]" options={{ title: 'Dynamic Id Page', headerShown: false }} />
    </Stack>
  )
}

export default DynamicLayout
