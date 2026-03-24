import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient';
import SettingsModal from "./SettingsModal";
import { useTodoListContext } from "../context/todos-context";
import { USER_ICONS } from "../utils/userIconsMap";
import Ionicons from '@expo/vector-icons/Ionicons';

const Header = () => {
  const { t, username, userIconImage } = useTodoListContext();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10 }}>

      {/* Avatar + Greeting */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View style={{
            width: 46, height: 46, borderRadius: 23,
            borderWidth: 1.5, borderColor: 'rgba(96,165,250,0.50)',
            backgroundColor: 'rgba(96,165,250,0.10)',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Image source={USER_ICONS[userIconImage]} style={{ width: 30, height: 30, borderRadius: 15 }} />
            <View style={{ position: 'absolute', bottom: -2, right: -2 }}>
              <Ionicons name="settings-sharp" size={14} color="rgba(255,255,255,0.75)" />
            </View>
          </View>
        </TouchableOpacity>

        <SettingsModal visible={modalVisible} onClose={() => setModalVisible(false)} />

        <View>
          <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>{t("welcome")}!</Text>
          <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: '700' }}>
            {username === "" ? t("Guest") : username}
          </Text>
        </View>
      </View>

      {/* Add button */}
      <TouchableOpacity onPress={() => router.push("/add")}>
        <LinearGradient
          colors={['#fb923c', '#ea580c']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20 }}
        >
          <Ionicons name="add" size={14} color="white" />
          <Text style={{ color: 'white', fontSize: 12, fontWeight: '700' }}>{t("Add_New_ToDo")}</Text>
        </LinearGradient>
      </TouchableOpacity>

    </View>
  )
}

export default Header