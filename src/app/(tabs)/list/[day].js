import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useLocalSearchParams, router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

const DaysTodos = () => {
  const { day, from } = useLocalSearchParams();

  return (
    <View className="mt-44">
      <Text>DaysTodos {day} {from}</Text>
      <TouchableOpacity
            className="bg-[#001d3d] h-10 w-[110px] pb-2 pr-4 rounded-full items-center flex-row gap-2 justify-center absolute bottom-[100px] right-[36%]" 
            onPress={() => {
              if (from === 'home') {
                router.push('/'); // Geri AScreen'e
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
  )
}

export default DaysTodos