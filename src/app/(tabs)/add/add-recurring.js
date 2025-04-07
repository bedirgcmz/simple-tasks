import React, { useState, useRef } from "react";
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
import { router } from "expo-router";
import moment from "moment-timezone";
import FilterByCategory from "../../../components/FilterByCategory";
import CategoryModal from "../../../components/CategoryModal";
import TimePicker from "../../../components/TimePicker";
import LottieView from "lottie-react-native";
import AddTodoTabs from "../../../components/AddTodoTabs";
import uuid from "react-native-uuid";
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

const AddRecurringTodoPage = () => {
  const { addTodo, t, getCategories, addUserCategory, language, todos } =
    useTodoListContext();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [dueTime, setDueTime] = useState("12:00:00");
  const [repeatEndDate, setRepeatEndDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState("");
  const [reminderTime, setReminderTime] = useState("5 minutes before");
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const doneRefCat = useRef();

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

  const toggleDay = (day) => {
    setSelectedDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day]
    );
  };

  const handleAddRecurringTodo = async () => {
    if (!title || selectedDays.length === 0 || !repeatEndDate || !category) {
      alert("Lütfen tüm bilgileri doldurun.");
      return;
    }
  
    const groupId = uuid.v4();
    const createdTodos = [];
    const today = moment().startOf("day");
    const endDate = moment(repeatEndDate).endOf("day");
    let current = today.clone();
  
    while (current.isSameOrBefore(endDate, "day")) {
      const currentDay = current.day();
      if (selectedDays.includes(currentDay)) {
        const baseTodo = {
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
          repeatGroupId: groupId,
          repeatDays: selectedDays,
        };
  
        // 🔔 Bildirimi planla ve yeni todo'ya ekle
        const notificationId = await scheduleNotification(baseTodo, t, language);
        const finalTodo = { ...baseTodo, notificationId };
  
        createdTodos.push(finalTodo);
      }
      current.add(1, "day");
    }
  
    // ✅ Asenkron şekilde sırayla todos'u ekle
    for (const todo of createdTodos) {
      await addTodo(todo); // await ekledik
    }
  
    alert("Tekrarlı Görevler Eklendi!");
    // testNotificationLog([...createdTodos]); // test için istersen todos yerine bu da olabilir
    router.push("/filter");
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

  return (
    <ScrollView className="flex-1 bg-[#0d1b2a] p-4">
      <AddTodoTabs />
      {/* Başlık */}
      <TextInput
        placeholder="Görev Başlığı"
        placeholderTextColor="gray"
        value={title}
        onChangeText={setTitle}
        className="bg-gray-700 p-3 rounded-md text-white mb-4 mt-4"
        maxLength={60}
      />

      {/* Açıklama */}
      <TextInput
        placeholder="Açıklama (Opsiyonel)"
        placeholderTextColor="gray"
        value={description}
        onChangeText={setDescription}
        className="bg-gray-700 p-3 rounded-md text-white mb-4"
        multiline
        maxLength={200}
      />

      {/* Kategori */}
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
          <Text className="text-white">{t("Create_Category")} +</Text>
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

      {/* Gün Seçimi */}
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

      {/* Zaman Seçimi */}
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
      {/* Sonlanma Tarihi */}
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
          textColor="white"
          style={{ color: "white" }}
          value={repeatEndDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setRepeatEndDate(selectedDate);
          }}
        />
      )}

      {/* Kaydet */}
      <TouchableOpacity
        onPress={handleAddRecurringTodo}
        className="bg-red-400 p-4 rounded-md mt-6"
      >
        <Text className="text-white text-center font-bold">
          Tekrarlı Görevleri Ekle
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddRecurringTodoPage;
