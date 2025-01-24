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
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTodoListContext } from "../../context/todos-context";
import uuid from "react-native-uuid";
import { router } from "expo-router";
import CustomRemindPicker from "../../components/CustomRemindPicker";
import CustomCategoryPicker from "../../components/CustomCategoryPicker";
import FilterByCategory from "../../components/FilterByCategory";

const AddTodoPage = () => {
  const { addTodo, scheduleNotification, todos } = useTodoListContext();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [reminderTime, setReminderTime] = useState("2 hours before");
  const [showDatePicker, setShowDatePicker] = useState(false);

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
    "1 hour before",
    "2 hours before",
    "1 day before",
    "1 week before",
  ];

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
      reminderTime, // Kullanıcı tarafından seçilen hatırlatma zamanı
      completedAt: "",
    };

    addTodo(newTodo);

    // Bildirim zamanlama
    scheduleNotification(newTodo);

    // State sıfırlama
    setTitle("");
    setDescription("");
    setCategory("");
    setDueDate(new Date());
    setReminderTime("2 hours before");

    router.push({ pathname: `/filter`, params: { from: category } });
  };

  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
  >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ImageBackground
            source={require("../../../assets/images/bg-add.jpg")}
            resizeMode="cover"
            className="flex-1 pt-10 pb-20"
            >
            <ScrollView
            contentContainerStyle={{ paddingBottom: 10 }}
            keyboardShouldPersistTaps="handled"
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
              <Text className="text-gray-400 text-right text-[12px] mb-2">{title.length}/60</Text>

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
              <Text className="text-gray-400 text-right text-[12px]">{description.length}/200</Text>

              {/* Kategori Seçimi */}
              {/* <View className="bg-[#d7c8f3] rounded-md mb-4 text-white">
                <Picker
                  selectedValue={category}
                  onValueChange={(itemValue) => setCategory(itemValue)}
                >
                  <Picker.Item label="Select Category" value="" />
                  {categories.map((cat) => (
                    <Picker.Item key={cat} label={cat} value={cat} />
                  ))}
                </Picker>
                <CustomCategoryPicker
                    options={categories}
                    selectedValue={category}
                    onValueChange={(value) => setCategory(value)}
                  />
              </View> */}

              <View className="flex-col flex-wrap items-center justify-center mb-3">
                <Text className="text-[#d7c8f3] text-md text-left w-full font-bold mb-2">
                  Select a category
                </Text>
                <View className="flex-row flex-wrap items-center justify-start bg-[#d7c8f3] py-2 rounded-lg">
                    {
                      categories.map((item) => (
                        <TouchableOpacity onPress={() => 
                          {
                          setCategory(item)
                          Keyboard.dismiss()
                        }
                        } key={item} >
                          <FilterByCategory categoryName={item} selectedCategory={category}/>
                        </TouchableOpacity>
                      ))
                    }
                </View>

              </View>

              {/* Son Tarih Seçimi */}
              <View>
                <Text className="text-[#d7c8f3] text-md text-left w-full font-bold mb-2">
                  Select Due Date
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
                    style={{ backgroundColor: "#d7c8f3", borderRadius: 6, marginBottom: 16 }}
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) setDueDate(selectedDate);
                    }}
                  />
                )}
              </View>

              {/* Hatırlatma Seçimi */}
              {/* <View className="bg-[#d7c8f3] rounded-md mb-4 w-[200px] h-[120px]">
                <Picker
                  selectedValue={reminderTime}
                  onValueChange={(itemValue) => setReminderTime(itemValue)}
                >
                  {reminderOptions.map((option) => (
                    <Picker.Item key={option} label={option} value={option} />
                  ))}
                </Picker>
              </View> */}

              {/* Hatırlatma Seçimi */}
              <Text className="text-[#d7c8f3] text-md text-left w-full font-bold mb-2">
                  Select remind time!
                </Text>
              <CustomRemindPicker
                options={reminderOptions} // Seçenekler
                selectedValue={reminderTime} // Seçilen değer
                onValueChange={(itemValue) => setReminderTime(itemValue)} // Değişiklik işleyicisi
              />

              {/* ToDo Ekle */}
              <TouchableOpacity
                onPress={handleAddTodo}
                className="bg-red-400 py-4 rounded-md mt-6"
              >
                <Text className="text-white text-center font-bold">Add ToDo</Text>
              </TouchableOpacity>
            </View>
            <StatusBar style="light" backgroundColor="transparent" translucent />
      </ScrollView>
          </ImageBackground>
        </TouchableWithoutFeedback>

  </KeyboardAvoidingView>
  );
};

export default AddTodoPage;
