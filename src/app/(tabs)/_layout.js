import React from 'react'
import { Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';

const TabsLayout = () => {
  return (
    <Tabs
    screenOptions={
      ({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'index') {
          iconName = focused 
              ? 'home' : 'home-outline';
              // ? 'checkmark-circle' : 'checkmark-circle-outline';
          } else if (route.name === 'add/index') {
          iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'todos') {
          iconName = focused ? 'list-circle'
          : 'list-circle-outline'; 
          }

          return <Ionicons name={iconName}  size={size} color={color} />;
      },
      tabBarActiveTintColor: 'tomato',
      tabBarInactiveTintColor: 'gray',
      })
}
    >
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
