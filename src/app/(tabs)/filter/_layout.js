import React from 'react'
import { Stack } from 'expo-router'

const FilterLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{title: 'Filter ToDos',  headerShown: false }}  />
    </Stack>
  )
}

export default FilterLayout
