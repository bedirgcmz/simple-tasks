import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";

const CustomCategoryPicker = ({ options, selectedValue, onValueChange }) => {
  const [visible, setVisible] = useState(false);

  const handleSelect = (value) => {
    onValueChange(value);
    setVisible(false);
  };

  return (
    <>
      {/* Buton */}
      <TouchableOpacity
        onPress={() => setVisible(true)}
        className="bg-purple-300 py-3 px-4 rounded-lg mb-4"
      >
        <Text className="text-gray-800 text-center">
          {selectedValue || "Select Category"}
        </Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={visible} transparent={true} animationType="slide">
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="w-4/5 bg-white rounded-lg p-6 shadow-lg">
            <Text className="text-lg font-bold text-center text-gray-800 mb-4">
              Choose a Category
            </Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  className="py-3 border-b border-gray-300"
                >
                  <Text className="text-gray-700 text-center">{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => setVisible(false)}
              className="bg-red-500 py-3 rounded-lg mt-4"
            >
              <Text className="text-white text-center font-semibold">
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default CustomCategoryPicker;
