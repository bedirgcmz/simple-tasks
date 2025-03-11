

import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StatusBar, TextInput, Linking, Image } from "react-native";
import { useTodoListContext } from "../context/todos-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserIconImageModal from "./UserIconImageModal";
import UserCategoriesModal from "./UserCategoriesModal";


const SettingsModal = ({ visible, onClose }) => {
  const { setLanguage, t, username, setUsername, updateUsername, language, translateTodosCategories, STORAGE_USERNAME_LANGUAGE, userIconImage, setUserIconImage } = useTodoListContext();
  const [isEnableUsername, setIsEnableUsername] = useState(false)
  const [isUserIconImageModalOpen, setIsUserIconImageModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
    icon24: require("../../assets/images/user-icons/default.png"),
  };

  const changeLanguage = async (lang) => {
    try {
      await AsyncStorage.setItem(STORAGE_USERNAME_LANGUAGE, lang);
      setLanguage(lang);
      onClose();
      translateTodosCategories(lang);
    } catch (error) {
      console.error("❌ Error saving language:", error);
    }
  };

  const changeUserName = () => {
    updateUsername(username);
    setIsEnableUsername(false)
  }


  const BuyMeACoffee = () => {
    Linking.openURL("https://buymeacoffee.com/bedirgcmzr");
  };
  return (
    <Modal animationType="slide" transparent visible={visible}  statusBarTranslucent={true}>
      <View className="flex-1 bg-black/50 justify-center items-start">
        <View className="w-3/5 h-full bg-white items-center">
      <LinearGradient
    colors={["#004e64", "#002855", "#3a0ca3"]}
      style={{ flex: 1, padding: 18, paddingTop: 50, justifyContent: "start", width: "100%", alignItems: "center" }}
          >
            <View className="flex-row justify-between items-center w-full mb-6 border-b-2 border-white pb-2">
              <Text className="text-lg font-bold text-white">{t("Settings")}</Text>
              <Ionicons name="settings" size={18} color="white" />
            </View>
            <View className=" justify-between items-start w-full mb-8">
              {/* <FontAwesome name="user-circle-o" size={24} color="black"/> */}
              <TouchableOpacity onPress={() => setIsUserIconImageModalOpen(true)}  className=" border border-[#ff5400] w-16 h-16 flex items-center justify-center relative rounded-full p-1">
                <Image source={userIcons[userIconImage]} className="w-8 h-full rounded-full" />
                <Text className="absolute bottom-[-3px] right-[-3px] border border-white rounded-full p-[2px]">
                  {/* <Ionicons name="settings-sharp" size={16} color="white"/> */}
                  <MaterialCommunityIcons name="pencil" size={14} color="white" />
                </Text>
              </TouchableOpacity>
              <UserIconImageModal setIsUserIconImageModalOpen={setIsUserIconImageModalOpen}  isUserIconImageModalOpen={isUserIconImageModalOpen}/>
              <View className="w-full flex-row justify-between items-center">
                <TextInput placeholder={t("Type_Your_Name")}
                placeholderTextColor="#6c757d"
                className={`text-white w-4/5 pl-0 mt-2 border-gray-600 ${isEnableUsername ? "border border-blue-600 px-2": ""} py-1 rounded-md`}
                    value={username}
                    onChangeText={setUsername}
                    editable={isEnableUsername}
                  maxLength={17}

                    />
                  {
                    isEnableUsername ? (
                      <TouchableOpacity onPress={changeUserName} className="p-2 pt-3">
                        <Ionicons name="checkmark" size={24} color="white" />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={() => setIsEnableUsername(true)} className="p-2 pt-3">
                        <MaterialCommunityIcons name="pencil" size={22} color="white" />
                      </TouchableOpacity>
                    )
                  }
                  {/* <FontAwesome name="edit" size={20} color="white" /> */}
              </View>
            </View>

            <Text className="text-start w-full font-bold text-white mb-2">{t("Language")}</Text>
            <View className="flex-row justify-between w-full">
              {["en", "tr", "sv", "de"].map((lang) => (
                <TouchableOpacity 
                  key={lang} 
                  onPress={() => changeLanguage(lang)}
                  className="bg-[#00417f69] border-gray-400 px-2 py-1 rounded items-center my-1 relative"
                >
                  <Text className="text-white text-base">{lang.toUpperCase()}</Text>
                  {language === lang && <View className="h-[6px] w-[6px] bg-[#f07167]  absolute top-0 right-0 rounded-full">
                  </View>}
                </TouchableOpacity>
              ))}
            </View>
            <View className="w-full">
                  {/* Kullanıcı Kategorileri Butonu */}
                <TouchableOpacity
                  onPress={() => setIsModalVisible(true)}
                  className="mt-8 w-full rounded-lg px-2 py-1  mb-4 border border-gray-400 flex"
                >
                  <Text className="text-white text-center">
                    {t("Personal_Categories")}
                  </Text>
                </TouchableOpacity>

                {/* Kategori Yönetim Modali */}
                <UserCategoriesModal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} t={t} />
            </View>
            <View className="mt-auto mb-8 w-full">
              <TouchableOpacity
                  onPress={BuyMeACoffee}
                  className="mt-4 w-full rounded-lg p-1 bg-[#9c6644] mb-4 border border-gray-400 relative"
                >
                  <Text  className="text-[13px] text-center text-[#e6ccb2]">
                    ☕  {t("Buy_Me")}
                  </Text>
                </TouchableOpacity>
            <TouchableOpacity onPress={onClose} className=" px-2 py-1 w-full border border-gray-500 rounded-lg flex-row items-center justify-center">
              <Text className="text-md font-bold text-white text-center pr-2">{t("Exit_Setting")}</Text>
              <Ionicons name="close" size={20} color="white" />
            </TouchableOpacity>

            </View>
        </LinearGradient>
        </View>
      </View>
      <StatusBar 
      style="light"
      backgroundColor="transparent"
      translucent={true} />
    </Modal>
  );
};

export default SettingsModal;
