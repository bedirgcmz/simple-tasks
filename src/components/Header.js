import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'

const Header = () => {
  return (
    <View className="flex-row items-center justify-between w-full px-4 py-2 ">
    <View className="flex-row items-center justify-start space-x-3 flex-1">
      <Image
        source={require("../../assets/images/user.png")}
        className="h-8 w-8"
      />
      <View className="flex-1items-center justify-start">
        <Text className="text-white">Hi, Guest!</Text>
        <Text className="text-[12px] text-white font-bold mt-[0px]">Your history</Text>
      </View>
    </View>
      <View>
        <Pressable
          className="text-gray-500 border border-gray-500 rounded-md px-2 py-1"
        >
          <Text className="text-[12px] text-white ">Add New ToDo</Text>
        </Pressable>
      </View>
  </View>
  )
}

export default Header