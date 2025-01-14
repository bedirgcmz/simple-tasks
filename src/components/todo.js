import { View, Text } from 'react-native'
import React from 'react'

const Todo = ({todo}) => {
  return (
    <View>
      <Text>{todo.title}</Text>
    </View>
  )
}

export default Todo