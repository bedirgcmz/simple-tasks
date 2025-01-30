import { View, Text } from 'react-native'
import React from 'react'
import Chart from './Chart'
import { useTodoListContext } from "../context/todos-context";


const ChartSection = () => {
  const { todos, t, language } = useTodoListContext();
  return (
    <View className="flex-row justify-between items-center px-4 mt-4 w-full">
        <View className="items-start">
            <Text className="text-white"> {language === "tr" ? "" : <Text>{t("My")}</Text>}<Text className="font-bold text-white">{t("All_Todos")}</Text></Text>
            <Text className="font-bold text-[36px] text-white">{todos.length}</Text>
        </View>
      <Chart />
    </View>
  )
}

export default ChartSection