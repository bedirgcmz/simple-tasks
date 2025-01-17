import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useTodoListContext } from "../../../context/todos-context";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Expo'dan vektör ikonları
import Ionicons from "@expo/vector-icons/Ionicons";
import { formatToShortDate } from "../../../utils/date-utils";
import { LinearGradient } from "expo-linear-gradient";

const TaskScreen = () => {
  const { id, from } = useLocalSearchParams();
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
    <LinearGradient
    colors={["#01061b", "#431127", "#931e36"]}
      style={{ flex: 1, padding: 20, justifyContent: "center" }}
    >
        <View className="flex-1 p-3 gap-4 pt-20">
          
          {/* Task Title */}
          <Text className="font-bold text-2xl text-center text-white">ToDo Details</Text>
          <TouchableOpacity
            className={`border-4 rounded-md shadow-lg bg-[#ebd9fc] ${
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
                  <Text className="text-base w-[87%] text-gray-600">{todo.description}</Text>
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
          <TouchableOpacity
            className="bg-[#001d3d] h-10 w-[110px] pb-2 pr-4 rounded-full items-center flex-row gap-2 justify-center absolute bottom-[100px] right-[36%]" 
            onPress={() => {
              if (from === 'list') {
                router.push('/list'); // Geri AScreen'e
              } else if (from === 'add') {
                router.push('/add'); // Geri BScreen'e
              } else {
                router.back(); // Varsayılan olarak bir önceki ekrana git
              }
            }}
          >
            <Ionicons name="chevron-back-outline" size={24} color="white" />
            <Text className="text-white text-md font-bold">Back</Text>
          </TouchableOpacity>
        </View>

    </LinearGradient>
  );
};

export default TaskScreen;

