import React, { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Keyboard } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTodoListContext } from "../../../context/todos-context";
import { router } from "expo-router";
import moment from "moment-timezone";
import FilterByCategory from "../../../components/FilterByCategory";
import CategoryModal from "../../../components/CategoryModal";
import TimePicker from "../../../components/TimePicker";
import LottieView from "lottie-react-native";
import translations from "../../../locales/translations";
import AddTodoTabs from "../../../components/AddTodoTabs";

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
  const { addTodo, t, getCategories, addUserCategory } = useTodoListContext();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [dueTime, setDueTime] = useState("09:00");
  const [repeatEndDate, setRepeatEndDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState("");
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);

  const doneRefCat = useRef();

  const toggleDay = (day) => {
    setSelectedDays((prevDays) =>
      prevDays.includes(day) ? prevDays.filter((d) => d !== day) : [...prevDays, day]
    );
  };

  const handleAddRecurringTodo = () => {
    if (!title || selectedDays.length === 0 || !repeatEndDate || !category) {
      alert("Lütfen tüm bilgileri doldurun.");
      return;
    }

    const newTodo = {
      id: Date.now().toString(),
      title,
      description,
      category,
      status: "pending",
      createdAt: new Date().toISOString(),
      dueTime,
      reminderTime: "5 minutes before",
      repeatDays: selectedDays,
      repeatEndDate: repeatEndDate,
    };

    addTodo(newTodo);
    alert("Tekrarlı Görev Eklendi!");
    router.push("/list");
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
      {/* <Text className="text-white text-xl font-bold text-center mb-4">
        Tekrarlı Görev Ekle
      </Text> */}

      {/* Başlık */}
      <TextInput
        placeholder="Görev Başlığı"
        placeholderTextColor="gray"
        value={title}
        onChangeText={setTitle}
        className="bg-gray-700 p-3 rounded-md text-white mb-4 mt-4"
      />

      {/* Açıklama */}
      <TextInput
        placeholder="Açıklama (Opsiyonel)"
        placeholderTextColor="gray"
        value={description}
        onChangeText={setDescription}
        className="bg-gray-700 p-3 rounded-md text-white mb-4"
        multiline
      />

      {/* 📌 Kategori Seçimi */}
      <Text className="text-white text-md font-bold mb-2">Kategori Seç</Text>
      <View className="flex-row flex-wrap items-center justify-start bg-gray-700 py-2 rounded-lg">
        {getCategories()?.map((item) => (
          <TouchableOpacity key={item} onPress={() => handleCategorySelection(item)}>
            <FilterByCategory categoryName={item} selectedCategory={category} bgColor="bg-gray-700" textColor="text-gray-400" />
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

      {/* 📌 CategoryModal Kullanımı */}
      <CategoryModal
        isVisible={isCategoryModalVisible}
        onClose={() => setIsCategoryModalVisible(false)}
        onAddCategory={addUserCategory}
        setCategory={setCategory}
        t={t}
      />

      {/* 📌 Gün Seçimi */}
      <Text className="text-white text-md font-bold mb-2">Hangi Günlerde Tekrar Etsin?</Text>
      <View className="flex-row flex-wrap">
        {weekDays.map((day) => (
          <TouchableOpacity
            key={day.id}
            onPress={() => toggleDay(day.id)}
            className={`px-4 py-2 m-1 rounded-md ${
              selectedDays.includes(day.id) ? "bg-blue-500" : "bg-gray-700"
            }`}
          >
            <Text className={`text-gray-400 ${selectedDays.includes(day.id) ? "text-white" : "" }`}>{day.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 📌 Saat Seçimi */}
      <TimePicker setDueTime={setDueTime} defaultTime={dueTime} bgColor="bg-gray-700" textColor="text-white"/>

      {/* 📌 Sonlanma Tarihi */}
      <Text className="text-white text-md font-bold mb-2">Tekrar Sonlanma Tarihi</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        className="bg-gray-700 p-3 rounded-md text-white"
      >
        <Text className="text-white">
          {repeatEndDate ? moment(repeatEndDate).format("YYYY-MM-DD") : "Tarih Seç"}
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

      {/* 📌 Kaydet Butonu */}
      <TouchableOpacity
        onPress={handleAddRecurringTodo}
        className="bg-green-500 p-4 rounded-md mt-6"
      >
        <Text className="text-white text-center font-bold">Tekrarlı Görev Ekle</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddRecurringTodoPage;
