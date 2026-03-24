import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useTodoListContext } from "../context/todos-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { calculateDaysLeft, calculateReminderDateTime, formatToShortDate, shouldShowOffIcon } from "../utils/date-utils";
import { router } from "expo-router";
import { playSuccessSound } from "../utils/play-success-sound";
import LottieView from "lottie-react-native";
import { PremiumCard } from "./PremiumCard";
import { PremiumButton } from "./PremiumButton";
import { InfoSection } from "./InfoSection";
import { getStatusGradient, getStatusColor } from "../theme/themeColors";
import { LinearGradient } from "expo-linear-gradient";

/**
 * 🎨 Premium ToDoDetailsCard
 * Enhanced visual design with glassmorphism, gradients, and premium components
 */
const ToDoDetailsCard = ({ pTodoId, pPageTitle, setIsLoading }) => {
  const { todos, deleteTodo, updateTodo, t, language, deleteAllInGroup } = useTodoListContext();
  const [confettiVisible, setConfettiVisible] = useState(false);
  const confettiRef = useRef();

  const todo = todos.find((todo) => todo.id === pTodoId);

  if (!todo) return null;

  // ==================
  // HANDLERS
  // ==================

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

  // ==================
  // RENDER
  // ==================

  const isDone = todo.status === "done";
  const statusGradient = getStatusGradient(todo.status);

  return (
    <View className="flex-1">
      {/* ==================== HEADER ==================== */}
      <Text className="font-bold text-2xl text-center text-white mb-6">
        {pPageTitle}
      </Text>

      {/* ==================== MAIN CARD ==================== */}
      <PremiumCard className="mb-4">
        {/* STATUS HEADER with gradient */}
        <LinearGradient
          colors={statusGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-xl mb-4 p-3 flex-row items-center justify-between"
        >
          <View className="flex-1">
            <Text className="text-white/80 text-xs uppercase tracking-wider mb-1">
              {isDone ? "Completed" : "In Progress"}
            </Text>
            <Text className="text-white text-lg font-bold">
              {calculateDaysLeft(todo, t)}
            </Text>
          </View>

          {/* Toggle Checkbox */}
          <TouchableOpacity
            onPress={handleToggleStatus}
            className="w-12 h-12 items-center justify-center rounded-lg bg-white/20"
          >
            {isDone ? (
              <Ionicons name="checkbox" size={28} color="white" />
            ) : (
              <Ionicons name="square-outline" size={28} color="white" />
            )}
          </TouchableOpacity>
        </LinearGradient>

        {/* CATEGORY BADGE */}
        <View className="mb-4 flex-row gap-2 items-center">
          <LinearGradient
            colors={['rgba(249, 115, 22, 0.2)', 'rgba(249, 115, 22, 0.1)']}
            className="rounded-full px-3 py-1 flex-row items-center gap-1"
          >
            <Ionicons name="bookmarks" size={12} color="#fb923c" />
            <Text className="text-orange-300 font-semibold text-sm">
              {todo.category}
            </Text>
          </LinearGradient>

          {/* Recurring indicator */}
          {todo.isRecurring && (
            <View className="px-2 py-1 rounded-full bg-blue-500/20 border border-blue-400/30">
              <MaterialIcons name="event-repeat" size={14} color="#60a5fa" />
            </View>
          )}
        </View>

        {/* TITLE */}
        <View className="mb-4">
          <Text className="text-white text-xl font-bold leading-6">
            {todo.title}
          </Text>
        </View>

        {/* DESCRIPTION */}
        {todo.description && (
          <View className="bg-white/5 rounded-lg p-3 border border-white/10 mb-4">
            <View className="flex-row gap-2 mb-2">
              <Ionicons name="document-text" size={14} color="#60a5fa" />
              <Text className="text-white/60 text-xs uppercase tracking-wider">
                Description
              </Text>
            </View>
            <Text className="text-white/90 text-base leading-6 ml-5">
              {todo.description}
            </Text>
          </View>
        )}

        {/* DATE & TIME INFO */}
        <View className="gap-3 mb-4">
          {/* Due Date */}
          <InfoSection
            icon="calendar"
            label="Due Date"
            value={`${formatToShortDate(todo.dueDate, language, t)} at ${todo.dueTime.slice(0, 5)}`}
            highlight={true}
          />

          {/* Reminder */}
          <InfoSection
            icon={shouldShowOffIcon(todo) ? "notifications-off" : "notifications"}
            iconColor={shouldShowOffIcon(todo) ? "#94a3b8" : "#fbbf24"}
            label="Reminder"
            value={calculateReminderDateTime(todo).slice(0, 16)}
          />
        </View>

        {/* ACTION BUTTONS */}
        <View className="flex-row gap-3 mt-6">
          <View className="flex-1">
            <PremiumButton
              variant="primary"
              size="md"
              label={t("Edit_button")}
              onPress={handleUpdate}
              leftIcon={<MaterialCommunityIcons name="pencil" size={16} color="white" />}
              fullWidth
            />
          </View>

          <View className="flex-1">
            <PremiumButton
              variant="danger"
              size="md"
              label={t("Delete_button")}
              onPress={handleDelete}
              leftIcon={<MaterialCommunityIcons name="trash-can" size={16} color="white" />}
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
