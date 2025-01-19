import React from 'react'
import { Stack } from 'expo-router'

const ListLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{title: 'List Of ToDos',  headerShown: false }}  />
    </Stack>
  )
}

export default ListLayout
