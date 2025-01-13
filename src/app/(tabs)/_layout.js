import React from 'react'
import { Tabs } from 'expo-router'

const TabsLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen 
        name="index" 
        options={{ headerShown: true, headerTitle: 'Home', title: 'Home' }} 
      />
        <Tabs.Screen 
          name="add/index" 
          options={{ headerShown: true, headerTitle: 'Add Todo', tabBarLabel: 'Add', }} 
        />
      <Tabs.Screen 
        name="todos" 
        options={{ headerShown: false, headerTitle: 'Todos', title: 'ToDo' }} 
      />
    </Tabs>
  )
}

export default TabsLayout
