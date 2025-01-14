import { View, Text } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import myTodos from '../../../../assets/data/todo-list'

const AddTodoScreen = () => {
  console.log(myTodos)
  return (
    <View className="bg-white flex-1">
      <Text>AddTodoScreen</Text>
    </View>
  )
}

export default AddTodoScreen