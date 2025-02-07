import React, { useRef, useState } from 'react';
import { Modal, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { useTodoListContext } from '../context/todos-context';
import LottieView from "lottie-react-native";

const CustomRemindPicker = ({ options, selectedValue, onValueChange }) => {
  const { t } = useTodoListContext();
  const [modalVisible, setModalVisible] = useState(false);
  const doneRefRim = useRef()

  return (
    <View>
      <TouchableOpacity onPress={() => setModalVisible(true)} className="bg-[#d7c8f3] p-3 rounded-md">
        <Text className="text-center text-gray-600">{selectedValue || "Select an option"}</Text>
        <LottieView
          style={{ width: 27, height: 27, opacity: 1}}
          className="absolute right-0 top-[5px] z-40"
          source={require('../../assets/data/done2.json')}
          ref={doneRefRim}
          loop={false}
          autoPlay={true}
          speed={2}
          />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-4/5 p-4 rounded-md">
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    onValueChange(item);
                    setModalVisible(false);
                  }}
                  className="p-4 border-b border-gray-200"
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="bg-red-400 p-3 mt-2 rounded-md"
            >
              <Text className="text-white text-center">{t("Close")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CustomRemindPicker;
