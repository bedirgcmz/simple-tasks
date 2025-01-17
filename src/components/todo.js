import { View, Text, Pressable, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router'


const Todo = ({todo, index}) => {
    function calculateDaysLeft(todo) {
        const createdAt = new Date(todo.createdAt);
        const dueDate = new Date(todo.dueDate);
    
        // Calculate the difference in milliseconds
        const timeDifference = dueDate.getTime() - createdAt.getTime();
    
        // Convert milliseconds to days
        const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    
        // Check if due date has passed
        if (daysLeft < 0) {
            return `${Math.abs(daysLeft)} days ago.`;
        } else if (daysLeft === 0) {
            return "Today!";
        } else {
            return `${daysLeft} days left`;
        }
    }
    
    
  return (
    <TouchableOpacity onPress={() => router.push({ pathname: `/add/${todo.id}`, params: { from: 'add' } })} className={`flex-1 flex-row items-center justify-between my-2 border-b border-[#6c757d] rounded-lg shadow bg-[#6c757d36] ${index % 2 !== 0 && "bgg-[#343a40]"}`}>
        <View className="flex-1 flex-row items-center gap-1 justify-start">
            <TouchableOpacity className="p-2 ">
                {todo.status === "done" ? 
                <Ionicons name="checkbox" size={20} color="#fe9092" /> :
                <Ionicons name="square-outline" size={20} color="gray" /> }
            </TouchableOpacity>
        <Text className="text-gray-600 flex-1 py-2 text-white" style={todo.status === "done" ?  { textDecorationLine: 'line-through' }: null}>{todo.title}</Text>
        </View>
        {
            todo.status !== "done" ?
            <Text className="text-red-400">{calculateDaysLeft(todo)}</Text> :
            <Text className="text-green-600">Great!</Text>
        }
        <TouchableOpacity className="p-2">
            <Ionicons name="trash-outline" size={18} color="gray" />
        </TouchableOpacity>
    </TouchableOpacity>
  )
}

export default Todo