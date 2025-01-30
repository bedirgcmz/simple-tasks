import React, { useRef, useState } from "react";
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
// import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTodoListContext } from "../../context/todos-context";
import uuid from "react-native-uuid";
import { router } from "expo-router";
import CustomRemindPicker from "../../components/CustomRemindPicker";
import FilterByCategory from "../../components/FilterByCategory";
// import ModernDatePicker from "../../components/ModernDatePicker";
import TimePicker from "../../components/TimePicker";
import LottieView from "lottie-react-native";

const AddTodoPage = () => {
  const { addTodo, scheduleNotification, todos } = useTodoListContext();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [dueTime, setDueTime] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [reminderTime, setReminderTime] = useState("2 hours before");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [opacity, setOpacity] = useState(0);
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

  const handleAddTodo = () => {
    if (!title || !category) {
      alert("Title and category fields are required!");
      return;
    }
  
    // Kullanıcının seçtiği tarihi UTC formatına çevir
    const utcDueDate = new Date(
      dueDate.getFullYear(),
      dueDate.getMonth(),
      dueDate.getDate(),
      12, 0, 0 // Saat 00:00 UTC olarak kaydedilir
    ).toISOString();
  
    const newTodo = {
      id: uuid.v4(),
      title,
      description,
      category,
      status: "pending",
      createdAt: new Date().toISOString(), // UTC formatında kaydediyoruz
      dueDate: utcDueDate, // UTC olarak kaydediliyor
      dueTime: dueTime, // Zaman seçimi ayrıca kaydediliyor
      reminderTime, // Kullanıcının seçtiği hatırlatma süresi
      completedAt: "",
    };

    console.log("Added new todo:", newTodo);
  
    addTodo(newTodo);
  
    // State sıfırlama
    setTitle("");
    setDescription("");
    setCategory("");
    setDueDate(new Date());
    setDueTime("");
    setReminderTime("2 hours before");
  
    setTimeout(() => {
      router.push({ pathname: `/filter`, params: { from: category } });
    }, 2000);
  };
  
  const successRef = useRef()

  const playSuccess = () => {
    if (title && category) {
      setOpacity(1); // Görünür yap
      successRef?.current?.reset();
      successRef?.current?.play();
  
      setTimeout(() => {
        setOpacity(0); // Opaklık sıfırlanır, gizlenir
      }, 1500); // Animasyonun süresine göre ayarla
    }
  }

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
                  Select a due date
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    Keyboard.dismiss();
                    setShowDatePicker(true);
                  }}
                  className="bg-[#d7c8f3] py-3 rounded-md mb-3"
                >
                  {/* <Text className="text-gray-700 text-center">
                    {dueDate.toISOString().split("T")[0]}
                  </Text> */}
                  <Text className="text-gray-700 text-center">
                    {dueDate.toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
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
                      if (selectedDate) {
                        // Tarihi kaydetmeden önce cihazın zaman dilimine uygun hale getiriyoruz
                        const localDate = new Date(selectedDate);
                        setDueDate(localDate);
                        console.log("Selected Local Date:", localDate.toISOString());
                      }
                    }}
                  />
                )}
              </View>
              {/* Zaman Seçimi */}
              <View className=" ">
              
              <TimePicker  setDueTime={setDueTime} defaultTime={false}/>

              </View>

              {/* Hatırlatma Seçimi */}
              <Text className="text-[#d7c8f3] text-md text-left w-full font-bold mb-2">
                  Select a remind time!
                </Text>
              <CustomRemindPicker
                options={reminderOptions} // Seçenekler
                selectedValue={reminderTime} // Seçilen değer
                onValueChange={(itemValue) => setReminderTime(itemValue)} // Değişiklik işleyicisi
              />

              {/* ToDo Ekle */}
              <TouchableOpacity
                onPress={ () => {
                  playSuccess()
                  handleAddTodo()
                  Keyboard.dismiss() }
                  }
                className="bg-red-400 py-4 rounded-md mt-6 flex-row items-center justify-center"
              >
                <Text className="text-white text-center font-bold">Add ToDo</Text>
                 <LottieView
                  style={{ width: 45, height: 45, opacity: opacity}}
                  className="absolute right-0"
                  source={require('../../../assets/data/success.json')}
                  ref={successRef}
                  loop={false}
                  autoPlay={false}
                  speed={1}
                  />
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
