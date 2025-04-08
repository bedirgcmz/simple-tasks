// components/QuickAddTodoModal.js
import React, { useState, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import LottieView from "lottie-react-native";
import { useTodoListContext } from "../context/todos-context";
import uuid from "react-native-uuid";
import TimePicker from "./TimePicker";
import CustomRemindPicker from "./CustomRemindPicker";
import FilterByCategory from "./FilterByCategory";
import translations from "../locales/translations";
import moment from "moment-timezone";
import { scheduleNotification } from "../utils/notificationUtils";

const QuickAddTodoModal = ({ visible, onClose, selectedDate }) => {
  const { t, addTodo, language, getCategories } = useTodoListContext();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [dueTime, setDueTime] = useState("12:00");
  const [reminderTime, setReminderTime] = useState("5 minutes before");

  const successRef = useRef();

  const handleReminderChange = (selectedLabel) => {
    const options = translations[language].reminderTime;
    const map = Object.entries(options).find(([_, v]) => v === selectedLabel);
    setReminderTime(map ? translations["en"].reminderTime[map[0]] : "5 minutes before");
  };

  const handleAdd = async () => {
    if (!title || !category) {
      alert(t("Alert_in_handle_add_todo"));
      return;
    }

    const newTodo = {
      id: uuid.v4(),
      title,
      description,
      category,
      status: "pending",
      createdAt: new Date().toISOString(),
      dueDate: selectedDate,
      dueTime,
      reminderTime,
      completedAt: null,
      isRecurring: false,
      repeatGroupId: null,
      repeatDays: null,
    };

    const notificationId = await scheduleNotification(newTodo, t, language);
    addTodo({ ...newTodo, notificationId });
    onClose(); // modal'ı kapat

    // State reset (opsiyonel)
    setTitle("");
    setDescription("");
    setCategory("");
    setDueTime("12:00");
    setReminderTime("5 minutes before");
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 justify-end">
        <View className="bg-[#d7c8f3] rounded-t-2xl p-4 max-h-[95%]">
            <TouchableOpacity onPress={onClose} className="absolute right-3 top-[-36px] bg-gray-400 rounded-full z-234888 w-8 h-8 text-centerflex items-center justify-center"><Text className="text-white bg-red font-bold">X</Text></TouchableOpacity>
          <ScrollView showsVerticalScrollIndicator={false}>
            <TextInput
              placeholder={t("Title_input")}
              value={title}
              onChangeText={setTitle}
              className="bg-white p-3 rounded mb-2"
              maxLength={60}
            />
            <TextInput
              placeholder={t("Description_input")}
              value={description}
              onChangeText={setDescription}
              className="bg-white p-3 rounded mb-2"
              multiline
              maxLength={200}

            />
            <Text className="text-gray-700 font-bold mb-2">{t("Select_a_category")}</Text>
            <View className="flex-row flex-wrap bg-white p-2 rounded mb-2">
              {getCategories().map((item) => (
                <TouchableOpacity key={item} onPress={() => setCategory(item)} className="mr-2 mb-1">
                  <FilterByCategory categoryName={item} selectedCategory={category} />
                </TouchableOpacity>
              ))}
            </View>

            <TimePicker setDueTime={setDueTime} defaultTime={false} bgColor="bg-white" textColor="text-gray-700" />

            <Text className="text-gray-700 font-bold mt-2 mb-1">{t("Select_a_remind_time")}</Text>
            <CustomRemindPicker
              bgColor="bg-white"
              textColor="text-gray-700"
              options={Object.values(translations[language].reminderTime)}
              selectedValue={
                translations[language].reminderTime[
                  Object.keys(translations["en"].reminderTime).find((key) => translations["en"].reminderTime[key] === reminderTime)
                ]
              }
              onValueChange={handleReminderChange}
            />

            <TouchableOpacity
              onPress={handleAdd}
              className="bg-red-400  py-3 mt-4 rounded items-center justify-center"
            >
              <Text className="text-white font-bold">{t("Add_ToDo")}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default QuickAddTodoModal;
