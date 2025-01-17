import { View, Text } from 'react-native'
import React from 'react'
import { PieChart } from "react-native-gifted-charts";
import { useTodoListContext } from "../context/todos-context";


const Chart = () => {
  const { todos } = useTodoListContext();

  const completedTodos = todos.filter((todo) => todo.status === "done");
  const completedTodosCount = completedTodos.length;
  const remainingTodosCount = todos.length - completedTodosCount;
  const completedPercentage = parseFloat(((completedTodosCount / todos.length) * 100).toFixed(1));


    const pieData = [
        {
        value: completedTodosCount,
        color: "#52b788",
        focused: true,
        text: "47%",
        },
        {
        value: remainingTodosCount,
        color: "#ff9f1c",
        text: "40%",
        },
      ]
      
  return (
    <View>
      <PieChart
          data={pieData}
          donut
          showGradient
          semiCircle
        //   focusOnPress
          sectionAutoFocus
          radius={70}
          innerRadius={60}
          innerCircleColor={'#002855'}
          centerLabelComponent={() => {
            return (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text
                  style={{fontSize: 20, color: 'white', fontWeight: 'bold'}}>
                  {completedPercentage}%
                </Text>
              </View>
            );
          }}
        />
    </View>
  )
}

export default Chart