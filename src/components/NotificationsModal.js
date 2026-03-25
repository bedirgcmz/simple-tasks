import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { useTodoListContext } from '../context/todos-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from "expo-router";


const NotificationModal = () => {
  const { todos, t } = useTodoListContext();
  const [showModal, setShowModal] = useState(false);
  const [storedDay, setStoredDay] = useState("");
  const STORAGE_REMIND_KEY = 'app_reminder_time_for_today';
  const STORAGE_DAY_KEY = 'app_last_checked_day';

  const today = new Date().toISOString().split('T')[0];

  const checkTodosForToday = async () => {
    try {
      let lastCheckedDay = await AsyncStorage.getItem(STORAGE_DAY_KEY);

      if (!lastCheckedDay || lastCheckedDay !== today) {
        await AsyncStorage.setItem(STORAGE_DAY_KEY, today);
        await AsyncStorage.removeItem(STORAGE_REMIND_KEY);
        setStoredDay(today);
      }

      const storedReminderTime = await AsyncStorage.getItem(STORAGE_REMIND_KEY);
      if (storedReminderTime) {
        const reminderTime = new Date(storedReminderTime);
        const now = new Date();
        if (now < reminderTime) return;
      }

      const todayTasks = todos.filter((todo) => {
        const dueDateStr = todo.dueDate.includes('T') ? todo.dueDate.split('T')[0] : todo.dueDate;
        return dueDateStr === today && todo.status === "pending";
      });

      if (todayTasks.length > 0) {
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error checking todos:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await checkTodosForToday();
    };
    fetchData();
  }, [todos]);

  const remindMeAgain = async () => {
    try {
      const remindTime = new Date();
      remindTime.setHours(remindTime.getHours() + 2);
      await AsyncStorage.setItem(STORAGE_REMIND_KEY, remindTime.toISOString());
      setShowModal(false);
    } catch (error) {
      console.error('Error setting reminder:', error);
    }
  };

  const doNotRemind = async () => {
    try {
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      await AsyncStorage.setItem(STORAGE_REMIND_KEY, endOfDay.toISOString());
      setShowModal(false);
    } catch (error) {
      console.error('Error saving reminder status:', error);
    }
  };

  const todayToDos = todos.filter(
    (todo) => todo.dueDate === today && todo.status === "pending"
  );

  return (
    <Modal
      visible={showModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowModal(false)}
    >
      {/* Backdrop */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setShowModal(false)}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'center', alignItems: 'center' }}
      >
        {/* Card — stop propagation */}
        <TouchableOpacity activeOpacity={1} style={{ width: '82%' }}>
          <View
            style={{
              borderRadius: 20,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.14)',
              shadowColor: '#000',
              shadowOpacity: 0.6,
              shadowRadius: 24,
              shadowOffset: { width: 0, height: 10 },
              elevation: 16,
            }}
          >
            <LinearGradient
              colors={['#130b30', '#0b1a45']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={{ borderRadius: 20 }}
            >
              {/* Header */}
              <View style={{ alignItems: 'center', paddingTop: 28, paddingHorizontal: 20, paddingBottom: 16 }}>
                {/* Icon glow ring */}
                <View style={{
                  width: 64, height: 64, borderRadius: 32,
                  backgroundColor: 'rgba(251,191,36,0.12)',
                  borderWidth: 1.5, borderColor: 'rgba(251,191,36,0.35)',
                  alignItems: 'center', justifyContent: 'center',
                  marginBottom: 14,
                  shadowColor: '#fbbf24', shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 0 },
                }}>
                  <Ionicons name="notifications" size={30} color="#fbbf24" />
                </View>

                <Text style={{ color: 'white', fontSize: 17, fontWeight: '800', textAlign: 'center', marginBottom: 8 }}>
                  {t("Notification_modal_1")}
                </Text>

                <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, textAlign: 'center', lineHeight: 19 }}>
                  {t("Notification_modal_2")}{' '}
                  <Text style={{ color: '#fbbf24', fontWeight: '800', fontSize: 15 }}>
                    {todayToDos.length}
                  </Text>
                </Text>
              </View>

              {/* Divider */}
              <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.07)', marginHorizontal: 16 }} />

              {/* Buttons */}
              <View style={{ flexDirection: 'row', gap: 10, padding: 16 }}>
                {/* Remind later */}
                <TouchableOpacity
                  onPress={remindMeAgain}
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(96,165,250,0.14)',
                    borderWidth: 1, borderColor: 'rgba(96,165,250,0.30)',
                    borderRadius: 12, paddingVertical: 11,
                    alignItems: 'center',
                  }}
                >
                  <Ionicons name="time-outline" size={16} color="#93c5fd" style={{ marginBottom: 3 }} />
                  <Text style={{ color: '#93c5fd', fontSize: 12, fontWeight: '700', textAlign: 'center' }}>
                    {t("Notification_modal_3")}
                  </Text>
                </TouchableOpacity>

                {/* Dismiss */}
                <TouchableOpacity
                  onPress={doNotRemind}
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(248,113,113,0.14)',
                    borderWidth: 1, borderColor: 'rgba(248,113,113,0.30)',
                    borderRadius: 12, paddingVertical: 11,
                    alignItems: 'center',
                  }}
                >
                  <Ionicons name="close-circle-outline" size={16} color="#fca5a5" style={{ marginBottom: 3 }} />
                  <Text style={{ color: '#fca5a5', fontSize: 12, fontWeight: '700', textAlign: 'center' }}>
                    {t("Notification_modal_4")}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Go to today CTA */}
              <TouchableOpacity
                onPress={() => {
                  router.push({ pathname: `dynamicday/${today}`, params: { from: 'home' } });
                  setShowModal(false);
                  doNotRemind();
                }}
                style={{ marginHorizontal: 16, marginBottom: 20 }}
              >
                <LinearGradient
                  colors={['#fb923c', '#ea580c']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    borderRadius: 14, paddingVertical: 13,
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 14, fontWeight: '800' }}>
                    {t("Notification_modal_5")}
                  </Text>
                  <Ionicons name="caret-forward-outline" size={16} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default NotificationModal;
