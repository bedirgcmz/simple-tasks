import { View, Text, Modal, FlatList, Image, StatusBar } from 'react-native';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useTodoListContext } from '../context/todos-context';
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from '@react-native-async-storage/async-storage';


const UserIconImageModal = ({ isUserIconImageModalOpen, setIsUserIconImageModalOpen }) => {
  const { t, userIconImage, setUserIconImage, STORAGE_USERNAME_IMAGE  } = useTodoListContext();

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

    // 📌 Kullanılabilir icon'ların key'lerini diziye çeviriyoruz
    const iconKeys = Object.keys(userIcons);

    // 📌 Kullanıcı bir ikon seçtiğinde `setUserIconImage` ile güncelle
    const changeUserIconImage = (iconKey) => {
        setUserIconImage(iconKey);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => changeUserIconImage(item)} className="py-2 px-3">
            <Image source={userIcons[item]} className="w-10 h-12 rounded-full border-2 border-gray-300" />
        </TouchableOpacity>
    );

    const closeModal = () => {
        setUserImageToAsync(userIconImage)
        setIsUserIconImageModalOpen(false);
    };

    const setUserImageToAsync = async (userIconImage) => {
        try {
            await AsyncStorage.setItem(STORAGE_USERNAME_IMAGE, userIconImage);
        } catch (error) {
          console.error("❌ Error loading language:", error);
        }
      };

    return (
        <Modal animationType="slide" transparent visible={isUserIconImageModalOpen} statusBarTranslucent={true}>
             <LinearGradient
                colors={["#004e64", "#002855", "#3a0ca3"]}
                style={{ flex: 1, padding: 8, justifyContent: "center", width: "100%", alignItems: "center" }}
                    >
                <View className="flex- bg-black/50 justify-center items-center p-4 rounded-xl w-[95%] h-[90%]">
                    {/* 📌 Seçili olan ikonu büyük göster */}
                    <View className="items-center mb-4">
                        <Text className="text-white text-lg font-bold mb-2">{t("Selected_Character")}</Text>
                        <Image source={userIcons[userIconImage]} className="w-24 h-32 border-4 border-blue-500" />
                    </View>
                    
                    {/* 📌 Kullanıcı tüm ikonları görebilmeli */}
                    <FlatList
                        data={iconKeys}
                        keyExtractor={(item) => item}
                        renderItem={renderItem}
                        numColumns={4}
                        contentContainerStyle={{ alignItems: 'center' }}
                    />

                    {/* 📌 Modalı kapatmak için buton */}
                    <TouchableOpacity onPress={closeModal} className="bg-red-500 px-6 py-2 rounded-full mt-4">
                        <Text className="text-white font-bold">{t("Close")}</Text>
                    </TouchableOpacity>
                </View>
                <StatusBar
                    barStyle="light-content" 
                    backgroundColor="transparent" // Status bar arka planı
                    translucent={true} // Status barı saydam yapar
                    />
            </LinearGradient>
        </Modal>
    );
};

export default UserIconImageModal;
