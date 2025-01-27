import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, router } from "expo-router";
import { useTodoListContext } from "../../../context/todos-context";
import CustomRemindPicker from "../../../components/CustomRemindPicker";
import FilterByCategory from "../../../components/FilterByCategory";
import TimePicker from "../../../components/TimePicker";
import { playCorrectSound } from "../../../utils/play-success-sound";

const EditTodoPage = () => {
  const { id } = useLocalSearchParams();
  const { todos, updateTodo } = useTodoListContext();

  // Düzenlenecek ToDo'yu bul
  const todo = todos.find((item) => item.id === id);

  // Form state'lerini başlat
  const [title, setTitle] = useState(todo?.title || "");
  const [description, setDescription] = useState(todo?.description || "");
  const [category, setCategory] = useState(todo?.category || "");
  const [dueDate, setDueDate] = useState(todo ? new Date(todo.dueDate) : new Date());
  const [dueTime, setDueTime] = useState(todo?.dueTime || "");
  const [reminderTime, setReminderTime] = useState(todo?.reminderTime || "2 hours before");
  const [showDatePicker, setShowDatePicker] = useState(false);

   // todo değiştiğinde state'leri güncelle
   useEffect(() => {
    if (todo) {
      setTitle(todo.title || "");
      setDescription(todo.description || "");
      setCategory(todo.category || "");
      setDueDate(todo.dueDate ? new Date(todo.dueDate) : new Date());
      setDueTime(todo.dueTime || "");
      setReminderTime(todo.reminderTime || "2 hours before");
    }
  }, [id, todo, todos]);

  const categories = [
    "School",
    "Finance",
    "Shopping",
    "Family",
    "Travel",
    "Health",
    "Home",
    "Friends",
    "Work",
    "Fun",
    "Others",
  ];

  const reminderOptions = [
    "5 minutes before",
    "10 minutes before",
    "30 minutes before",
    "1 hour before",
    "2 hours before",
    "6 hours before",
    "1 day before",
    "1 week before",
  ];

  const handleUpdateTodo = () => {
    if (!title || !category) {
      alert("Title and category fields are required!");
      return;
    }

    // Güncellenmiş ToDo objesi
    const updatedTodo = {
      ...todo,
      title,
      description,
      category,
      dueDate: dueDate.toISOString().split("T")[0],
      dueTime,
      reminderTime,
    };

    updateTodo(todo.id, updatedTodo);
    alert("ToDo updated successfully!");
    playCorrectSound()
    router.push({ pathname: `/filter`, params: { from: category } });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ImageBackground
          source={require("../../../../assets/images/bg-add.jpg")}
          resizeMode="cover"
          className="flex-1 pt-10 pb-20"
        >
          <ScrollView
            contentContainerStyle={{ paddingBottom: 10 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="px-4 flex-1">
              <Text className="text-[#d7c8f3] text-2xl font-bold text-center mb-4 mt-4">
                Edit ToDo
              </Text>

              {/* Başlık */}
              <TextInput
                placeholder="Enter Title"
                placeholderTextColor="#6c757d"
                value={title}
                onChangeText={setTitle}
                className="bg-[#d7c8f3] p-3 rounded-md mb-1 text-gray-800"
                maxLength={60}
              />
              <Text className="text-gray-400 text-right text-[12px] mb-2">
                {title.length}/60
              </Text>

              {/* Açıklama */}
              <TextInput
                placeholder="Enter Description"
                placeholderTextColor="#6c757d"
                value={description}
                onChangeText={setDescription}
                className="bg-[#d7c8f3] p-3 rounded-md mb-1 text-gray-800"
                multiline
                maxLength={200}
              />
              <Text className="text-gray-400 text-right text-[12px]">
                {description.length}/200
              </Text>

              {/* Kategori */}
              <View className="flex-col flex-wrap items-center justify-center mb-3">
                <Text className="text-[#d7c8f3] text-md text-left w-full font-bold mb-2">
                  Select a category
                </Text>
                <View className="flex-row flex-wrap items-center justify-start bg-[#d7c8f3] py-2 rounded-lg">
                  {categories.map((item) => (
                    <TouchableOpacity
                      onPress={() => {
                        setCategory(item);
                        Keyboard.dismiss();
                      }}
                      key={item}
                    >
                      <FilterByCategory categoryName={item} selectedCategory={category} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Tarih */}
              <View>
                <Text className="text-[#d7c8f3] text-md text-left w-full font-bold mb-2">
                  Select a due date
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    Keyboard.dismiss();
                    setShowDatePicker(true);
                  }}
                  className="bg-[#d7c8f3] py-3 rounded-md mb-3"
                >
                  <Text className="text-gray-700 text-center">
                    {dueDate.toISOString().split("T")[0]}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={dueDate}
                    mode="date"
                    display="default"
                    style={{
                      backgroundColor: "#d7c8f3",
                      borderRadius: 6,
                      marginBottom: 16,
                    }}
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) setDueDate(selectedDate);
                    }}
                  />
                )}
              </View>

              {/* Zaman */}
              <TimePicker setDueTime={setDueTime} defaultTime={dueTime} />

              {/* Hatırlatma */}
              <Text className="text-[#d7c8f3] text-md text-left w-full font-bold mb-2">
                Select a remind time
              </Text>
              <CustomRemindPicker
                options={reminderOptions}
                selectedValue={reminderTime}
                onValueChange={(itemValue) => setReminderTime(itemValue)}
              />

              {/* ToDo Güncelle */}
              <TouchableOpacity
                onPress={handleUpdateTodo}
                className="bg-red-400 py-4 rounded-md mt-6"
              >
                <Text className="text-white text-center font-bold">Update ToDo</Text>
              </TouchableOpacity>
            </View>
            <StatusBar style="light" backgroundColor="transparent" translucent />
          </ScrollView>
        </ImageBackground>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default EditTodoPage;
