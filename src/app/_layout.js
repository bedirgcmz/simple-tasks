import React from 'react';
import { Stack } from 'expo-router';
import { TodoListProvider } from '../context/todos-context';
import { StatusBar } from 'expo-status-bar';

const RootLayout = () => {
  return (
    <TodoListProvider>
<StatusBar style="light" backgroundColor="transparent" translucent />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </TodoListProvider>
  );
};

export default RootLayout;
