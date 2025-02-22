import { View, Text, Image, TouchableOpacity, Button } from 'react-native'
import React, {useState} from 'react'
import { router } from 'expo-router'
import SettingsModal from "./SettingsModal";
import { useTodoListContext } from "../context/todos-context";
import Ionicons from '@expo/vector-icons/Ionicons';

const Header = () => {
  const { t, username, userIconImage } = useTodoListContext();
  const [modalVisible, setModalVisible] = useState(false);
  const userIcons = {
    icon1: require("../../assets/images/user-icons/e1.png"),
    icon2: require("../../assets/images/user-icons/e2.png"),
    icon3: require("../../assets/images/user-icons/e3.png"),
    icon4: require("../../assets/images/user-icons/e4.png"),
    icon5: require("../../assets/images/user-icons/e5.png"),
    icon6: require("../../assets/images/user-icons/e6.png"),
    icon7: require("../../assets/images/user-icons/e7.png"),
    icon8: require("../../assets/images/user-icons/e8.png"),
    icon9: require("../../assets/images/user-icons/e9.png"),
    icon10: require("../../assets/images/user-icons/e10.png"),
    icon11: require("../../assets/images/user-icons/e11.png"),
    icon12: require("../../assets/images/user-icons/e12.png"),
    icon13: require("../../assets/images/user-icons/k1.png"),
    icon14: require("../../assets/images/user-icons/k2.png"),
    icon15: require("../../assets/images/user-icons/k3.png"),
    icon16: require("../../assets/images/user-icons/k4.png"),
    icon17: require("../../assets/images/user-icons/k5.png"),
    icon18: require("../../assets/images/user-icons/k6.png"),
    icon19: require("../../assets/images/user-icons/k7.png"),
    icon20: require("../../assets/images/user-icons/k8.png"),
    icon21: require("../../assets/images/user-icons/k9.png"),
    icon22: require("../../assets/images/user-icons/k10.png"),
    icon23: require("../../assets/images/user-icons/k11.png"),
    icon23: require("../../assets/images/user-icons/k11.png"),
    icon24: require("../../assets/images/user-icons/default.png"),
  };
  

  return (
    <View className="flex-row items-center justify-between w-full px-4 py-2 ">
    <View className="flex-row items-center justify-start space-x-2 flex-1">
      <TouchableOpacity onPress={() => setModalVisible(true)} className=" p-1 rounded-full bordr border-white">
      {/* <Ionicons name="language" size={20} color="white" /> */}
      <View className=" border border-[#0077b6] w-12 h-12 flex items-center justify-center relative rounded-full p-1">
        <Image source={userIcons[userIconImage]} className="w-8 h-full rounded-full" />

        <Text className="absolute bottom-[-3px] right-[-3px]">
          <Ionicons name="settings-sharp" size={16} color="white"/>
        </Text>
      </View>
      </TouchableOpacity>

    <SettingsModal visible={modalVisible} onClose={() => setModalVisible(false)} />
      <View className="flex-1items-center justify-start">
        <Text className="text-white">{t("welcome")}!</Text>
        <Text className="text-[12px] text-white font-bold mt-[0px]">{username === "" ? t("Guest") : username}</Text>
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