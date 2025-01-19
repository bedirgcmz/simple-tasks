import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {  FontAwesome5 } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { truncateText } from "../utils/date-utils";
import { router } from 'expo-router'
import { useTodoListContext } from '../context/todos-context';
import { showConfirmAlert } from '../utils/alerts';


const TodoCard = ({ todo, bgColor }) => {
  const {  deleteTodo, updateTodo } = useTodoListContext();

  return (
    <TouchableOpacity
      className={`p-4 mr-4 w-44 min-h-[200px] flex-col justify-between
      rounded-lg shadow-lg border border-gray-500 ${bgColor} `}
      onPress={() => router.push({ pathname: `/dynamicid/${todo.id}`, params: { from: 'list' } })}
    >
         <TouchableOpacity className="absolute bottom-[12px] left-[12px]"
        onPress={() => updateTodo(todo.id, { ...todo, status: todo.status === "done" ? "pending" : "done" })} 
         
         >
            {todo.status === "done" ? (
              <Ionicons name="checkbox" size={20} color="#fe9092" />
            ) : (
              <Ionicons name="square-outline" size={20} color="gray" />
            )}
          </TouchableOpacity>
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-bold text-white">{truncateText(todo.title, 20)}</Text>
      </View>
      <Text className="text-white mb-2 flex-1">{truncateText(todo.description, 60)}</Text>
      <Text className="text-[12px] mb-1 text-white">
        Created At: {todo.createdAt}
      </Text>
      <View className="flex-row mt-2 items-center justify-end">
        <TouchableOpacity className="mr-4"
          onPress={() => router.push(`/edit/${todo.id}`)} // Edit ekranına yönlendirme
        >
          <FontAwesome5 name="edit" size={16} color="#f4a261" />
        </TouchableOpacity>
        <TouchableOpacity 
         onPress={() => showConfirmAlert("You want to DELETE this ToDo!","Are you sure?",deleteTodo, todo.id)}
        
        >
          <FontAwesome5 name="trash" size={16} color="#ff4d6d" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default TodoCard;
