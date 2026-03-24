import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { calculateDaysLeft, truncateText } from "../utils/date-utils";
import { router } from 'expo-router'
import { useTodoListContext } from '../context/todos-context';
import { playSuccessSound } from "../utils/play-success-sound";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from "expo-linear-gradient";
import { getStatusGradient, getStatusColor, THEME } from "../theme/themeColors";

const TodoCard = ({ todo, fromText, setIsLoading }) => {
  const { deleteTodo, updateTodo, setShowCongrats, t, deleteAllInGroup } = useTodoListContext();

  const handleDelete = () => {
    if (todo.repeatGroupId) {
      Alert.alert(
        t("Recurring_Task"),
        t("Recurring_Delete_Question"),
        [
          {
            text: t("Only_This"),
            onPress: async () => {
              setIsLoading(true)
              await deleteTodo(todo.id); // Tek todo’yu sil
              setIsLoading(false)
            },
            style: "default",
          },
          {
            text: t("Delete_All"),
            onPress: async () => {
              setIsLoading(true)
              await deleteAllInGroup(todo.repeatGroupId); // Tüm grubu ve bildirimleri sil
              setIsLoading(false)
            },
            style: "destructive",
          },
          {
            text: t("Cancel"),
            style: "cancel",
          },
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
              setIsLoading(true)
              await deleteTodo(todo.id);
              setIsLoading(false)
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
        pathname: `/edit-recurring/${todo.id}`,
        params: { from: "list" },
      })
    } else {
      router.push({
        pathname: `/edit/${todo.id}`,
        params: { from: "list" },
      })
    }
  }

  const isDone = todo.status === "done";
  const statusGradient = getStatusGradient(todo.status);
  const statusColor = getStatusColor(todo.status);

  return (
    // Shadow wrapper — overflow:hidden olan element'e shadow uygulanamaz iOS'ta
    <View
      className="mr-4"
      style={{
        borderRadius: 16,
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 6 },
      }}
    >
    <TouchableOpacity
      activeOpacity={0.85}
      className="w-44 min-h-[210px] overflow-hidden rounded-2xl z-10 relative"
      style={{
        backgroundColor: 'rgba(255,255,255,0.10)',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.20)',
      }}
      onPress={() => router.push({ pathname: `/dynamicid/${todo.id}`, params: { from: fromText } })}
    >

      {/* ==================== CARD CONTENT ==================== */}
      <View className="flex-1 flex-col justify-between p-3 relative z-10">
        {/* Header: Recurring Badge */}
        {todo.isRecurring && (
          <View className="absolute -right-1 -top-1 bg-blue-500/30 border border-blue-400/50 rounded-full p-2">
            <MaterialIcons name="event-repeat" size={14} color="#60a5fa" />
          </View>
        )}

        {/* Title & Status Checkbox */}
        <View className="flex-row items-center gap-2 mb-2">
          <TouchableOpacity
            onPress={() => {
              updateTodo(todo.id, { ...todo, status: todo.status === "done" ? "pending" : "done" })
              todo.status === "done" ? "" : playSuccessSound()
              setShowCongrats(todo.status === "done" ? false : true)
            }}
          >
            {isDone ? (
              <Ionicons name="checkbox" size={18} color="#4ade80" />
            ) : (
              <Ionicons name="square-outline" size={18} color="#93c5fd" />
            )}
          </TouchableOpacity>

          <View className="flex-1">
            <Text
              className={`text-sm font-bold leading-4 ${isDone ? 'text-white/50 line-through' : 'text-white'}`}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {todo.title}
            </Text>
          </View>
        </View>

        {/* Description — sabit 2 satır yüksekliği, tüm kartlar hizalı kalır */}
        <View className="mb-2" style={{ height: 32 }}>
          <Text
            className="text-xs text-white/60 leading-4"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {todo.description ?? ""}
          </Text>
        </View>

        {/* Date & Time */}
        <View
          className="flex-row items-center gap-2 mb-3 rounded-lg px-2 pb-1 pt-0 mt-1"
          style={{ backgroundColor: 'rgba(255,255,255,0.07)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' }}
        >
          <Ionicons name="calendar" size={14} color="#93c5fd" />
          <View className="flex-1">
            <Text className="text-xs text-white/60">{todo.dueDate}</Text>
            <Text className="text-xs font-semibold text-blue-300">
              {todo.dueTime.slice(0, 5)}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-2 mb-2">
          <TouchableOpacity
            className="flex-1 items-center justify-center py-1 rounded-lg"
            style={{ backgroundColor: 'rgba(255,255,255,0.10)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)' }}
            onPress={handleUpdate}
          >
            <MaterialCommunityIcons name="pencil" size={14} color="#93c5fd" />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 items-center justify-center py-1 rounded-lg"
            style={{ backgroundColor: 'rgba(255,255,255,0.10)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)' }}
            onPress={handleDelete}
          >
            <MaterialCommunityIcons name="trash-can" size={14} color="#f87171" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ==================== STATUS GRADIENT BAR ==================== */}
      <LinearGradient
        colors={statusGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="py-2 px-3 items-center justify-center"
      >
        <Text className="text-white text-xs font-semibold">
          {calculateDaysLeft(todo, t)}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
    </View>
  );
};

export default TodoCard;
