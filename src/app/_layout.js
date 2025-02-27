import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { TodoListProvider } from '../context/todos-context';
import { StatusBar } from 'expo-status-bar';
import NotificationModal from '../components/NotificationsModal';
import { registerForPushNotificationsAsync } from '../utils/registerForPushNotifications';

const RootLayout = () => {

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);
  return (
    <TodoListProvider>
      <StatusBar style="light" backgroundColor="transparent" translucent />
      <NotificationModal />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </TodoListProvider>
  );
};

export default RootLayout;
