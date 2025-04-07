// File: app/edit-recurring/[id].js

import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTodoListContext } from "../../../context/todos-context";
import moment from "moment-timezone";
import uuid from "react-native-uuid";
import FilterByCategory from "../../../components/FilterByCategory";
import CategoryModal from "../../../components/CategoryModal";
import TimePicker from "../../../components/TimePicker";
import LottieView from "lottie-react-native";
import AddTodoTabs from "../../../components/AddTodoTabs";
import CustomRemindPicker from "../../../components/CustomRemindPicker";
import translations from "../../../locales/translations";
import { scheduleNotification } from "../../../utils/notificationUtils";
import { testNotificationLog } from "../../../utils/test";

const weekDays = [
  { id: 1, label: "Pzt" },
  { id: 2, label: "Sal" },
  { id: 3, label: "Çar" },
  { id: 4, label: "Per" },
  { id: 5, label: "Cum" },
  { id: 6, label: "Cmt" },
  { id: 0, label: "Paz" },
];

const EditRecurringTodoPage = () => {
  const { id, from } = useLocalSearchParams();
  const {
      todos,
      updateAllInGroup,
      t,
      getCategories,
      addUserCategory,
      language,
    } = useTodoListContext();

    const targetTodo = todos.find(todo => todo.id === id)
    const repeatGroupId = targetTodo?.repeatGroupId
  const groupTodos = todos.filter((todo) => todo.repeatGroupId === repeatGroupId);
  const sampleTodo = groupTodos[0];

  const [title, setTitle] = useState(sampleTodo?.title || "");
  const [description, setDescription] = useState(sampleTodo?.description || "");
  const [selectedDays, setSelectedDays] = useState(
    sampleTodo?.repeatDays || []
  );
  const [dueTime, setDueTime] = useState(sampleTodo?.dueTime || "12:00:00");
  const [repeatEndDate, setRepeatEndDate] = useState(
    sampleTodo
      ? moment.max(groupTodos.map((t) => moment(t.dueDate))).toDate()
      : null
  );
  const [category, setCategory] = useState(sampleTodo?.category || "");
  const [reminderTime, setReminderTime] = useState(
    sampleTodo?.reminderTime || "1 day before"
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const doneRefCat = useRef();

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };
  

  const handleReminderChange = (selectedLabel) => {
    let englishValue = "5 minutes before"; // Varsayılan değer

    if (
      selectedLabel === translations[language].reminderTime._5_minutes_before
    ) {
      englishValue = "5 minutes before";
    } else if (
      selectedLabel === translations[language].reminderTime._10_minutes_before
    ) {
      englishValue = "10 minutes before";
    } else if (
      selectedLabel === translations[language].reminderTime._30_minutes_before
    ) {
      englishValue = "30 minutes before";
    } else if (
      selectedLabel === translations[language].reminderTime._1_hour_before
    ) {
      englishValue = "1 hour before";
    } else if (
      selectedLabel === translations[language].reminderTime._2_hours_before
    ) {
      englishValue = "2 hours before";
    } else if (
      selectedLabel === translations[language].reminderTime._6_hours_before
    ) {
      englishValue = "6 hours before";
    } else if (
      selectedLabel === translations[language].reminderTime._1_day_before
    ) {
      englishValue = "1 day before";
    } else if (
      selectedLabel === translations[language].reminderTime._1_week_before
    ) {
      englishValue = "1 week before";
    }

    setReminderTime(englishValue);
  };

  const handleCategorySelection = (selectedCategory) => {
    if (selectedCategory === "New Category") {
      setIsCategoryModalVisible(true);
    } else {
      setCategory(selectedCategory);
      Keyboard.dismiss();
      doneRefCat?.current?.play();
    }
  };

  const handleUpdateRecurringTodos = async () => {
    if (!title || !selectedDays.length || !repeatEndDate || !category) {
      Alert.alert("Eksik Bilgi", "Lütfen tüm alanları doldurun.");
      return;
    }
  
    const updatedTodos = [];
    const today = moment().startOf("day");
    const endDate = moment(repeatEndDate).endOf("day");
    let current = today.clone();
  
    while (current.isSameOrBefore(endDate, "day")) {
      const currentDay = current.day();
      if (selectedDays.includes(currentDay)) {
        const newTodo = {
          id: uuid.v4(),
          title,
          description,
          category,
          status: "pending",
          createdAt: moment().toISOString(),
          dueDate: current.format("YYYY-MM-DD"),
          dueTime,
          reminderTime,
          completedAt: null,
          isRecurring: true,
          repeatGroupId: repeatGroupId,
          repeatDays: selectedDays,
        };
  
        // 🔔 Bildirim planla
        const notificationId = await scheduleNotification(newTodo, t, language);
        newTodo.notificationId = notificationId;
  
        updatedTodos.push(newTodo);
      }
      current.add(1, "day");
    }
  
    await updateAllInGroup(repeatGroupId, updatedTodos, { skipNotification: true });

    Alert.alert("Güncellendi", "Tekrarlı görevler başarıyla güncellendi.");
    // testNotificationLog(todos)
    router.push("/filter");
  };
  

  return (
    <ScrollView className="flex-1 bg-[#0d1b2a] p-4">
      <AddTodoTabs />

      <TextInput
        placeholder="Görev Başlığı"
        placeholderTextColor="gray"
        value={title}
        onChangeText={setTitle}
        className="bg-gray-700 p-3 rounded-md text-white mb-4 mt-4"
      />

      <TextInput
        placeholder="Açıklama"
        placeholderTextColor="gray"
        value={description}
        onChangeText={setDescription}
        className="bg-gray-700 p-3 rounded-md text-white mb-4"
        multiline
      />

      <Text className="text-white text-md font-bold mb-2">Kategori Seç</Text>
      <View className="flex-row flex-wrap items-center justify-start bg-gray-700 py-2 rounded-lg">
        {getCategories()?.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => handleCategorySelection(item)}
          >
            <FilterByCategory
              categoryName={item}
              selectedCategory={category}
              bgColor="bg-gray-700"
              textColor="text-gray-400"
            />
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          onPress={() => handleCategorySelection("New Category")}
          className="bg-blue-500 px-2 py-[3px] mb-1 rounded-md mx-1"
        >
          <Text className="text-white">Kategori +</Text>
        </TouchableOpacity>
        {category !== "" && (
          <LottieView
            style={{ width: 27, height: 27, opacity: 1 }}
            className="absolute right-0 top-[0px] z-40"
            source={require("../../../../assets/data/done2.json")}
            ref={doneRefCat}
            loop={false}
            autoPlay={true}
            speed={2}
          />
        )}
      </View>

      <CategoryModal
        isVisible={isCategoryModalVisible}
        onClose={() => setIsCategoryModalVisible(false)}
        onAddCategory={addUserCategory}
        setCategory={setCategory}
        t={t}
      />

      <Text className="text-white text-md font-bold mb-2 mt-4">
        Hangi Günlerde Tekrar Etsin?
      </Text>
      <View className="flex-row flex-wrap">
        {weekDays.map((day) => (
          <TouchableOpacity
            key={day.id}
            onPress={() => toggleDay(day.id)}
            className={`px-4 py-2 m-1 rounded-md ${
              selectedDays.includes(day.id) ? "bg-blue-500" : "bg-gray-700"
            }`}
          >
            <Text
              className={`text-gray-400 ${
                selectedDays.includes(day.id) ? "text-white" : ""
              }`}
            >
              {day.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TimePicker
        setDueTime={setDueTime}
        defaultTime={dueTime}
        bgColor="bg-gray-700"
        textColor="text-white"
      />
      {/* Hatırlatma Seçimi */}
      <Text className="text-white text-md text-left w-full font-bold mb-2">
        {t("Select_a_remind_time")}
      </Text>
      <CustomRemindPicker
        bgColor="bg-gray-700"
        textColor="text-white"
        options={Object.values(translations[language].reminderTime)} // Kullanıcının göreceği çeviri metinleri
        selectedValue={
          translations[language].reminderTime[
            Object.keys(translations["en"].reminderTime).find(
              (key) => translations["en"].reminderTime[key] === reminderTime
            )
          ] || translations[language].reminderTime._5_minutes_before
        }
        onValueChange={handleReminderChange}
      />

      <Text className="text-white text-md font-bold mb-2 mt-4">
        Tekrar Sonlanma Tarihi
      </Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        className="bg-gray-700 p-3 rounded-md text-white"
      >
        <Text className="text-white">
          {repeatEndDate
            ? moment(repeatEndDate).format("YYYY-MM-DD")
            : "Tarih Seç"}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={repeatEndDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setRepeatEndDate(selectedDate);
          }}
        />
      )}

      <View className="flex-row justify-between">
        <TouchableOpacity
          onPress={handleUpdateRecurringTodos}
          className="bg-red-400 p-4 rounded-md mt-6"
        >
          <Text className="text-white text-center font-bold">
            Görevleri Güncelle
          </Text>
        </TouchableOpacity>
        {/* Go Back */}
        <TouchableOpacity
          onPress={() => {
            if (from == "list") {
                router.push(`/list`); 
            } else {
                router.push(`/dynamicid/${targetTodo.id}`);
            }
          }}
          className="bg-[#0a2472] py-4 rounded-r-md mt-6"
        >
          <Text className="text-white text-center font-bold px-6">
            {t("Alert_Cancel")}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditRecurringTodoPage;
