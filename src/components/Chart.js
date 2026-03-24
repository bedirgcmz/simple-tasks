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
          color: "#0d9488",
          focused: true,
        },
        {
          value: remainingTodosCount,
          color: "#4f46e5",
        },
      ];

  return (
    <View>
      <PieChart
          data={pieData}
          donut
          showGradient
          semiCircle
          sectionAutoFocus
          radius={70}
          innerRadius={60}
          innerCircleColor={'#0c0820'}
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