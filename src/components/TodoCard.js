import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {  FontAwesome5 } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { calculateDaysLeft, truncateText } from "../utils/date-utils";
import { router } from 'expo-router'
import { useTodoListContext } from '../context/todos-context';
import { showConfirmAlert } from '../utils/alerts';
import {playSuccessSound} from "../utils/play-success-sound";
import moment from "moment-timezone";


const TodoCard = ({ todo, bgColor, fromText }) => {
  const {  deleteTodo, updateTodo, setShowCongrats, t } = useTodoListContext();

  return (
    <TouchableOpacity
      className={`pt-3 mr-4 w-40 min-h-[190px] flex-col justify-between z-10 relative
      rounded-lg shadow-xl border border-gray-700 ${bgColor}`}
      onPress={() => router.push({ pathname: `/dynamicid/${todo.id}`, params: { from: fromText } })}
    >
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
            onPress={() => router.push({ pathname: `/edit/${todo.id}`, params: { from: 'list' } })} // Edit ekranına yönlendirme
          >
            <FontAwesome5 name="edit" size={16} color="#e9ecef" />
          </TouchableOpacity>
          <TouchableOpacity 
          onPress={() => showConfirmAlert("You want to DELETE this ToDo!","Are you sure?",deleteTodo, todo.id, t)}
          
          >
            <FontAwesome5 name="trash" size={16} color="#e9ecef" />
          </TouchableOpacity>
        </View>
        <Text className="text-black text-center text-xs bg-[#ced4da] z-[11] w-full rounded-b-lg">{calculateDaysLeft(todo, t)}</Text>
    </TouchableOpacity>
  );
};

export default TodoCard;
