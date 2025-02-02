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
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTodoListContext } from "../../context/todos-context";
import uuid from "react-native-uuid";
import { router } from "expo-router";
import CustomRemindPicker from "../../components/CustomRemindPicker";
import FilterByCategory from "../../components/FilterByCategory";
import TimePicker from "../../components/TimePicker";
import LottieView from "lottie-react-native";
import translations from "../../locales/translations"

const AddTodoPage = () => {
  const { addTodo, t, language } = useTodoListContext();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [dueTime, setDueTime] = useState('12:00');
  const [dueDate, setDueDate] = useState(new Date());
  const [reminderTime, setReminderTime] = useState("2 hours before");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [opacity, setOpacity] = useState(0);

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
  

const handleAddTodo = () => {
  if (!title || !category) {
    alert(t("Alert_in_handle_add_todo"));
    return;
  }
  
  const newTodo = {
    id: uuid.v4(),
    title,
    description,
    category,
    status: "pending",
    createdAt: new Date().toISOString(),
    dueDate: new Date(dueDate).toISOString(),
    dueTime, 
    reminderTime,
    completedAt: "",
  };

  // console.log("Added new todo:", newTodo);
  addTodo(newTodo);

  // State sıfırlama
  setTitle("");
  setDescription("");
  setCategory("");
  setDueDate(new Date());
  setDueTime('12:00');
  setReminderTime("5 minutes before"); // Varsayılan değeri sıfırla

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
                {t("Add_New_ToDo_Page_Title")}
              </Text>

              {/* Başlık */}
              <TextInput
                placeholder={t("Title_input")}
                placeholderTextColor="#6c757d"
                value={title}
                onChangeText={setTitle}
                className="bg-[#d7c8f3] p-3 rounded-md mb-1 text-gray-800"
                // autoFocus
                maxLength={60}
              />
              <Text className="text-gray-400 text-right text-[12px] mb-2">{title.length}/60</Text>

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
              <Text className="text-gray-400 text-right text-[12px]">{description.length}/200</Text>

              <View className="flex-col flex-wrap items-center justify-center mb-3">
                <Text className="text-[#d7c8f3] text-md text-left w-full font-bold mb-2">
                  {t("Select_a_category")}
                </Text>
                <View className="flex-row flex-wrap items-center justify-start bg-[#d7c8f3] py-2 rounded-lg">
                    {
                      categories[language]?.map((item) => (
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
                  {t("Select_a_due_date")}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    Keyboard.dismiss();
                    setShowDatePicker(true);
                  }}
                  className="bg-[#d7c8f3] py-3 rounded-md mb-3"
                >
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
                        // console.log("Selected Local Date:", localDate.toISOString());
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
                  {t("Select_a_remind_time")}
                </Text>
              {/* <CustomRemindPicker
                options={reminderOptions} // Seçenekler
                selectedValue={reminderTime} // Seçilen değer
                onValueChange={(itemValue) => setReminderTime(itemValue)} // Değişiklik işleyicisi
              /> */}
           <CustomRemindPicker
                options={Object.values(translations[language].reminderTime)} // Kullanıcının göreceği çeviri metinleri
                selectedValue={translations[language].reminderTime[Object.keys(translations["en"].reminderTime)
                  .find(key => translations["en"].reminderTime[key] === reminderTime)] || translations[language].reminderTime._5_minutes_before} 
                onValueChange={handleReminderChange}
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
                <Text className="text-white text-center font-bold">{t("Add_ToDo")}</Text>
                 <LottieView
                  style={{ width: 45, height: 45, opacity: opacity}}
                  className="absolute left-0"
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
