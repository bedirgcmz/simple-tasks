

import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StatusBar, TextInput, Linking } from "react-native";
import { useTodoListContext } from "../context/todos-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SettingsModal = ({ visible, onClose }) => {
  const { setLanguage, setTodos, t, username, setUsername, updateUsername, language, todos, STORAGE_KEY, translateTodosCategories } = useTodoListContext();
  const [isEnableUsername, setIsEnableUsername] = useState(false)


  const changeLanguage = (lang) => {
    // alert(t("language_changed"));
    setLanguage(lang);
    onClose(); // Modalı kapat
    translateTodosCategories(lang);
  };

  const changeUserName = () => {
    updateUsername(username);
    setIsEnableUsername(false)
  }

  const BuyMeACoffee = () => {
    Linking.openURL("https://buymeacoffee.com/bedirgcmzr");
  };
  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View className="flex-1 bg-black/50 justify-center items-start">
        <View className="w-3/5 h-full bg-white items-center">
      <LinearGradient
    colors={["#004e64", "#002855", "#3a0ca3"]}
      style={{ flex: 1, padding: 18, justifyContent: "start", width: "100%", alignItems: "center" }}
          >
            <View className="flex-row justify-between items-center w-full mb-6 border-b-2 border-white pb-2">
              <Text className="text-lg font-bold text-white">{t("Settings")}</Text>
              <Ionicons name="settings" size={18} color="white" />
            </View>
            <View className=" justify-between items-start w-full mb-8">
              {/* <Text className="text-sm font-bold text-white mb-2">{t("Your_Name")}:</Text> */}
              <FontAwesome name="user-circle-o" size={24} color="white"/>
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
                        {/* <MaterialCommunityIcons name="close" size={22} color="white" /> */}
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
                  className="bg-[#023047] px-2 py-1 rounded items-center my-1 relative"
                >
                  <Text className="text-white text-base">{lang.toUpperCase()}</Text>
                  {language === lang && <View className="h-[6px] w-[6px] bg-[#f07167] absolute top-0 right-0 rounded-full">
                  </View>}
                </TouchableOpacity>
              ))}
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
