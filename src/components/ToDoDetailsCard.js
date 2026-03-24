import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useTodoListContext } from "../context/todos-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { calculateDaysLeft, calculateReminderDateTime, shouldShowOffIcon } from "../utils/date-utils";

const MONTH_NAMES = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  tr: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"],
  sv: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
  de: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
};

// "YYYY-MM-DD" → "17 Apr 2025"
const formatDateFull = (dateStr, language = "en") => {
  const [year, month, day] = dateStr.split("-");
  const months = MONTH_NAMES[language] ?? MONTH_NAMES.en;
  return `${parseInt(day, 10)} ${months[parseInt(month, 10) - 1]} ${year}`;
};
import { router } from "expo-router";
import { playSuccessSound } from "../utils/play-success-sound";
import LottieView from "lottie-react-native";
import { PremiumCard } from "./PremiumCard";
import { PremiumButton } from "./PremiumButton";
import { getStatusGradient } from "../theme/themeColors";
import { LinearGradient } from "expo-linear-gradient";

const ToDoDetailsCard = ({ pTodoId, pPageTitle, setIsLoading }) => {
  const { todos, deleteTodo, updateTodo, t, language, deleteAllInGroup } = useTodoListContext();
  const [confettiVisible, setConfettiVisible] = useState(false);
  const confettiRef = useRef();

  const todo = todos.find((todo) => todo.id === pTodoId);

  if (!todo) return null;

  const handleDelete = () => {
    if (todo.repeatGroupId) {
      Alert.alert(
        t("Recurring_Task"),
        t("Recurring_Delete_Question"),
        [
          {
            text: t("Only_This"),
            onPress: async () => {
              setIsLoading(true);
              await deleteTodo(todo.id);
              setIsLoading(false);
            },
            style: "default",
          },
          {
            text: t("Delete_All"),
            onPress: async () => {
              setIsLoading(true);
              await deleteAllInGroup(todo.repeatGroupId);
              setIsLoading(false);
            },
            style: "destructive",
          },
          { text: t("Cancel"), style: "cancel" },
        ],
        { cancelable: true }
      );
    } else {
      Alert.alert(
        t("Delete"),
        t("Delete_Confirmation"),
        [
          { text: t("Cancel"), style: "cancel" },
          {
            text: t("Delete"),
            onPress: async () => {
              setIsLoading(true);
              await deleteTodo(todo.id);
              setIsLoading(false);
            },
            style: "destructive",
          },
        ],
        { cancelable: true }
      );
    }
  };

  const handleUpdate = () => {
    if (todo.repeatGroupId) {
      router.push({
        pathname: `/edit-recurring/${pTodoId}`,
        params: { from: "details" },
      });
    } else {
      router.push({
        pathname: `/edit/${pTodoId}`,
        params: { from: "details" },
      });
    }
  };

  const handleToggleStatus = async () => {
    await updateTodo(todo.id, {
      ...todo,
      status: todo.status === "done" ? "pending" : "done",
    });

    if (todo.status !== "done") {
      playSuccessSound();
      playConfetti();
    }
  };

  const playConfetti = () => {
    setConfettiVisible(true);
    setTimeout(() => {
      confettiRef?.current?.play();
    }, 100);
    setTimeout(() => {
      setConfettiVisible(false);
    }, 3000);
  };

  useEffect(() => {
    if (todo.status === "done") {
      playConfetti();
    }
  }, [todo]);

  const isDone = todo.status === "done";
  const statusGradient = getStatusGradient(todo.status);
  const reminderOff = shouldShowOffIcon(todo);
  const statusGlowColor = isDone ? '#4ade80' : '#3b82f6';

  return (
    <View className="flex-1">
      {/* PAGE TITLE */}
      <Text className="font-bold text-2xl text-center text-white mb-5">
        {pPageTitle}
      </Text>

      {/* MAIN CARD */}
      <PremiumCard className="mb-4">

        {/* ── STATUS BANNER ── */}
        <LinearGradient
          colors={statusGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0.8 }}
          style={{
            borderRadius: 16,
            marginBottom: 16,
            paddingHorizontal: 14,
            paddingVertical: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            shadowColor: statusGlowColor,
            shadowOpacity: 0.45,
            shadowRadius: 14,
            shadowOffset: { width: 0, height: 6 },
          }}
        >
          {/* Left: status label + days left */}
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={{ color: 'rgba(255,255,255,0.70)', fontSize: 10, letterSpacing: 2, fontWeight: '600', textTransform: 'uppercase', marginBottom: 3 }}>
              {isDone ? t("Done") : "In Progress"}
            </Text>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: '800' }}>
              {calculateDaysLeft(todo, t)}
            </Text>
          </View>

          {/* Right: checkbox + category stacked */}
          <View style={{ alignItems: 'center', gap: 6 }}>
            <TouchableOpacity
              onPress={handleToggleStatus}
              activeOpacity={0.75}
              style={{
                width: 38, height: 38,
                alignItems: 'center', justifyContent: 'center',
                borderRadius: 12,
                backgroundColor: 'rgba(255,255,255,0.22)',
                borderWidth: 1.5,
                borderColor: 'rgba(255,255,255,0.35)',
              }}
            >
              {isDone ? (
                <Ionicons name="checkbox" size={22} color="white" />
              ) : (
                <Ionicons name="square-outline" size={22} color="white" />
              )}
            </TouchableOpacity>

            {/* Category badge */}
            <View style={{
              flexDirection: 'row', alignItems: 'center', gap: 4,
              paddingHorizontal: 8, paddingVertical: 3,
              borderRadius: 20,
              backgroundColor: 'rgba(0,0,0,0.22)',
              borderWidth: 1, borderColor: 'rgba(255,255,255,0.20)',
            }}>
              <Ionicons name="bookmarks" size={10} color="rgba(255,255,255,0.85)" />
              <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '600' }}>
                {todo.category}
              </Text>
              {todo.isRecurring && (
                <MaterialIcons name="event-repeat" size={11} color="rgba(255,255,255,0.85)" />
              )}
            </View>
          </View>
        </LinearGradient>

        {/* ── TITLE ── */}
        <View className="flex-row items-center gap-2 mb-1">
          <MaterialCommunityIcons name="clipboard-text-outline" size={22} color="rgba(255,255,255,0.35)" />
          <Text className="text-white text-2xl font-extrabold leading-8 flex-1">
            {todo.title}
          </Text>
        </View>
        <View
          className="mb-4 mt-2"
          style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.08)' }}
        />

        {/* ── DESCRIPTION ── */}
        {todo.description && (
          <View
            className="rounded-2xl p-4 mb-4"
            style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.09)',
            }}
          >
            <View className="flex-row items-center gap-2 mb-2">
              <Ionicons name="document-text" size={13} color="#60a5fa" />
              <Text
                className="text-white/50 text-xs font-semibold uppercase"
                style={{ letterSpacing: 1.5 }}
              >
                Description
              </Text>
            </View>
            <Text className="text-white/85 text-base leading-6 ml-5">
              {todo.description}
            </Text>
          </View>
        )}

        {/* ── INFO SECTIONS ── */}
        <View className="gap-3 mb-5">
          {/* Due Date */}
          <View
            className="rounded-2xl px-4 pt-3 pb-4"
            style={{
              backgroundColor: 'rgba(96,165,250,0.07)',
              borderWidth: 1,
              borderColor: 'rgba(96,165,250,0.18)',
              borderLeftWidth: 3,
              borderLeftColor: '#60a5fa',
            }}
          >
            {/* Label */}
            <View className="flex-row items-center gap-2 mb-3">
              <Ionicons name="calendar" size={13} color="#60a5fa" />
              <Text
                className="text-white/50 text-xs font-semibold uppercase"
                style={{ letterSpacing: 1.5 }}
              >
                Due Date
              </Text>
            </View>
            {/* Date & Time — same row */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-1.5">
                <Ionicons name="calendar-outline" size={15} color="#93c5fd" />
                <Text className="text-blue-300 text-base font-bold">
                  {formatDateFull(todo.dueDate, language)}
                </Text>
              </View>
              <View className="flex-row items-center gap-1.5">
                <Ionicons name="time-outline" size={15} color="#93c5fd" />
                <Text className="text-blue-200 text-base font-semibold">
                  {todo.dueTime.slice(0, 5)}
                </Text>
              </View>
            </View>
          </View>

          {/* Reminder */}
          <View
            className="rounded-2xl px-4 pt-3 pb-4"
            style={{
              backgroundColor: reminderOff
                ? 'rgba(148,163,184,0.06)'
                : 'rgba(251,191,36,0.07)',
              borderWidth: 1,
              borderColor: reminderOff
                ? 'rgba(148,163,184,0.15)'
                : 'rgba(251,191,36,0.20)',
              borderLeftWidth: 3,
              borderLeftColor: reminderOff ? '#94a3b8' : '#fbbf24',
            }}
          >
            {/* Label */}
            <View className="flex-row items-center gap-2 mb-3">
              <Ionicons
                name={reminderOff ? "notifications-off" : "notifications"}
                size={13}
                color={reminderOff ? "#94a3b8" : "#fbbf24"}
              />
              <Text
                className="text-white/50 text-xs font-semibold uppercase"
                style={{ letterSpacing: 1.5 }}
              >
                Reminder
              </Text>
            </View>
            {/* Date & Time — same row */}
            {(() => {
              const reminderStr = calculateReminderDateTime(todo) ?? "";
              const datePart = reminderStr.slice(0, 10);  // "YYYY-MM-DD"
              const timePart = reminderStr.slice(11, 16); // "HH:mm"
              const valueColor = reminderOff ? '#94a3b8' : '#fde68a';
              return (
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-1.5">
                    <Ionicons name="calendar-outline" size={15} color={valueColor} />
                    <Text className="text-base font-bold" style={{ color: valueColor }}>
                      {formatDateFull(datePart, language)}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1.5">
                    <Ionicons name="time-outline" size={15} color={valueColor} />
                    <Text className="text-base font-semibold" style={{ color: valueColor }}>
                      {timePart}
                    </Text>
                  </View>
                </View>
              );
            })()}
          </View>
        </View>

        {/* ── ACTION BUTTONS ── */}
        <View className="flex-row gap-3">
          <View className="flex-1">
            <PremiumButton
              variant="primary"
              size="lg"
              label={t("Edit_button")}
              onPress={handleUpdate}
              leftIcon={<MaterialCommunityIcons name="pencil" size={18} color="white" />}
              showArrow={false}
              fullWidth
            />
          </View>
          <View className="flex-1">
            <PremiumButton
              variant="danger"
              size="lg"
              label={t("Delete_button")}
              onPress={handleDelete}
              leftIcon={<MaterialCommunityIcons name="trash-can" size={18} color="white" />}
              showArrow={false}
              fullWidth
            />
          </View>
        </View>
      </PremiumCard>

      {/* CONFETTI ANIMATION */}
      {confettiVisible && (
        <LottieView
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 15,
          }}
          source={require('../../assets/data/confetti.json')}
          ref={confettiRef}
          loop={false}
          autoPlay={false}
          speed={2.3}
        />
      )}
    </View>
  );
};

export default ToDoDetailsCard;
