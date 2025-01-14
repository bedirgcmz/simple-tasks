import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTodoListContext } from "../../../context/todos-context";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Expo'dan vektör ikonları
import Ionicons from "@expo/vector-icons/Ionicons";
import { formatToShortDate } from "../../../utils/date-utils";

const TaskScreen = () => {
  const { id } = useLocalSearchParams();
  const { todos } = useTodoListContext();
  const todo = todos.find((todo) => todo.id === id);

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
      return "The task is due today!";
    } else {
      return `${daysLeft} days left until the due date.`;
    }
  }

  return (
    <View className="flex-1 p-5 bg-[#fff]">
      
      {/* Task Title */}
      <TouchableOpacity
        className={`border-2 rounded-md shadow-lg bg-white ${
          todo.status === "done" ? "border-[#fe9092]" : "border-[#6c757d]"
        }`}
      >
         <TouchableOpacity className="p-2 absolute bottom-[0] left-[0] ">
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

        <View className="p-2">
            {/* Task Title */}
            <View className="mb-2 flex-row items-center justify-start gap-2">
              <Ionicons name="ellipse" size={12} color="#6c757d" />
              <Text className="text-xl font-bold text-[#495057]">{todo.title}</Text>
            </View>

            {/* Task Description */}
            <View className="mb-4 flex-row items-center justify-start gap-2">
              <Ionicons name="document-text-outline" size={18} color="black" />
              <Text className="text-base text-gray-600">{todo.description}</Text>
            </View>

            {/* Task Dates */}
            <View className="mb-4 flex-row justify-between px-2">
              <Text className="text-sm text-gray-500">
                Created At: {formatToShortDate(todo.createdAt)}
              </Text>
              <Text className="text-sm text-gray-500">
                Due Date: {formatToShortDate(todo.dueDate)}
              </Text>
            </View>
            
            <View className="flex-row justify-end gap-2">
              {/* Edit Button */}
              <TouchableOpacity
                onPress={() => console.log("Edit Task Function Here")}
                className="flex-row items-center space-x-2 p-2 bg-blue-500 rounded-full bg-[#f4a261]"
              >
                <Text className="text-white text-[14px]">Edit</Text>
                <MaterialCommunityIcons name="pencil" size={16} color="white" />
              </TouchableOpacity>

              {/* Delete Button */}
              <TouchableOpacity
                onPress={() => console.log("Delete Task Function Here")}
                className="flex-row items-center space-x-2 p-2 bg-red-500 rounded-full bg-[#ff4d6d]"
              >
                <MaterialCommunityIcons name="trash-can" size={16} color="white" />
                <Text className="text-white  text-[14px]">Delete</Text>
              </TouchableOpacity>
            </View>

        </View>
      </TouchableOpacity>
      
    </View>
  );
};

export default TaskScreen;
