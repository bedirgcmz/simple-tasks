import React, { useRef, useState, useEffect } from "react";
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
  AppState,
  Alert
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
import moment from "moment-timezone";
import CategoryModal from "../../components/CategoryModal";

const AddTodoPage = () => {
  const { addTodo, t, language, addUserCategory, getCategories } = useTodoListContext();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [dueTime, setDueTime] = useState('12:00');
  // const [dueDate, setDueDate] = useState(moment().startOf('day').toDate());
  const [dueDate, setDueDate] = useState("");
  const [reminderTime, setReminderTime] = useState("2 hours before");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false); // 📌 Modal görünürlüğü state'i

  // const categories = {
  //   en: [
  //     "School",
  //     "Finance",
  //     "Shopping",
  //     "Family",
  //     "Travel",
  //     "Health",
  //     "Home",
  //     "Friends",
  //     "Work",
  //     "Fun",
  //     "Others",
  //   ],
  //   tr: [
  //     "Okul",
  //     "Finans",
  //     "Alışveriş",
  //     "Aile",
  //     "Seyahat",
  //     "Sağlık",
  //     "Ev",
  //     "Arkadaşlar",
  //     "İş",
  //     "Eğlence",
  //     "Diğerleri",
  //   ],
  //   sv: [
  //     "Skola",
  //     "Ekonomi",
  //     "Shopping",
  //     "Familj",
  //     "Resa",
  //     "Hälsa",
  //     "Hem",
  //     "Vänner",
  //     "Arbete",
  //     "Nöje",
  //     "Övrigt",
  //   ],
  //   de: [
  //     "Schule",
  //     "Finanzen",
  //     "Einkaufen",
  //     "Familie",
  //     "Reisen",
  //     "Gesundheit",
  //     "Zuhause",
  //     "Freunde",
  //     "Arbeit",
  //     "Spaß",
  //     "Sonstiges",
  //   ],
  // };

  // Ugulama arka planda clisirken duedate eskik tarihte kalmasin, her acilista yenilensin diye isleyen useEffect
  
  
  useEffect(() => {
    const updateDate = () => {
      // setDueDate(moment().startOf('day').toDate());
    };
  
    // 📌 İlk açıldığında çalıştır
    updateDate();
  
    // 📌 AppState ile arka plandan döndüğünde güncelle
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        updateDate();
      }
    });
  
    return () => subscription.remove();
  }, []);
 
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
  if (!title || !category || !dueDate) {
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
    dueDate,
    // dueDate: new Date(dueDate).toISOString(),
    dueTime, 
    reminderTime,
    completedAt: "",
  };

  // console.log("Added new todo:", newTodo);
  addTodo(newTodo);

  console.log("Eklenen todo bilgileri", newTodo);
  // State sıfırlama
  setTitle("");
  setDescription("");
  setCategory("");
  setDueDate("");
  // setDueDate(moment().startOf('day').toDate());
  setDueTime('12:00');
  setReminderTime("5 minutes before"); // Varsayılan değeri sıfırla

  setTimeout(() => {
    router.push({ pathname: `/filter`, params: { from: category } });
  }, 1500);
};


const doneRefTit = useRef()
const doneRefDec = useRef()
const doneRefCat = useRef()
const doneRefDat = useRef()

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

  const handleCategorySelection = (selectedCategory) => {
    if (selectedCategory === "New Category") {
      setIsCategoryModalVisible(true); // 📌 Modalı aç
    } else {
      setCategory(selectedCategory);
    }
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
                {t("Add_New_ToDo_Page_Title")}
              </Text>

              {/* Başlık */}
              <View className="relative">
                <TextInput
                  placeholder={t("Title_input")}
                  placeholderTextColor="#6c757d"
                  value={title}
                  onChangeText={setTitle}
                  className="bg-[#d7c8f3] p-3 rounded-md mb-1 text-gray-800 relative"
                  // autoFocus
                  maxLength={60}
                />
                {
                  title !== "" &&
                  <LottieView
                  style={{ width: 27, height: 27, opacity: 1}}
                  className="absolute right-0 top-[5px] z-40"
                  source={require('../../../assets/data/done2.json')}
                  ref={doneRefTit}
                  loop={false}
                  autoPlay={true}
                  speed={2}
                  />
                }

              </View>
              <Text className="text-gray-400 text-right text-[12px] mb-2">{title.length}/60</Text>

              {/* Açıklama */}
              <View>
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
                  source={require('../../../assets/data/done2.json')}
                  ref={doneRefDec}
                  loop={false}
                  autoPlay={true}
                  speed={2}
                  />
                }
              </View>
              <Text className="text-gray-400 text-right text-[12px]">{description.length}/200</Text>

              {/* Kategori */}
              <View className="flex-col flex-wrap items-center justify-center mb-3">
                <Text className="text-[#d7c8f3] text-md text-left w-full font-bold mb-2">
                  {t("Select_a_category")}
                </Text>
                <View className="flex-row flex-wrap items-center justify-start bg-[#d7c8f3] py-2 rounded-lg">
                    {
                      getCategories()?.map((item) => (
                        <TouchableOpacity onPress={() => 
                          {
                          setCategory(item)
                          Keyboard.dismiss()
                          doneRefCat?.current?.play()
                        }
                        } key={item} >
                          <FilterByCategory categoryName={item} selectedCategory={category}/>
                        </TouchableOpacity>
                      ))
                    }
                    <TouchableOpacity
                        onPress={() => {
                          handleCategorySelection("New Category")
                          Keyboard.dismiss()
                          doneRefCat?.current?.play()
                        } 
                      }
                        className="bg-[#5a189a] px-2 py-[3px] mb-1 rounded-md mx-1"
                      >
                        <Text className="text-white">{t("Create_Category")} +</Text>
                    </TouchableOpacity>
                     {
                      category !== "" &&
                      <LottieView
                      style={{ width: 27, height: 27, opacity: 1}}
                      className="absolute right-0 top-[0px] z-40"
                      source={require('../../../assets/data/done2.json')}
                      ref={doneRefCat}
                      loop={false}
                      autoPlay={true}
                      speed={2}
                      />
                    }
                </View>
              </View>
                {/* 📌 CategoryModal Kullanımı */}
                <CategoryModal
                  isVisible={isCategoryModalVisible}
                  onClose={() => setIsCategoryModalVisible(false)}
                  onAddCategory={addUserCategory}
                  setCategory={setCategory}
                  t={t}
                />

              {/* Son Tarih Seçimi */}
              <View>
                <Text className="text-[#d7c8f3] text-md text-left w-full font-bold mb-2">
                  {t("Select_a_due_date")}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    Keyboard.dismiss();
                    setShowDatePicker(true);
                    setDueDate(new Date());
                    // setDueDate(moment().tz(moment.tz.guess()).startOf("day").toDate());
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
                      source={require('../../../assets/data/done2.json')}
                      ref={doneRefDat}
                      loop={false}
                      autoPlay={true}
                      speed={2}
                      />
                    }
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
                        // 📌 Seçilen tarih değerinin saatini sıfırla (gün kaymasını önler)
                        const localDate = moment.tz(selectedDate, moment.tz.guess()).format("YYYY-MM-DD");
                        setDueDate(localDate);
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
