import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import {  FontAwesome5 } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { calculateDaysLeft, truncateText } from "../utils/date-utils";
import { router } from 'expo-router'
import { useTodoListContext } from '../context/todos-context';
import {playSuccessSound} from "../utils/play-success-sound";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


const TodoCard = ({ todo, bgColor, fromText, setIsLoading }) => {
  const {  deleteTodo, updateTodo, setShowCongrats, t, deleteAllInGroup } = useTodoListContext();

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

  return (
    <TouchableOpacity
      className={`pt-3 mr-4 w-40 min-h-[190px] flex-col justify-between z-10 relative
      rounded-lg shadow-xl border border-gray-700 ${bgColor} bgg-[#2f3e46]`}
      onPress={() => router.push({ pathname: `/dynamicid/${todo.id}`, params: { from: fromText } })}
    >
      {
                todo.isRecurring && 
              <View className="absolute right-2 top-1">
                  <MaterialIcons name="event-repeat" size={18} color="white" />
              </View>
              }
         <TouchableOpacity className="absolute bottom-[23px] left-[12px]"
        onPress={() => 
          {
            updateTodo(todo.id, { ...todo, status: todo.status === "done" ? "pending" : "done" })
            todo.status === "done" ?  "" : playSuccessSound()
            setShowCongrats(todo.status === "done" ? false : true)
          }
        }
         >
            {todo.status === "done" ? (
              <Ionicons name="checkbox" size={20} color="#fe9092" />
            ) : (
              <Ionicons name="square-outline" size={20} color="#e9ecef" />
            )}
          </TouchableOpacity>
        <View className="px-3 flex-row justify-between items-center mb-2">
          <Text className="text-[13px] font-bold text-white">{truncateText(todo.title, 24)}</Text>
        </View>
        <Text className="px-3 text-[#f8f9fa] text-[12px] flex-1">{truncateText(todo.description, 60)}</Text>
        <View className="px-3 text-[12px] mb-1 text-white justify-start items-center flex-row">
          <Ionicons name="time" size={18} color="white" />
          <View className=" pl-2 flex-1 flex-row justify-between">
            <Text className="text-[12px] text-white tracking-tighter ">{todo.dueDate}</Text><Text className="font-bold tracking-tighter  text-[12px] text-white">{todo.dueTime.slice(0, 5)}</Text>
          </View>
        </View>
        <View className="px-3 flex-row mt-2 mb-2 items-center justify-end">
          <TouchableOpacity className="mr-4"
            onPress={handleUpdate} // Edit ekranına yönlendirme
          >
            <FontAwesome5 name="edit" size={16} color="#e9ecef" />
          </TouchableOpacity>
          <TouchableOpacity 
          onPress={handleDelete}
          
          >
            <FontAwesome5 name="trash" size={16} color="#e9ecef" />
          </TouchableOpacity>
        </View>
        <Text className="text-black text-center text-xs bg-[#ced4da] z-[11] w-full rounded-b-lg">{calculateDaysLeft(todo, t)}</Text>
    </TouchableOpacity>
  );
};

export default TodoCard;
