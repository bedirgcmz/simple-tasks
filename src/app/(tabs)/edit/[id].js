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
import moment from "moment-timezone";


const EditTodoPage = () => {
  const { id } = useLocalSearchParams();
  const { todos, updateTodo, t, language } = useTodoListContext();

  // Düzenlenecek ToDo'yu bul
  const todo = todos.find((item) => item.id === id);

  // Form state'lerini başlat
  const [title, setTitle] = useState(todo?.title || "");
  const [description, setDescription] = useState(todo?.description || "");
  const [category, setCategory] = useState(todo?.category || "");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState(todo?.dueTime || "");
  const [reminderTime, setReminderTime] = useState(todo?.reminderTime || "2 hours before");
  const [showDatePicker, setShowDatePicker] = useState(false);

   // todo değiştiğinde state'leri güncelle
   useEffect(() => {
    if (todo) {
      setTitle(todo.title || "");
      setDescription(todo.description || "");
      setCategory(todo.category || "");
      setDueDate(todo.dueDate ? todo.dueDate : new Date());
      setDueTime(todo.dueTime || "");
      setReminderTime(todo.reminderTime || "2 hours before");
    }
  }, [id, todo, todos]);

  const categories = {
    en: [
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
    ],
    tr: [
      "Okul",
      "Finans",
      "Alışveriş",
      "Aile",
      "Seyahat",
      "Sağlık",
      "Ev",
      "Arkadaşlar",
      "İş",
      "Eğlence",
      "Diğerleri",
    ],
    sv: [
      "Skola",
      "Ekonomi",
      "Shopping",
      "Familj",
      "Resa",
      "Hälsa",
      "Hem",
      "Vänner",
      "Arbete",
      "Nöje",
      "Övrigt",
    ],
    de: [
      "Schule",
      "Finanzen",
      "Einkaufen",
      "Familie",
      "Reisen",
      "Gesundheit",
      "Zuhause",
      "Freunde",
      "Arbeit",
      "Spaß",
      "Sonstiges",
    ],
  };

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
      alert(t("Alert_in_handle_add_todo"));
      return;
    }

    // Güncellenmiş ToDo objesi
    const updatedTodo = {
      ...todo,
      title,
      description,
      category,
      dueDate,
      dueTime,
      reminderTime,
    };

    updateTodo(todo.id, updatedTodo);
    playCorrectSound()
    alert(t("Alert_successfully"));
    router.push({ pathname: `/filter`, params: { from: category } });
  };

  useEffect(() => {
    // // ':' ile ayırıcıyı '-' ile değiştiriyoruz
    // const formattedDate = todo.dueDate;
    // const formattedDueDate = moment(dueDate).format("YYYY-MM-DD");

    // Şimdi moment ile Date objesi oluşturabiliriz
    const dateObject = moment(todo.dueDate, "YYYY-MM-DD").toDate();
    setDueDate(dateObject)
  },[id])
  console.log(dueDate);


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
                {t("Edit_ToDo_Page_Title")}
              </Text>

              {/* Başlık */}
              <TextInput
                placeholder={t("Title_input")}
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
                placeholder={t("Description_input")}
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
                {t("Select_a_category")}
                </Text>
                <View className="flex-row flex-wrap items-center justify-start bg-[#d7c8f3] py-2 rounded-lg">
                  {categories[language]?.map((item) => (
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
                {t("Select_a_due_date")}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    Keyboard.dismiss();
                    setShowDatePicker(true);
                    setDueDate(new Date());
                  }}
                  className="bg-[#d7c8f3] py-3 rounded-md mb-3"
                >
                  <Text className="text-gray-700 text-center">
                    {/* {moment(dueDate).format("YYYY:MM:DD")} */}
                    {
                    !dueDate || typeof dueDate === "object" ? (
                      <Text className="text-center">{t("Not_Yet_Selected")}</Text>
                    ) : (
                      <Text className="text-gray-700 text-center">
                        {dueDate}
                      </Text>
                       
                    )
                  }
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={ dueDate}
                    mode="date"
                    display="default"
                    style={{
                      backgroundColor: "#d7c8f3",
                      borderRadius: 6,
                      marginBottom: 16,
                    }}
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        // 📌 Seçilen tarih değerinin saatini sıfırla (gün kaymasını önler)
                        const localDate = moment.tz(selectedDate, moment.tz.guess()).format("YYYY:MM:DD");
                        setDueDate(localDate);
                      };
                    }}
                  />
                )}
              </View>

              {/* Zaman */}
              <TimePicker setDueTime={setDueTime} defaultTime={dueTime} />

              {/* Hatırlatma */}
              <Text className="text-[#d7c8f3] text-md text-left w-full font-bold mb-2">
              {t("Select_a_remind_time")}
              </Text>
              <CustomRemindPicker
                options={reminderOptions}
                selectedValue={reminderTime}
                onValueChange={(itemValue) => setReminderTime(itemValue)}
              />

              <View className="flex-row justify-between">
                {/* ToDo Güncelle */}
                <TouchableOpacity
                  onPress={handleUpdateTodo}
                  className="bg-red-400 py-4 rounded-l-md mt-6 flex-1"
                >
                  <Text className="text-white text-center font-bold">{t("Update")}</Text>
                </TouchableOpacity>
                {/* Go Back */}
                <TouchableOpacity
                  onPress={() => {
                    router.push(`/dynamicid/${todo.id}`)
                    setDueDate(todo.dueDate)
                    
                  }
                  }
                  className="bg-[#0a2472] py-4 rounded-r-md mt-6"
                >
                  <Text className="text-white text-center font-bold px-6">{t("Alert_Cancel")}</Text>
                </TouchableOpacity>
              </View>
                
            </View>
            <StatusBar style="light" backgroundColor="transparent" translucent />
          </ScrollView>
        </ImageBackground>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default EditTodoPage;
