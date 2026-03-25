import React, { useRef, useState } from 'react';
import { Modal, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { useTodoListContext } from '../context/todos-context';
import LottieView from "lottie-react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const CustomRemindPicker = ({ options, selectedValue, onValueChange }) => {
  const { t } = useTodoListContext();
  const [modalVisible, setModalVisible] = useState(false);
  const doneRefRim = useRef();

  return (
    <View>
      {/* Trigger button */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          backgroundColor: 'rgba(255,255,255,0.08)',
          borderWidth: 1,
          borderColor: 'rgba(251,191,36,0.28)',
          borderRadius: 14,
          paddingHorizontal: 14,
          paddingVertical: 13,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Ionicons name="notifications-outline" size={16} color="#fbbf24" />
        <Text style={{ color: 'white', fontWeight: '600', flex: 1 }}>
          {selectedValue || t("Select_a_remind_time")}
        </Text>
        <LottieView
          style={{ width: 24, height: 24 }}
          source={require('../../assets/data/done2.json')}
          ref={doneRefRim}
          loop={false}
          autoPlay={true}
          speed={2}
        />
      </TouchableOpacity>

      {/* Bottom sheet modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.65)' }}>
          <View style={{
            backgroundColor: 'rgba(12,8,35,0.98)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.12)',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingBottom: 32,
            paddingTop: 8,
          }}>
            {/* Handle bar */}
            <View style={{
              width: 40, height: 4, borderRadius: 2,
              backgroundColor: 'rgba(255,255,255,0.20)',
              alignSelf: 'center', marginBottom: 16,
            }} />

            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const isActive = item === selectedValue;
                return (
                  <TouchableOpacity
                    onPress={() => { onValueChange(item); setModalVisible(false); }}
                    style={{
                      paddingHorizontal: 20,
                      paddingVertical: 14,
                      borderBottomWidth: 1,
                      borderBottomColor: 'rgba(255,255,255,0.07)',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text style={{
                      color: isActive ? '#fde68a' : 'rgba(255,255,255,0.75)',
                      fontWeight: isActive ? '700' : '400',
                      fontSize: 15,
                    }}>
                      {item}
                    </Text>
                    {isActive && <Ionicons name="checkmark" size={17} color="#fbbf24" />}
                  </TouchableOpacity>
                );
              }}
            />

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                marginHorizontal: 20,
                marginTop: 12,
                paddingVertical: 13,
                backgroundColor: 'rgba(255,255,255,0.08)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.14)',
                borderRadius: 14,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'rgba(255,255,255,0.65)', fontWeight: '600' }}>
                {t("Close")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CustomRemindPicker;
