import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTodoListContext } from "../../../context/todos-context";
import Todo from '../../../components/todo';
import { LinearGradient } from "expo-linear-gradient";


const DaysTodos = () => {
  const { day } = useLocalSearchParams();
  const [thisDaysTodos, setThisDaysTodos] = useState([])
  const { todos } = useTodoListContext();

  const ThisDayTodos = () => {
    const filteredTodos = todos.filter((todo) => todo.dueDate === day);
    setThisDaysTodos(filteredTodos) ;
  }

  useEffect(() => {
    ThisDayTodos();
  }, [day, todos])

  return (
    <LinearGradient
    colors={["#01061b", "#431127", "#931e36"]}
      style={{ flex: 1, padding: 7, justifyContent: "center" }}
    >
    <ScrollView className="mt-12 flex-1">
      {thisDaysTodos.length !== 0 && <Text className="text-white text-lg text-center pt-4 pb-2">ToDos for {day}</Text>}
      
      {thisDaysTodos.map((todo, index) => (
        <Todo key={todo.id} todo={todo} index={index} fromText={`${day}`}/>
      ))}
      {
        thisDaysTodos.length === 0 && (
          <View className="flex-1 items-center justify-center pt-8">
            <Text className="text-2xl text-white">No ToDos found for this date</Text>
            <Text className="text-2xl text-yellow-600">{day}</Text>
          </View>
        )
      }
    </ScrollView>
      <TouchableOpacity
            className="bg-[#001d3d] h-10 w-[110px] pb-2 pr-4 rounded-full items-center flex-row gap-2 justify-center absolute bottom-[100px] right-[36%]" 
            onPress={() => {
              router.push('/');
            }}
          >
            <Ionicons name="chevron-back-outline" size={24} color="white" />
            <Text className="text-white text-md font-bold">Back</Text>
      </TouchableOpacity>
    </LinearGradient>

  )
}

export default DaysTodos