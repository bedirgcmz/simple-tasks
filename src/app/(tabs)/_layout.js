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
          iconName = focused ? 'list-circle'
          : 'list-circle-outline'; 
          } else if (route.name === 'todos') {
          iconName = focused ?  'add-circle' : 'add-circle-outline';
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
          options={{ headerShown: false, headerTitle: 'Add Todo', tabBarLabel: 'ToDos', }} 
        />
      <Tabs.Screen 
        name="todos" 
        options={{ headerShown: false, headerTitle: 'Add New Todo', title: 'Add' }} 
      />
    </Tabs>
  )
}

export default TabsLayout
