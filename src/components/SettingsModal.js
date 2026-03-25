import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StatusBar, TextInput, Linking, Image } from "react-native";
import { useTodoListContext } from "../context/todos-context";
import { USER_ICONS } from "../utils/userIconsMap";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserIconImageModal from "./UserIconImageModal";
import UserCategoriesModal from "./UserCategoriesModal";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LANG_LABELS = { en: 'EN', tr: 'TR', sv: 'SV', de: 'DE' };

const SettingsModal = ({ visible, onClose }) => {
  const { setLanguage, t, username, setUsername, updateUsername, language, translateTodosCategories, STORAGE_USERNAME_LANGUAGE, userIconImage } = useTodoListContext();
  const insets = useSafeAreaInsets();
  const [isEnableUsername, setIsEnableUsername] = useState(false);
  const [isUserIconImageModalOpen, setIsUserIconImageModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
    setIsEnableUsername(false);
  };

  return (
    <Modal animationType="slide" transparent visible={visible} statusBarTranslucent>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Backdrop */}
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' }}
        activeOpacity={1}
        onPress={onClose}
      >
        {/* Drawer panel — stop propagation so taps inside don't close */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {}}
          style={{ width: '62%', height: '100%' }}
        >
          <LinearGradient
            colors={["#02043d", "#3f127e", "#0671b4"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{ flex: 1, paddingTop: 54, paddingHorizontal: 18, paddingBottom: Math.max(insets.bottom, 10) + 55 }}
          >
            {/* ── Header ── */}
            <View style={{
              flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: 28,
              borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.10)',
              paddingBottom: 14,
            }}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '800' }}>{t("Settings")}</Text>
              <Ionicons name="settings" size={16} color="rgba(255,255,255,0.55)" />
            </View>

            {/* ── Avatar ── */}
            <View style={{ alignItems: 'flex-start', marginBottom: 20 }}>
              <TouchableOpacity
                onPress={() => setIsUserIconImageModalOpen(true)}
                style={{
                  width: 60, height: 60, borderRadius: 30,
                  borderWidth: 2, borderColor: 'rgba(96,165,250,0.50)',
                  backgroundColor: 'rgba(96,165,250,0.10)',
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Image source={USER_ICONS[userIconImage]} style={{ width: 36, height: 36, borderRadius: 18 }} />
                <View style={{
                  position: 'absolute', bottom: -2, right: -2,
                  backgroundColor: 'rgba(30,20,60,0.90)',
                  borderRadius: 10, padding: 2,
                  borderWidth: 1, borderColor: 'rgba(255,255,255,0.20)',
                }}>
                  <MaterialCommunityIcons name="pencil" size={11} color="rgba(255,255,255,0.80)" />
                </View>
              </TouchableOpacity>
              <UserIconImageModal
                setIsUserIconImageModalOpen={setIsUserIconImageModalOpen}
                isUserIconImageModalOpen={isUserIconImageModalOpen}
              />
            </View>

            {/* ── Username ── */}
            <View style={{
              flexDirection: 'row', alignItems: 'center',
              backgroundColor: isEnableUsername ? 'rgba(96,165,250,0.10)' : 'rgba(255,255,255,0.06)',
              borderWidth: 1,
              borderColor: isEnableUsername ? 'rgba(96,165,250,0.45)' : 'rgba(255,255,255,0.12)',
              borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4,
              marginBottom: 28,
            }}>
              <TextInput
                placeholder={t("Type_Your_Name")}
                placeholderTextColor="rgba(255,255,255,0.30)"
                style={{ flex: 1, color: 'white', fontSize: 14, paddingVertical: 7 }}
                value={username}
                onChangeText={setUsername}
                editable={isEnableUsername}
                maxLength={17}
              />
              {isEnableUsername ? (
                <TouchableOpacity onPress={changeUserName}>
                  <Ionicons name="checkmark-circle" size={22} color="#4ade80" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => setIsEnableUsername(true)}>
                  <MaterialCommunityIcons name="pencil" size={18} color="rgba(255,255,255,0.45)" />
                </TouchableOpacity>
              )}
            </View>

            {/* ── Language ── */}
            <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: '700', letterSpacing: 0.8, marginBottom: 10, textTransform: 'uppercase' }}>
              {t("Language")}
            </Text>
            <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 28 }}>
              {["en", "tr", "sv", "de"].map((lang) => {
                const isActive = language === lang;
                return (
                  <TouchableOpacity
                    key={lang}
                    onPress={() => changeLanguage(lang)}
                    style={{
                      paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
                      backgroundColor: isActive ? 'rgba(96,165,250,0.22)' : 'rgba(255,255,255,0.07)',
                      borderWidth: 1,
                      borderColor: isActive ? 'rgba(96,165,250,0.55)' : 'rgba(255,255,255,0.13)',
                    }}
                  >
                    <Text style={{
                      color: isActive ? '#93c5fd' : 'rgba(255,255,255,0.55)',
                      fontSize: 12, fontWeight: isActive ? '700' : '500',
                    }}>
                      {LANG_LABELS[lang]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* ── Personal Categories ── */}
            <TouchableOpacity
              onPress={() => setIsModalVisible(true)}
              style={{
                flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
                backgroundColor: 'rgba(167,139,250,0.12)',
                borderWidth: 1, borderColor: 'rgba(167,139,250,0.35)',
                borderRadius: 12, paddingVertical: 10, marginBottom: 10,
              }}
            >
              <Ionicons name="folder-open-outline" size={15} color="#c4b5fd" />
              <Text style={{ color: '#c4b5fd', fontSize: 12, fontWeight: '600' }}>
                {t("Personal_Categories")}
              </Text>
            </TouchableOpacity>
            <UserCategoriesModal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} t={t} />

            {/* ── Bottom actions ── */}
            <View style={{ marginTop: 'auto' }}>
              {/* Buy Me a Coffee */}
              <TouchableOpacity
                onPress={() => Linking.openURL("https://buymeacoffee.com/bedirgcmzr")}
                style={{
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
                  backgroundColor: 'rgba(180,120,60,0.18)',
                  borderWidth: 1, borderColor: 'rgba(180,120,60,0.40)',
                  borderRadius: 12, paddingVertical: 10, marginBottom: 10,
                }}
              >
                <Text style={{ fontSize: 14 }}>☕</Text>
                <Text style={{ color: '#fde68a', fontSize: 12, fontWeight: '600' }}>{t("Buy_Me")}</Text>
              </TouchableOpacity>

              {/* Close */}
              <TouchableOpacity
                onPress={onClose}
                style={{
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
                  backgroundColor: 'rgba(255,255,255,0.07)',
                  borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
                  borderRadius: 12, paddingVertical: 10,
                }}
              >
                <Ionicons name="close" size={16} color="rgba(255,255,255,0.70)" />
                <Text style={{ color: 'rgba(255,255,255,0.70)', fontSize: 13, fontWeight: '600' }}>
                  {t("Exit_Setting")}
                </Text>
              </TouchableOpacity>
            </View>

          </LinearGradient>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default SettingsModal;
