import React from 'react'
import { Stack } from 'expo-router'

const AddLayout = () => {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{ 
        title: "Tek Seferlik", 
        headerShown: false ,
        animation: "slide_from_left", // Sağdan sola geçiş efekti
        gestureEnabled: true, // Kaydırma hareketi etkinleştirildi
    }} />
      <Stack.Screen name="add-recurring" options={{ 
        title: "Tekrarlı", 
        headerShown: false,
        animation: "slide_from_right", // Sağdan sola geçiş efekti
        gestureEnabled: true, // Kaydırma hareketi etkinleştirildi
         }} />
    </Stack>
  )
}

export default AddLayout
