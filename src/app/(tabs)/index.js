import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { Link, router } from 'expo-router'

const HomeScreen = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text>HomeScreen</Text>
      <Link href="/tasks/1">Go Task Page 1</Link>
      <Pressable onPress={() => router.push("/tasks/2")}> 
        <Text>Go Task Page 2</Text>
      </Pressable>
    </View>
  )
}

export default HomeScreen