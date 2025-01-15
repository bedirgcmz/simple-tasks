import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";


const TodoCard = ({ todo, onPress, bgColor }) => {
  const truncateDescription = (description) =>
    description.length > 60 ? `${description.slice(0, 60)}...` : description;

  return (
    <TouchableOpacity
      className={`bg-gray-100 rounded-lg p-4 mr-4 w-44 min-h-[200px] flex-col justify-between border border-gray-400 shadow 
      bg-white/60 backdrop-blur-md border border-gray-300 rounded-lg shadow-lg `}
      onPress={onPress}
    >
         <TouchableOpacity className="absolute bottom-[12px] left-[12px] ">
            {todo.status === "done" ? (
              <Ionicons name="checkbox" size={20} color="#fe9092" />
            ) : (
              <Ionicons name="square-outline" size={20} color="gray" />
            )}
          </TouchableOpacity>
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-bold text-gray-500">{todo.title}</Text>
      </View>
      <Text className="text-gray-400 mb-2 flex-1">{truncateDescription(todo.description)}</Text>
      <Text className="text-[12px] mb-1 text-gray-500">
        Created At: {new Date(todo.createdAt).toLocaleDateString()}
      </Text>
      <View className="flex-row mt-2 items-center justify-end">
        <TouchableOpacity className="mr-4">
          <FontAwesome5 name="edit" size={16} color="#f4a261" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome5 name="trash" size={16} color="#ff4d6d" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default TodoCard;
