import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import moment from "moment-timezone"; // Moment.js'i import ediyoruz

const TimePicker = ({ setDueTime, defaultTime }) => {
  const [hours, setHours] = useState(defaultTime ? defaultTime.slice(0,2) : "00");
  const [minutes, setMinutes] = useState(defaultTime ? defaultTime.slice(3,5) : "00");
  const [isPickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
      setHours(defaultTime ? defaultTime.slice(0, 2) : "00");
      setMinutes(defaultTime ? defaultTime.slice(3, 5) : "00");
  },[defaultTime, setDueTime])

  const handleConfirm = () => {
    // Kullanıcının seçtiği saat ve dakika bilgisi
    const selectedTime = `${hours}:${minutes}`; // Sadece saat ve dakika
    
    // Moment.js ile yerel zamanı oluşturuyoruz (sadece saat ve dakika bilgisiyle)
    const localTime = moment()
      .set({ hour: parseInt(hours), minute: parseInt(minutes), second: 0 })
      .format("HH:mm:ss"); // ISO formatında yerel zaman

    // Seçilen zamanı dışarı gönder
    setDueTime(localTime); // setDueTime fonksiyonunu çağırıyoruz
    console.log("Tim Picker local format:", localTime); // Konsole yazdırıyoruz
    setPickerVisible(false); // Modalı kapatıyoruz
  };

  const generateOptions = (max) => {
    return Array.from({ length: max + 1 }, (_, i) =>
      i.toString().padStart(2, "0")
    );
  };

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="font-bold text-[#d7c8f3] w-full mb-2">Select a due time</Text>

      {/* Zaman Seçici Butonu */}
      <TouchableOpacity
        onPress={() => setPickerVisible(true)}
        className="bg-[#d7c8f3] px-4 py-2 rounded-lg w-full mb-2 py-3"
      >
        <Text className="text-gray-600 font-semibold text-center">
          Selected Time:{" "}
          <Text className="text-gray-800">{`${hours}:${minutes}`}</Text>
        </Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={isPickerVisible} transparent={true} animationType="slide">
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
          <View className="bg-white w-11/12 rounded-lg p-4">
            <Text className="text-lg font-bold text-gray-800 mb-4 text-center">
              Select Time
            </Text>

            {/* Saat ve Dakika */}
            <View className="flex-row justify-between">
              {/* Saat */}
              <View className="flex-1 items-center">
                <Text className="text-gray-700 font-semibold mb-2">Hours</Text>
                <Picker
                  selectedValue={hours}
                  onValueChange={(itemValue) => setHours(itemValue)}
                  style={{ width: "100%" }}
                >
                  {generateOptions(23).map((hour) => (
                    <Picker.Item key={hour} label={hour} value={hour} />
                  ))}
                </Picker>
              </View>

              {/* Dakika */}
              <View className="flex-1 items-center">
                <Text className="text-gray-700 font-semibold mb-2">Minutes</Text>
                <Picker
                  selectedValue={minutes}
                  onValueChange={(itemValue) => setMinutes(itemValue)}
                  style={{ width: "100%" }}
                >
                  {generateOptions(59).map((minute) => (
                    <Picker.Item key={minute} label={minute} value={minute} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Buttons */}
            <View className="flex-row justify-between mt-4">
              <TouchableOpacity
                onPress={() => setPickerVisible(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg"
              >
                <Text className="text-gray-800 font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirm}
                className="bg-blue-500 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-semibold">Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TimePicker;
