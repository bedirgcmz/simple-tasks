import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { Picker } from "@react-native-picker/picker";
import moment from "moment-timezone";
import { useTodoListContext } from "../context/todos-context";
import LottieView from "lottie-react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";

const TimePicker = ({ setDueTime, defaultTime }) => {
  const { t } = useTodoListContext();
  const [hours, setHours] = useState(defaultTime ? defaultTime.slice(0, 2) : "12");
  const [minutes, setMinutes] = useState(defaultTime ? defaultTime.slice(3, 5) : "00");
  const [isPickerVisible, setPickerVisible] = useState(false);
  const doneRefTim = useRef();

  useEffect(() => {
    setHours(defaultTime ? defaultTime.slice(0, 2) : "12");
    setMinutes(defaultTime ? defaultTime.slice(3, 5) : "00");
  }, [defaultTime, setDueTime]);

  const handleConfirm = () => {
    const localTime = moment()
      .set({ hour: parseInt(hours), minute: parseInt(minutes), second: 0 })
      .format("HH:mm:ss");
    setDueTime(localTime);
    setPickerVisible(false);
  };

  const generateOptions = (max) =>
    Array.from({ length: max + 1 }, (_, i) => i.toString().padStart(2, "0"));

  const controlSelectedTime = `${hours}:${minutes}`;

  return (
    <View style={{ marginBottom: 16 }}>
      {/* Section label */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <Ionicons name="time-outline" size={13} color="#60a5fa" />
        <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase' }}>
          {t("TimePicker_Select_a_due_time")}
        </Text>
      </View>

      {/* Trigger button */}
      <TouchableOpacity
        onPress={() => setPickerVisible(true)}
        style={{
          backgroundColor: 'rgba(255,255,255,0.08)',
          borderWidth: 1,
          borderColor: 'rgba(96,165,250,0.28)',
          borderRadius: 14,
          paddingHorizontal: 14,
          paddingVertical: 13,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Ionicons name="time-outline" size={16} color="#60a5fa" />
        <Text style={{ color: 'white', fontWeight: '600', flex: 1 }}>
          {controlSelectedTime === "12:00" ? t("Default_Time") : t("TimePicker_Selected_Time")}
          {"  "}
          <Text style={{ color: '#93c5fd' }}>{`${hours}:${minutes}`}</Text>
        </Text>
        <LottieView
          style={{ width: 24, height: 24 }}
          source={require('../../assets/data/done2.json')}
          ref={doneRefTim}
          loop={false}
          autoPlay={true}
          speed={2}
        />
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={isPickerVisible} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{
            backgroundColor: 'rgba(12,8,35,0.97)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.14)',
            borderRadius: 24,
            padding: 20,
            width: '88%',
          }}>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 }}>
              {t("TimePicker_Select_Time")}
            </Text>

            <View style={{ flexDirection: 'row' }}>
              {/* Hours */}
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ color: 'rgba(255,255,255,0.55)', fontWeight: '600', marginBottom: 6, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' }}>
                  {t("TimePicker_Hours")}
                </Text>
                <Picker
                  selectedValue={hours}
                  onValueChange={(val) => setHours(val)}
                  style={{ width: '100%', color: 'white' }}
                  itemStyle={{ color: 'white' }}
                >
                  {generateOptions(23).map((h) => (
                    <Picker.Item key={h} label={h} value={h} />
                  ))}
                </Picker>
              </View>

              {/* Divider */}
              <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.10)', marginVertical: 8 }} />

              {/* Minutes */}
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ color: 'rgba(255,255,255,0.55)', fontWeight: '600', marginBottom: 6, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' }}>
                  {t("TimePicker_Minutes")}
                </Text>
                <Picker
                  selectedValue={minutes}
                  onValueChange={(val) => setMinutes(val)}
                  style={{ width: '100%', color: 'white' }}
                  itemStyle={{ color: 'white' }}
                >
                  {generateOptions(59).map((m) => (
                    <Picker.Item key={m} label={m} value={m} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Buttons */}
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
              <TouchableOpacity
                onPress={() => setPickerVisible(false)}
                style={{
                  flex: 1, alignItems: 'center', paddingVertical: 12,
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)',
                  borderRadius: 12,
                }}
              >
                <Text style={{ color: 'rgba(255,255,255,0.65)', fontWeight: '600' }}>
                  {t("TimePicker_Cancel")}
                </Text>
              </TouchableOpacity>

              <LinearGradient
                colors={['#60a5fa', '#3b82f6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1, borderRadius: 12, overflow: 'hidden' }}
              >
                <TouchableOpacity
                  onPress={handleConfirm}
                  style={{ alignItems: 'center', paddingVertical: 12 }}
                >
                  <Text style={{ color: 'white', fontWeight: '700' }}>
                    {t("TimePicker_Confirm")}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TimePicker;
