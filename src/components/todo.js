import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router'
import { useTodoListContext } from '../context/todos-context';
import { showConfirmAlert } from '../utils/alerts';
import { playCorrectSound } from '../utils/play-success-sound';
import TodoDoneAnimation from './TodoDoneAnimation';


const Todo = ({todo, index, fromText}) => {
  const {  deleteTodo, updateTodo, setShowCongrats, t } = useTodoListContext();
    function calculateDaysLeft(todo) {
        const createdAt = new Date(todo.createdAt);
        const dueDate = new Date(todo.dueDate);
    
        // Calculate the difference in milliseconds
        const timeDifference = dueDate.getTime() - createdAt.getTime();
    
        // Convert milliseconds to days
        const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    
        // Check if due date has passed
        if (daysLeft < 0) {
            return `${Math.abs(daysLeft)} ${t("calculateDays_text_5")}`;
        } else if (daysLeft === 0) {
            return t("calculateDays_text_6");
        } else {
            return `${daysLeft} ${t("calculateDays_text_7")}`;
        }
    }
  return (
    <TouchableOpacity onPress={() => router.push({ pathname: `/dynamicid/${todo.id}`, params: { from: fromText } })} className={`flex-1 flex-row items-center justify-between my-2 border-b border-[#6c757d] rounded-lg shadow bg-[#6c757d36] ${index % 2 !== 0 && "bgg-[#343a40]"}`}>
        <View className="flex-1 flex-row items-center gap-1 justify-start">
            <TouchableOpacity className="p-2"
        onPress={() => {
            updateTodo(todo.id, { ...todo, status: todo.status === "done" ? "pending" : "done" })
            todo.status === "done" ?  "" : playCorrectSound()
            setShowCongrats(todo.status === "done" ? false : true)
        }
        } 
            
            >
                {todo.status === "done" ? 
                <Ionicons name="checkbox" size={20} color="#fe9092" /> :
                <Ionicons name="square-outline" size={20} color="gray" /> }
            </TouchableOpacity>
        <Text className="flex-1 py-2 text-white pr-2" style={todo.status === "done" ?  { textDecorationLine: 'line-through' }: null}>{todo.title}</Text>
        </View>
        {
            todo.status !== "done" ?
            <Text className="text-red-400 text-[12px] tracking-tighter">{calculateDaysLeft(todo)}</Text> :
            <Text className="text-green-600 text-[12px] tracking-tighter">{t("Great")}</Text>
        }
        <TouchableOpacity className="p-2 pl-1"
                onPress={() => showConfirmAlert("You want to DELETE this ToDo!","Are you sure?",deleteTodo, todo.id, t)}
        >
            <Ionicons name="trash-outline" size={18} color="gray" />
        </TouchableOpacity>
    </TouchableOpacity>
  )
}

export default Todo