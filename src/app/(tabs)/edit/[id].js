import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, router } from "expo-router";
import { useTodoListContext } from "../../../context/todos-context";
import { showSaveChangesAlert } from '../../../utils/alerts';

const EditTodoPage = () => {
  const { id } = useLocalSearchParams();
  const { todos, updateTodo } = useTodoListContext();
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Düzenlenecek ToDo'yu bulma
  const todo = todos.find((todo) => todo.id === id);

  // Form state'leri
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState(new Date());

  const categories = ["Family", "Fun", "School", "Work", "Shopping", "Friends", "Others"];

  const handleUpdateTodo = () => {
    if (!title || !category) {
      alert("Başlık ve kategori alanları zorunludur!");
      return;
    }

    // Güncellenmiş ToDo objesi
    const updatedTodo = {
      ...todo,
      title,
      description,
      category,
      dueDate: dueDate.toISOString().split("T")[0],
    };

    updateTodo(todo.id, updatedTodo); // Context üzerinden güncelle
    router.push(`/dynamicid/${todo.id}`); // Listeye geri dön
  };

  useEffect(() => {
    if (!todo) {
      setTitle("");
      setDescription("");
      setCategory("");
      setDueDate(new Date());
    } else {
      setTitle(todo.title);
      setDescription(todo.description);
      setCategory(todo.category);
      setDueDate(new Date(todo.dueDate));
    }
  }, [todo]);
  

  return (
    <ImageBackground
      source={require("../../../../assets/images/bg-add.jpg")}
      resizeMode="cover"
      className="flex-1 pt-10 pb-20"
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
          className="bg-[#d7c8f3] p-3 rounded-md mb-4 text-gray-800"
        />

        {/* Açıklama */}
        <TextInput
          placeholder="Enter Description"
          placeholderTextColor="#6c757d"
          value={description}
          onChangeText={setDescription}
          className="bg-[#d7c8f3] p-3 rounded-md mb-4 text-gray-800"
          multiline
        />

        {/* Kategori Seçimi */}
        <View className="bg-[#d7c8f3] rounded-md mb-4 text-white">
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
          >
            <Picker.Item label="Select Category" value="" />
            {categories.map((cat) => (
              <Picker.Item key={cat} label={cat} value={cat} />
            ))}
          </Picker>
        </View>

   {/* Son Tarih Seçimi */}
   <Text className="text-[#d7c8f3] text-md text-center font-bold mb-2">
          Select Due Date
        </Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
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
            style={{ backgroundColor: "#d7c8f3",  borderRadius: 6, marginBottom:16}}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDueDate(selectedDate);
            }}
          />
        )}



        {/* Kaydet Butonu */}
        <TouchableOpacity
          onPress={()=> showSaveChangesAlert("You want to UPDATE this ToDo!", "Are you sure?",handleUpdateTodo) }
          className="bg-green-500 py-4 rounded-md mt-6"
        >
          <Text className="text-white text-center font-bold">Save Changes</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="light" backgroundColor="transparent" translucent />
    </ImageBackground>
  );
};

export default EditTodoPage;
