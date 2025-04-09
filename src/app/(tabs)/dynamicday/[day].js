import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTodoListContext } from "../../../context/todos-context";
import { LinearGradient } from "expo-linear-gradient";
import TodoDoneAnimation from '../../../components/TodoDoneAnimation';
import TodoCard from '../../../components/TodoCard';
import QuickAddTodoModal from "../../../components/QuickAddTodoModal";
import LottieView from "lottie-react-native";

const DaysTodos = () => {
  const { day } = useLocalSearchParams();
  const [thisDaysTodos, setThisDaysTodos] = useState([])
  const { todos, t } = useTodoListContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [rotated, setRotated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      style={{ flex: 1, padding: 7, justifyContent: "start" }}
    >

    <ScrollView className="mt-12 z-10 max-h-[75%] px-2 pr-3"
    contentContainerStyle={{flexDirection: "row", flexWrap: "wrap", alignItems:"start", justifyContent: "space-between", paddingBottom:20}}
    >
      {thisDaysTodos.length !== 0 && 
      <View className="text-center pt-4 pb-2 flex-col items-center justify-centerv w-full">
        <Text className="font-bold text-yellow-600 text-lg">{day}</Text>
        <Text className="text-white text-lg text center">{t("todos_of_the_day")}</Text>
      </View>}
        <TodoDoneAnimation />
      
      {thisDaysTodos.map((todo, index) => (
        <View key={index} className="mb-4 w-[47%] ml-[4px] mr-[-8px] mb-3">
          <TodoCard todo={todo} bgColor={"bg-[#bb4d0015]"} fromText={day} setIsLoading={setIsLoading}/>
        </View>
      ))}
      {
        thisDaysTodos.length === 0 && (
          <View className="flex-1 items-center justify-center pt-8">
            <Text className="text-2xl text-white text-center mb-3">{t("No_ToDos_found")}</Text>
            <Text className="text-2xl text-yellow-600">{day}</Text>
          </View>
        )
      }
    </ScrollView>
      <TouchableOpacity
            className="bg-[#001d3d] h-10 w-[110px] pb-2 pr-4 rounded-full items-center flex-row gap-2 justify-center absolute bottom-[110px] right-[36%] z-30" 
            onPress={() => router.back()}
            
          >
            <Ionicons name="chevron-back-outline" size={24} color="white" />
            <Text className="text-white text-md font-bold">{t("Back_Button")}</Text>

      </TouchableOpacity>
      <TouchableOpacity
        className={`bg-[#001d3d] w-14 h-14 rounded-full items-center justify-center absolute bottom-[80px] right-5 z-50 transform transition-transform duration-300 ease-in-out${
          rotated ? "rotate-45" : "rotate-0"
        }`}
        onPress={() => {
          setRotated(true);
          setModalVisible(true);
        }}
      >
        {/* <Text className="text-4xl text-white">+</Text> */}
        <LottieView
          source={require("../../../../assets/data/plusIcon.json")}
          autoPlay
          loop
          speed={.6}
          style={{ width: 60, height: 60 }}
        />
      </TouchableOpacity>

      <QuickAddTodoModal
        visible={modalVisible}
        selectedDate={day}
        onClose={() => {
          setModalVisible(false);
          setRotated(false);
        }}
      />
      {
        isLoading &&
        <LottieView
            source={require("../../../../assets/data/loadingAddTodo.json")}
            className="absolute left-[35%] top-[45%] z-[3333]"
            autoPlay
            loop
            speed={1.2}
            style={{ width: 140, height: 140 }}
          />
      }
    </LinearGradient>

  )
}

export default DaysTodos