import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { useTodoListContext } from '../context/todos-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";


const NotificationModal = () => {
  const { todos } = useTodoListContext(); // Context'ten todos alınıyor
  const [showModal, setShowModal] = useState(false);
  const STORAGE_KEY = 'reminder_time';

  // For clearing asyncstorage..
//   const clearReminder = async () => {
//     try {
//       await AsyncStorage.removeItem('daily_notification');
//       console.log('Reminder cleared from AsyncStorage');
//     } catch (error) {
//       console.error('Error clearing reminder:', error);
//     }
//   };
//   clearReminder();

  const today = new Date().toISOString().split('T')[0]; // Bugünün tarihi

  // Bugüne ait görevleri kontrol et
  const checkTodosForToday = async () => {
    try {
      const storedReminderTime = await AsyncStorage.getItem(STORAGE_KEY);

      if (storedReminderTime) {
        const reminderTime = new Date(storedReminderTime);
        const now = new Date();

        // Eğer hatırlatma zamanı henüz geçmediyse, modalı gösterme
        if (now < reminderTime) {
          return;
        }
      }

      // Bugüne ait görevleri kontrol et
      const todayTasks = todos.filter(
        (todo) => todo.dueDate.split('T')[0] === today && todo.status === "pending"
      );

      if (todayTasks.length > 0) {
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error checking todos:', error);
    }
  };

  // "Remind me again" seçeneği
  const remindMeAgain = async () => {
    try {
      const remindTime = new Date();
    //   remindTime.setHours(remindTime.getHours() + 2); // Şimdiden 2 saat sonrası
      remindTime.setMinutes(remindTime.getMinutes() + 1); // Şimdiden 1 dakika sonrası
      await AsyncStorage.setItem(STORAGE_KEY, remindTime.toISOString());
      setShowModal(false); // Modalı kapat
    } catch (error) {
      console.error('Error setting reminder:', error);
    }
  };

  // "Do not remind me again" seçeneği
  const doNotRemind = async () => {
    try {
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999); // Gün sonuna kadar ertele
      await AsyncStorage.setItem(STORAGE_KEY, endOfDay.toISOString());
      setShowModal(false);
      console.log("calisti");
    } catch (error) {
      console.error('Error saving reminder status:', error);
    }
  };

  // İlk yüklemede görevleri kontrol et
  useEffect(() => {
    checkTodosForToday();
  }, [todos]); // Todos değiştiğinde kontrol tekrar yapılır

  const todayToDos = todos.filter(
    (todo) => todo.dueDate.split('T')[0] === today && todo.status === "pending"
  );

  return (
    <Modal
      visible={showModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowModal(false)}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-[#d7c8f3] w-4/5 pt-4 pb-12 rounded-lg">
          <View className="items-center mb-4  px-4 ">
            <Ionicons name="notifications" size={50} color="#6a0dad" />
            <Text className="text-lg font-bold text-center mt-2">
              You have ToDo for today!
            </Text>
          </View>
          <Text className="text-sm text-gray-600 text-center mb-6  px-4 ">
            There {todayToDos.length === 1 ? 'is' : 'are'} <Text className="font-bold text-md">{todayToDos.length}</Text> ToDo
            {todayToDos.length > 1 ? 's' : ''} waiting for you today.
          </Text>
          <View className="flex-row justify-between  px-4 ">
            <TouchableOpacity
              className="bg-purple-700 px-4 py-2 rounded-lg"
              onPress={remindMeAgain}
            >
              <Text className="text-white text-center font-semibold">
                Remind
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-red-500 px-4 py-2 rounded-lg"
              onPress={doNotRemind}
            >
              <Text className="text-white text-center font-semibold">
                Dismiss
              </Text>
            </TouchableOpacity>
          </View>
            <TouchableOpacity   
             onPress={() => {
                router.push({ pathname: `dynamicday/${today}`, params: { from: 'home' } })
                setShowModal(false);
                doNotRemind()
              }}
            className="flex-row justify-center items-center bg-[#6a0dad] mt-4 p-2 w-full rounded-b-lg  border-gray-400 absolute bottom-0 left-0 w-full">
               <Text className="text-[#d7c8f3] text-center font-semibold pr-3"> See today's ToDos and 'Dismiss'!
               </Text>
               <Ionicons name="caret-forward-outline" size={20} color="#d7c8f3" />
              </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default NotificationModal;
