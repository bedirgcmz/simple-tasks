import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useTodoListContext } from "../context/todos-context";
import { MaterialCommunityIcons } from "@expo/vector-icons"; 
import Ionicons from "@expo/vector-icons/Ionicons";
import { formatToShortDate } from "../utils/date-utils";
import { router } from "expo-router";
import { showConfirmAlert } from '../utils/alerts';

const ToDoDetailsCard = ({pTodoId, pPageTitle}) => {

  const { todos, deleteTodo, updateTodo } = useTodoListContext();
  const todo = todos.find((todo) => todo.id === pTodoId);

  function calculateDaysLeft(todo) {
    const createdAt = new Date();
    const dueDate = new Date(todo.dueDate);

    // Calculate the difference in milliseconds
    const timeDifference = dueDate.getTime() - createdAt.getTime();

    // Convert milliseconds to days
    const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    // Check if due date has passed
    if (daysLeft < 0) {
      return `The due date was ${Math.abs(daysLeft)} days ago.`;
    } else if (daysLeft === 0) {
      return "The ToDo is due today!";
    } else {
      return `${daysLeft} days left until the due date.`;
    }
  }

  return (
    <View className="">
          <Text className="font-bold text-2xl text-center text-white mb-4">{pPageTitle}</Text>
        <TouchableOpacity
        className={`border-4 rounded-md shadow-lg bg-[#ebd9fc] pb-3 ${
        todo.status === "done" ? "border-[#fe9092]" : "border-[#6c757d]"
        }`}
    >
        <TouchableOpacity 
        onPress={() => updateTodo(todo.id, { ...todo, status: todo.status === "done" ? "pending" : "done" })} 
        className="p-2 absolute bottom-[0] left-[0]">
            {todo.status === "done" ? (
            <Ionicons name="checkbox" size={32} color="#fe9092" />
            ) : (
            <Ionicons name="square-outline" size={32} color="gray" />
            )}
        </TouchableOpacity>
            {/* Days Left */}
        <View className={`mb-3 border border-[#e9ecef] rounded-t-md items-center 
        ${todo.status === "done" ? "bg-[#fe9092]" : "bg-[#6c757d]"}
        `}>
        <Text className="text-lg text-white">{calculateDaysLeft(todo)}</Text>
        </View>

        <View className="px-2">

            {/* Todo Category */}
            <View className="flex-row items-center justify-end gap-2">
            <Text className="text-xl font-bold text-[#fe9092]">{todo.category}</Text>
            <Ionicons name="bookmarks" size={12} color="#fe9092" />
            </View>

            {/* ToDo Title */}
            <View className="mb-2 flex-row items-center justify-start gap-2">
            <Ionicons name="ellipse" size={12} color="#6c757d" />
            <Text className="text-xl font-bold text-[#495057] pr-2">{todo.title}</Text>
            </View>

            {/* ToDo Description */}
            <View className="mb-4 flex-row items-start justify-start gap-2">
            <View className="pt-1"><Ionicons name="document-text-outline" size={18} color="black"/></View>
            <Text className="text-base w-[87%] text-gray-600">{todo.description}</Text>
            </View>

            {/* ToDo Dates */}
            <View className="mb-4 flex-row justify-between px-2">
            <Text className="text-sm text-gray-500">
                Created At: {formatToShortDate(todo.createdAt)}
            </Text>
            <Text className="text-sm text-gray-500">
                Due Date: {formatToShortDate(todo.dueDate)}
            </Text>
            </View>
            
            {/* Edit Button */}
            <View className="flex-row justify-end gap-2">
            <TouchableOpacity
                 onPress={() => router.push(`/edit/${todo.id}`)} // Edit ekranına yönlendirme
                className="flex-row items-center space-x-2 p-2 bg-blue-500 rounded-full bg-[#f4a261]"
            >
                <Text className="text-white text-[14px]">Edit</Text>
                <MaterialCommunityIcons name="pencil" size={16} color="white" />
            </TouchableOpacity>

            {/* Delete Button */}
            <TouchableOpacity
                onPress={() => showConfirmAlert("You want to DELETE this ToDo!","Are you sure?",deleteTodo, todo.id)}
                className="flex-row items-center space-x-2 p-2 bg-red-500 rounded-full bg-[#ff4d6d]"
            >
                <MaterialCommunityIcons name="trash-can" size={16} color="white" />
                <Text className="text-white  text-[14px]">Delete</Text>
            </TouchableOpacity>
            </View>

        </View>
    </TouchableOpacity>
    </View>
  )
}

export default ToDoDetailsCard