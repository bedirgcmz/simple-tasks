import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { Link, router } from 'expo-router'

const HomeScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>HomeScreen</Text>
      <Link href="/tasks/1">Go Task Page 1</Link>
      <Pressable onPress={() => router.push("/tasks/2")}> 
        <Text>Go Task Page 2</Text>
      </Pressable>
    </View>
  )
}

export default HomeScreen