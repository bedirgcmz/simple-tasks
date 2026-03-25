import React, { useState } from "react";
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
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import LottieView from "lottie-react-native";
import { useTodoListContext } from "../context/todos-context";
import uuid from "react-native-uuid";
import TimePicker from "./TimePicker";
import CustomRemindPicker from "./CustomRemindPicker";
import FilterByCategory from "./FilterByCategory";
import translations from "../locales/translations";
import { scheduleNotification } from "../utils/notificationUtils";

const SectionLabel = ({ icon, label }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8, marginTop: 14 }}>
    <Ionicons name={icon} size={13} color="rgba(255,255,255,0.45)" />
    <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.7 }}>
      {label}
    </Text>
  </View>
);

const glassField = {
  backgroundColor: 'rgba(255,255,255,0.07)',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.13)',
  borderRadius: 12,
  paddingHorizontal: 14,
  paddingVertical: 11,
  color: 'white',
  fontSize: 15,
};

const QuickAddTodoModal = ({ visible, onClose, selectedDate }) => {
  const { t, addTodo, language, getCategories } = useTodoListContext();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [dueTime, setDueTime] = useState("12:00");
  const [reminderTime, setReminderTime] = useState("5 minutes before");

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

    setTitle("");
    setDescription("");
    setCategory("");
    setDueTime("12:00");
    setReminderTime("5 minutes before");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, justifyContent: 'flex-end' }}
      >
        {/* Backdrop */}
        <TouchableOpacity
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.55)' }}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Sheet */}
        <View style={{
          backgroundColor: '#0e0a28',
          borderTopLeftRadius: 24, borderTopRightRadius: 24,
          borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1,
          borderColor: 'rgba(255,255,255,0.12)',
          maxHeight: '92%',
          paddingBottom: Platform.OS === 'ios' ? 36 : 20,
        }}>
          {/* Handle bar */}
          <View style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 6 }}>
            <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.20)' }} />
          </View>

          {/* Header */}
          <View style={{
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            paddingHorizontal: 18, paddingBottom: 12,
            borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)',
          }}>
            <View>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '800' }}>{t("Add_ToDo")}</Text>
              <Text style={{ color: '#fbbf24', fontSize: 12, fontWeight: '600', marginTop: 2 }}>{selectedDate}</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={{
                backgroundColor: 'rgba(255,255,255,0.08)',
                borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
                borderRadius: 20, width: 32, height: 32,
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Ionicons name="close" size={16} color="rgba(255,255,255,0.70)" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Title */}
            <SectionLabel icon="pencil-outline" label={t("Title_input")} />
            <TextInput
              placeholder={t("Title_input")}
              placeholderTextColor="rgba(255,255,255,0.30)"
              value={title}
              onChangeText={setTitle}
              style={glassField}
              maxLength={60}
            />
            <Text style={{ color: 'rgba(255,255,255,0.30)', fontSize: 11, textAlign: 'right', marginTop: 4 }}>
              {title.length}/60
            </Text>

            {/* Description */}
            <SectionLabel icon="document-text-outline" label={t("Description_input")} />
            <TextInput
              placeholder={t("Description_input")}
              placeholderTextColor="rgba(255,255,255,0.30)"
              value={description}
              onChangeText={setDescription}
              style={[glassField, { minHeight: 70, textAlignVertical: 'top' }]}
              multiline
              maxLength={200}
            />

            {/* Category */}
            <SectionLabel icon="folder-outline" label={t("Select_a_category")} />
            <View style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
              borderRadius: 12, padding: 10, marginBottom: 10,
              flexDirection: 'row', flexWrap: 'wrap', gap: 4,
            }}>
              {getCategories().map((item) => (
                <TouchableOpacity key={item} onPress={() => setCategory(item)}>
                  <FilterByCategory categoryName={item} selectedCategory={category} />
                </TouchableOpacity>
              ))}
            </View>

            {/* Time */}
            <TimePicker setDueTime={setDueTime} defaultTime={dueTime} />

            {/* Reminder */}
            <SectionLabel icon="notifications-outline" label={t("Select_a_remind_time")} />
            <CustomRemindPicker
              options={Object.values(translations[language].reminderTime)}
              selectedValue={
                translations[language].reminderTime[
                  Object.keys(translations["en"].reminderTime).find(
                    (key) => translations["en"].reminderTime[key] === reminderTime
                  )
                ]
              }
              onValueChange={handleReminderChange}
            />

            {/* Add button */}
            <TouchableOpacity onPress={handleAdd} style={{ marginTop: 20 }}>
              <LinearGradient
                colors={['#fb923c', '#ea580c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ borderRadius: 14, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={{ color: 'white', fontSize: 15, fontWeight: '800' }}>{t("Add_ToDo")}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default QuickAddTodoModal;
