import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTodoListContext } from "../../context/todos-context";
import uuid from "react-native-uuid";
import { router } from "expo-router";

const AddTodoPage = () => {
  const { addTodo } = useTodoListContext();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const categories = ["Family", "Fun", "School", "Work", "Shopping", "Friends", "Others"];

  const handleAddTodo = () => {
    if (!title || !category) {
      alert("Title and category fields are required!");
      return;
    }

    const newTodo = {
      id: uuid.v4(),
      title,
      description,
      category,
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
      dueDate: dueDate.toISOString().split("T")[0],
      completedAt: "",
    };

    addTodo(newTodo);
    router.push({ pathname: `/filter`, params: { from: category } })
    setTitle("");
    setDescription("");
    setCategory("");
    setDueDate(new Date());
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require("../../../assets/images/bg-add.jpg")}
        resizeMode="cover"
        className="flex-1 pt-10 pb-20"
      >
        <View className="px-4 flex-1">
          <Text className="text-[#d7c8f3] text-2xl font-bold text-center mb-4 mt-4">
            Add New ToDo
          </Text>

          {/* Başlık */}
          <TextInput
            placeholder="Enter Title"
            placeholderTextColor="#6c757d"
            value={title}
            onChangeText={setTitle}
            className="bg-[#d7c8f3] p-3 rounded-md mb-1 text-gray-800"
            autoFocus
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
          <Text className="text-gray-400 text-right text-[12px] mb-2">
            {description.length}/200
          </Text>

          {/* Kategori Seçimi */}
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="bg-[#d7c8f3] rounded-md mb-4 text-white">
                  <Picker
                    selectedValue={category}
                    onValueChange={(itemValue) => setCategory(itemValue)}
                  >
                    <Picker.Item label="Select Category" value=""  />
                    {categories.map((cat) => (
                      <Picker.Item key={cat} label={cat} value={cat} className="text-white" style={{ color: "black" }} />
                    ))}
                  </Picker>
                </View>
          </TouchableWithoutFeedback>

          {/* Son Tarih Seçimi */}
            <View>
              <Text className="text-[#d7c8f3] text-md text-center font-bold mb-2">
                Select Due Date
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss(); // Klavyeyi kapatır
                  setShowDatePicker(true); // DatePicker'ı açar
                }}
                className="bg-[#d7c8f3] py-3 rounded-md mb-4"
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
                  style={{ backgroundColor: "#d7c8f3", borderRadius: 6, marginBottom: 16 }}
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) setDueDate(selectedDate);
                  }}
                />
              )}

            </View>

          {/* ToDo Ekle */}
          <TouchableOpacity
            onPress={handleAddTodo}
            className="bg-red-400 py-4 rounded-md mt-6"
          >
            <Text className="text-white text-center font-bold">Add ToDo</Text>
          </TouchableOpacity>
        </View>
        <StatusBar style="light" backgroundColor="transparent" translucent />
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

export default AddTodoPage;

