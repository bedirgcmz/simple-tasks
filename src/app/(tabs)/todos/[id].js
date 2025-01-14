import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTodoListContext } from '../../../context/todos-context';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Expo'dan vektör ikonları
import Ionicons from '@expo/vector-icons/Ionicons';

const TaskScreen = () => {
  const { id } = useLocalSearchParams();
  const { todos } = useTodoListContext();
  const todo = todos.find((todo) => todo.id === id);

  function calculateDaysLeft(todo) {
    const createdAt = new Date(todo.createdAt);
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
      {/* <Text className="text-2xl font-semibold text-center text-gray-800 mb-4">Todo Details</Text> */}
      {/* Task Title */}
      <TouchableOpacity className="border border-[#e9ecef] p-2 rounded-md shadow-lg bg-white">
      <View className="mb-4 flex-row items-center justify-start gap-2">
      <Ionicons name="ellipse" size={12} color="#6c757d" />
        <Text className="text-xl font-bold text-[#495057]">{todo.title}</Text>
      </View>

      {/* Task Description */}
      <View className="mb-4 flex-row items-center justify-start gap-2">
      <Ionicons name="document-text-outline" size={18} color="black" />
        <Text className="text-base text-gray-600">{todo.description}</Text>
      </View>

      {/* Task Dates */}
      <View className="mb-4">
        <Text className="text-sm text-gray-500">Created At: {new Date(todo.createdAt).toLocaleDateString()}</Text>
        <Text className="text-sm text-gray-500">Due Date: {new Date(todo.dueDate).toLocaleDateString()}</Text>
      </View>

      {/* Days Left */}
      <View className="mb-6 border border-[#e9ecef] rounded-[30px] bg-[#6c757d] items-center">
        <Text className="text-lg text-white">{calculateDaysLeft(todo)}</Text>
      </View>

      {/* Task Status */}
      <View className="mb-6 flex-row items-center justify-between">
        <Text className="text-sm text-gray-700">Status: {todo.status.charAt(0).toUpperCase() + todo.status.slice(1).toLowerCase()
}</Text>
        <TouchableOpacity className="p-2 ">
                {todo.status === "done" ? 
                <Ionicons name="checkbox" size={20} color="#fe9092" /> :
                <Ionicons name="square-outline" size={20} color="gray" /> }
                {/* <Ionicons name="checkbox" size={24} color="black" /> */}
            </TouchableOpacity>
      </View>

      {/* Action Buttons (Edit, Delete) */}
      <View className="flex-row justify-between">
        {/* Edit Button */}
        <TouchableOpacity
          onPress={() => console.log("Edit Task Function Here")}
          className="flex-row items-center space-x-2 p-2 bg-blue-500 rounded-full"
        >
          <Text className="text-white">Edit</Text>
          <MaterialCommunityIcons name="pencil" size={20} color="white" />
        </TouchableOpacity>

        {/* Delete Button */}
        <TouchableOpacity
          onPress={() => console.log("Delete Task Function Here")}
          className="flex-row items-center space-x-2 p-2 bg-red-500 rounded-full"
        >
          <MaterialCommunityIcons name="trash-can" size={20} color="white" />
          <Text className="text-white">Delete</Text>
        </TouchableOpacity>
      </View>
      </TouchableOpacity>
    </View>
  );
};

export default TaskScreen;
