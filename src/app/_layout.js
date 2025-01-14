import React from 'react';
import { Stack } from 'expo-router';
import { TodoListProvider } from '../context/todos-context';

const RootLayout = () => {
  return (
    <TodoListProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </TodoListProvider>
  );
};

export default RootLayout;
