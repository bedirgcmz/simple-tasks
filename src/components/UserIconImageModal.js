import { View, Text, Modal, FlatList, Image, StatusBar } from 'react-native';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useTodoListContext } from '../context/todos-context';
import { USER_ICONS, ICON_LIST } from '../utils/userIconsMap';
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from '@react-native-async-storage/async-storage';


const UserIconImageModal = ({ isUserIconImageModalOpen, setIsUserIconImageModalOpen }) => {
  const { t, userIconImage, setUserIconImage, STORAGE_USERNAME_IMAGE  } = useTodoListContext();

    // 📌 Kullanılabilir icon'ların key'lerini ICON_LIST'ten al
    const iconKeys = ICON_LIST;

    // 📌 Kullanıcı bir ikon seçtiğinde `setUserIconImage` ile güncelle
    const changeUserIconImage = (iconKey) => {
        setUserIconImage(iconKey);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => changeUserIconImage(item)} className="py-2 px-3">
            <Image source={USER_ICONS[item]} className="w-10 h-12 rounded-full border-2 border-gray-300" />
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
                        <Image source={USER_ICONS[userIconImage]} className="w-24 h-32 border-4 border-blue-500" />
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
