import { View, Text, TouchableOpacity, Alert } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useTodoListContext } from "../context/todos-context";
import { playCorrectSound } from "../utils/play-success-sound";
import { calculateDaysLeft } from "../utils/date-utils";

const Todo = ({ todo, fromText, setIsLoading }) => {
  const { deleteTodo, updateTodo, setShowCongrats, t, deleteAllInGroup } = useTodoListContext();

  const isDone = todo.status === "done";

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

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({ pathname: `/dynamicid/${todo.id}`, params: { from: fromText } })
      }
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 4,
        borderRadius: 14,
        backgroundColor: isDone ? 'rgba(74,222,128,0.07)' : 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        borderColor: isDone ? 'rgba(74,222,128,0.22)' : 'rgba(255,255,255,0.13)',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
      }}
    >
      {/* Checkbox + Title */}
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          style={{ padding: 10 }}
          onPress={() => {
            updateTodo(todo.id, { ...todo, status: isDone ? "pending" : "done" });
            if (!isDone) playCorrectSound();
            setShowCongrats(!isDone);
          }}
        >
          {isDone ? (
            <Ionicons name="checkbox" size={20} color="#4ade80" />
          ) : (
            <Ionicons name="square-outline" size={20} color="rgba(255,255,255,0.40)" />
          )}
        </TouchableOpacity>

        <Text
          style={{
            flex: 1,
            paddingVertical: 10,
            paddingRight: 8,
            fontSize: 15,
            color: isDone ? 'rgba(255,255,255,0.40)' : 'rgba(255,255,255,0.90)',
            textDecorationLine: isDone ? 'line-through' : 'none',
          }}
          numberOfLines={1}
        >
          {todo.title}
        </Text>
      </View>

      {/* Days left / Done label */}
      {isDone ? (
        <Text style={{ color: '#4ade80', fontSize: 12, paddingHorizontal: 6, fontWeight: '600' }}>
          {t("Great")}
        </Text>
      ) : (
        <Text style={{ color: '#f87171', fontSize: 12, paddingHorizontal: 6, fontWeight: '500' }}>
          {calculateDaysLeft(todo, t)}
        </Text>
      )}

      {/* Delete */}
      <TouchableOpacity style={{ padding: 10, paddingLeft: 4 }} onPress={handleDelete}>
        <Ionicons name="trash-outline" size={17} color="rgba(248,113,113,0.55)" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default Todo;
