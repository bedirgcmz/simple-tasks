import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import DatePicker from 'react-native-modern-datepicker';
import TimePicker from "./TimePicker";


const CustomTimePicker = ({time, setTime }) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      {/* Buton */}
      <TouchableOpacity
        onPress={() => setVisible(true)}
        className="bg-purple-300 py-3 px-4 rounded-lg mb-4"
      >
        <Text className="text-gray-800 text-center">
          {time || "Select Time"}
        </Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={visible} transparent={true} animationType="slide">
        <View className="flex-1 bg-black/50 justify-center items-center px-4 ">
        <DatePicker
          mode="time"
          minuteInterval={3}
          onTimeChange={selectedTime => setTime(selectedTime)}
          style={{ borderRadius: 12 }}
        />
        </View>
        <TimePicker />
      </Modal>
    </>
  );
};

export default CustomTimePicker;
