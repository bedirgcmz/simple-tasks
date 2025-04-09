import React, { useState, useEffect, useRef } from "react";
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
import translations from "../../../locales/translations"
import LottieView from "lottie-react-native";
import { testNotificationLog } from "../../../utils/test";



const EditTodoPage = () => {
  const { id } = useLocalSearchParams();
  const { todos, updateTodo, t, language, getCategories, updateTodoFully } = useTodoListContext();

  // Düzenlenecek ToDo'yu bul
  const todo = todos.find((item) => item.id === id);

  // Form state'lerini başlat
  const [title, setTitle] = useState(todo?.title || "");
  const [description, setDescription] = useState(todo?.description || "");
  const [category, setCategory] = useState(todo?.category || "");
  const [dueDate, setDueDate] = useState(todo?.dueDate);
  const [dueTime, setDueTime] = useState(todo?.dueTime || "");
  const [reminderTime, setReminderTime] = useState(todo?.reminderTime || "2 hours before");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [opacity, setOpacity] = useState(0);

  const handleReminderChange = (selectedLabel) => {
    let englishValue = "5 minutes before"; // Varsayılan değer
  
    if (selectedLabel === translations[language].reminderTime._5_minutes_before) {
      englishValue = "5 minutes before";
    } else if (selectedLabel === translations[language].reminderTime._10_minutes_before) {
      englishValue = "10 minutes before";
    } else if (selectedLabel === translations[language].reminderTime._30_minutes_before) {
      englishValue = "30 minutes before";
    } else if (selectedLabel === translations[language].reminderTime._1_hour_before) {
      englishValue = "1 hour before";
    } else if (selectedLabel === translations[language].reminderTime._2_hours_before) {
      englishValue = "2 hours before";
    } else if (selectedLabel === translations[language].reminderTime._6_hours_before) {
      englishValue = "6 hours before";
    } else if (selectedLabel === translations[language].reminderTime._1_day_before) {
      englishValue = "1 day before";
    } else if (selectedLabel === translations[language].reminderTime._1_week_before) {
      englishValue = "1 week before";
    }
  
    setReminderTime(englishValue);
  };
  

   // todo değiştiğinde state'leri güncelle
   useEffect(() => {
    if (todo) {
      setTitle(todo.title || "");
      setDescription(todo.description || "");
      setCategory(todo.category || "");
      setDueDate(todo.dueDate || "");
      setDueTime(todo.dueTime || "");
      setReminderTime(todo.reminderTime || "2 hours before");
    }
  }, [id, todo, todos]);


  const handleUpdateTodo = async () => {
    if (!title || !category || !dueDate) {
      alert(t("Alert_in_handle_add_todo"));
      return;
    }
  
    setIsLoading(true)
    const updatedFields = {
      title,
      description,
      category,
      dueDate,
      dueTime,
      reminderTime,
    };
  
    await updateTodoFully(todo.id, updatedFields); // ✅ Yeni fonksiyon
    setIsLoading(false)
    playCorrectSound();
    playSuccess()
    alert(t("Alert_successfully"));
    // setTimeout(() => testNotificationLog(todos), 500);
    router.push({ pathname: `/filter`, params: { from: category } });
  };
  

  const doneRefTit = useRef()
  const doneRefDec = useRef()
  const doneRefCat = useRef()
  const doneRefDat = useRef()
  const successRef = useRef();
  const playSuccess = () => {
      setOpacity(1); // Görünür yap
      successRef?.current?.reset();
      successRef?.current?.play();

      setTimeout(() => {
        setOpacity(0); // Opaklık sıfırlanır, gizlenir
      }, 1500); // Animasyonun süresine göre ayarla
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
                {t("Edit_ToDo_Page_Title")}
              </Text>

              {/* Başlık */}
              <View className="relative">
                <TextInput
                  placeholder={t("Title_input")}
                  placeholderTextColor="#6c757d"
                  value={title}
                  onChangeText={setTitle}
                  className="bg-[#d7c8f3] p-3 rounded-md mb-1 text-gray-800"
                  maxLength={60}
                />
                {
                  title !== "" &&
                  <LottieView
                  style={{ width: 27, height: 27, opacity: 1}}
                  className="absolute right-0 top-[5px] z-40"
                  source={require('../../../../assets/data/done2.json')}
                  ref={doneRefTit}
                  loop={false}
                  autoPlay={true}
                  speed={2}
                  />
                }
              </View>
              <Text className="text-gray-400 text-right text-[12px] mb-2">
                {title.length}/60
              </Text>

              {/* Açıklama */}
              <View className="relative">
                <TextInput
                  placeholder={t("Description_input")}
                  placeholderTextColor="#6c757d"
                  value={description}
                  onChangeText={setDescription}
                  className="bg-[#d7c8f3] p-3 rounded-md mb-1 text-gray-800"
                  multiline
                  maxLength={200}
                />
                {
                  description !== "" &&
                  <LottieView
                  style={{ width: 27, height: 27, opacity: 1}}
                  className="absolute right-0 top-[5px] z-40"
                  source={require('../../../../assets/data/done2.json')}
                  ref={doneRefDec}
                  loop={false}
                  autoPlay={true}
                  speed={2}
                  />
                }
              </View>
              <Text className="text-gray-400 text-right text-[12px]">
                {description.length}/200
              </Text>

              {/* Kategori */}
              <View className="flex-col flex-wrap items-center justify-center mb-3">
                <Text className="text-[#d7c8f3] text-md text-left w-full font-bold mb-2">
                {t("Select_a_category")}
                </Text>
                <View className="flex-row flex-wrap items-center justify-start bg-[#d7c8f3] py-2 rounded-lg">
                  {getCategories()?.map((item) => (
                    <TouchableOpacity
                      onPress={() => {
                        setCategory(item);
                        Keyboard.dismiss();
                      }}
                      key={item}
                    >
                      <FilterByCategory categoryName={item} selectedCategory={category} bgColor="" textColor="" />
                    </TouchableOpacity>
                  ))}
                   {
                      category !== "" &&
                      <LottieView
                      style={{ width: 27, height: 27, opacity: 1}}
                      className="absolute right-0 top-[0px] z-40"
                      source={require('../../../../assets/data/done2.json')}
                      ref={doneRefCat}
                      loop={false}
                      autoPlay={true}
                      speed={2}
                      />
                    }
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
                    {
                    !dueDate || typeof dueDate === "object" ? (
                      <Text className="text-center">{t("Not_Yet_Selected")}</Text>
                    ) : (
                      <Text className="text-gray-700 text-center">
                        {dueDate}
                      </Text>
                    )
                  }
                  {
                      dueDate !== "" &&
                      <LottieView
                      style={{ width: 27, height: 27, opacity: 1}}
                      className="absolute right-0 top-[5px] z-40"
                      source={require('../../../../assets/data/done2.json')}
                      ref={doneRefDat}
                      loop={false}
                      autoPlay={true}
                      speed={2}
                      />
                    }
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
                        const localDate = moment.tz(selectedDate, moment.tz.guess()).format("YYYY-MM-DD");
                        setDueDate(localDate);
                      };
                    }}
                  />
                )}
              </View>

              {/* Zaman */}
              <TimePicker setDueTime={setDueTime} defaultTime={dueTime} bgColor="" textColor=""/>

              {/* Hatırlatma */}
              <Text className="text-[#d7c8f3] text-md text-left w-full font-bold mb-2">
              {t("Select_a_remind_time")}
              </Text>
              <CustomRemindPicker
                bgColor="bg-[#d7c8f3]"
                textColor="text-gray-700"
                options={Object.values(translations[language].reminderTime)} // Kullanıcının göreceği çeviri metinleri
                selectedValue={translations[language].reminderTime[Object.keys(translations["en"].reminderTime)
                  .find(key => translations["en"].reminderTime[key] === reminderTime)] || translations[language].reminderTime._5_minutes_before} 
                onValueChange={handleReminderChange}
              />

              <View className="flex-row justify-between">
                {/* ToDo Güncelle */}
                <TouchableOpacity
                  onPress={handleUpdateTodo}
                  className="bg-red-400 py-4 rounded-l-md mt-6 flex-1 h-[52px]"
                >
              {
                isLoading ? (
                  <LottieView
                  source={require("../../../../assets/data/loadingAddTodo.json")}
                  className="absolute left-[40%] top-[-16px]"
                  autoPlay
                  loop
                  speed={1.2}
                  style={{ width: 80, height: 80 }}
                />
                ) : (
                  <Text className="text-white text-center font-bold">{t("Update")}</Text>
                )
              }
                <LottieView
                  style={{ width: 45, height: 45, opacity: opacity }}
                  className="absolute left-0"
                  source={require("../../../../assets/data/success.json")}
                  ref={successRef}
                  loop={false}
                  autoPlay={false}
                  speed={1.5}
                />
                </TouchableOpacity>
                {/* Go Back */}
                <TouchableOpacity
                disabled={isLoading}
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
