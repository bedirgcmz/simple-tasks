import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { calculateDaysLeft } from "../utils/date-utils";
import { router } from 'expo-router'
import { useTodoListContext } from '../context/todos-context';
import { playSuccessSound } from "../utils/play-success-sound";
import { MaterialIcons } from '@expo/vector-icons';
import { getStatusColor } from "../theme/themeColors";

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
              await deleteTodo(todo.id);
              setIsLoading(false)
            },
            style: "default",
          },
          {
            text: t("Delete_All"),
            onPress: async () => {
              setIsLoading(true)
              await deleteAllInGroup(todo.repeatGroupId);
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
      router.push({ pathname: `/edit-recurring/${todo.id}`, params: { from: "list" } })
    } else {
      router.push({ pathname: `/edit/${todo.id}`, params: { from: "list" } })
    }
  }

  const isDone = todo.status === "done";
  const statusColor = getStatusColor(todo.status);
  const daysLeft = calculateDaysLeft(todo, t);

  return (
    <TouchableOpacity
      activeOpacity={0.80}
      onPress={() => router.push({ pathname: `/dynamicid/${todo.id}`, params: { from: fromText } })}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.10)',
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 7,
        gap: 10,
      }}
    >
      {/* ── Checkbox ── */}
      <TouchableOpacity
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        onPress={() => {
          updateTodo(todo.id, { ...todo, status: todo.status === "done" ? "pending" : "done" });
          todo.status === "done" ? "" : playSuccessSound();
          setShowCongrats(todo.status === "done" ? false : true);
        }}
      >
        {isDone ? (
          <Ionicons name="checkmark-circle" size={22} color="#4ade80" />
        ) : (
          <Ionicons name="ellipse-outline" size={22} color="rgba(255,255,255,0.30)" />
        )}
      </TouchableOpacity>

      {/* ── Main content ── */}
      <View style={{ flex: 1, gap: 3 }}>
        {/* Title row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              color: isDone ? 'rgba(255,255,255,0.35)' : 'white',
              fontSize: 14,
              fontWeight: '600',
              textDecorationLine: isDone ? 'line-through' : 'none',
            }}
          >
            {todo.title}
          </Text>

          {todo.isRecurring && (
            <MaterialIcons name="event-repeat" size={13} color="#60a5fa" />
          )}
        </View>

        {/* Description — optional, 1 line */}
        {!!todo.description && (
          <Text
            numberOfLines={1}
            style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12 }}
          >
            {todo.description}
          </Text>
        )}

        {/* Date + days-left chip */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <Ionicons name="calendar-outline" size={11} color="rgba(255,255,255,0.35)" />
          <Text style={{ color: 'rgba(255,255,255,0.40)', fontSize: 11 }}>
            {todo.dueDate}
            {todo.dueTime ? `  ·  ${todo.dueTime.slice(0, 5)}` : ''}
          </Text>

          {/* Status pill */}
          <View style={{
            marginLeft: 'auto',
            backgroundColor: `${statusColor}22`,
            borderWidth: 1,
            borderColor: `${statusColor}55`,
            borderRadius: 20,
            paddingHorizontal: 8,
            paddingVertical: 2,
          }}>
            <Text style={{ color: statusColor, fontSize: 10, fontWeight: '700' }}>
              {daysLeft}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Action icons ── */}
      <View style={{ gap: 8 }}>
        <TouchableOpacity
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          onPress={handleUpdate}
        >
          <MaterialCommunityIcons name="pencil-outline" size={16} color="rgba(147,197,253,0.70)" />
        </TouchableOpacity>
        <TouchableOpacity
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          onPress={handleDelete}
        >
          <MaterialCommunityIcons name="trash-can-outline" size={16} color="rgba(248,113,113,0.70)" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default TodoCard;
