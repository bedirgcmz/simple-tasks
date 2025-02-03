import { View, Text, Image, TouchableOpacity, Button } from 'react-native'
import React, {useState} from 'react'
import { router } from 'expo-router'
import LanguageModal from "./LanguageModal";
import { useTodoListContext } from "../context/todos-context";
import Ionicons from '@expo/vector-icons/Ionicons';

const Header = () => {
  const { t, username } = useTodoListContext();
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View className="flex-row items-center justify-between w-full px-4 py-2 ">
    <View className="flex-row items-center justify-start space-x-2 flex-1">
      {/* <Button title={t("change_language")} onPress={() => setModalVisible(true)} /> */}
      <TouchableOpacity onPress={() => setModalVisible(true)} className=" p-1 rounded-full bordr border-white">
      {/* <Ionicons name="language" size={20} color="white" /> */}
      <Ionicons name="settings-sharp" size={22} color="white" />
      </TouchableOpacity>

    <LanguageModal visible={modalVisible} onClose={() => setModalVisible(false)} />
      <View className="flex-1items-center justify-start">
        <Text className="text-white">{t("welcome")}!</Text>
        <Text className="text-[12px] text-white font-bold mt-[0px]">{username}</Text>
        {/* <Text className="text-[12px] text-white font-bold mt-[0px]">{t("Your_history")}</Text> */}
      </View>
    </View>
      <View>
        <TouchableOpacity
          className="text-gray-500 border border-gray-500 rounded-md px-2 py-1"
          onPress={() => router.push("/add")}
        >
          <Text className="text-[12px] text-white ">{t("Add_New_ToDo")}</Text>
        </TouchableOpacity>
      </View>
  </View>
  )
}

export default Header