import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTodoListContext } from "../../../context/todos-context";
import { router } from "expo-router";
import moment from "moment-timezone";
import FilterByCategory from "../../../components/FilterByCategory";
import CategoryModal from "../../../components/CategoryModal";
import TimePicker from "../../../components/TimePicker";
import LottieView from "lottie-react-native";
import AddTodoTabs from "../../../components/AddTodoTabs";
import uuid from "react-native-uuid";
import CustomRemindPicker from "../../../components/CustomRemindPicker";
import translations from "../../../locales/translations";
import { scheduleNotification } from "../../../utils/notificationUtils";
import { testNotificationLog } from "../../../utils/test";
import { playCorrectSound } from "../../../utils/play-success-sound";

const weekDays = {
  en: [
    { id: 1, label: "Mon" },
    { id: 2, label: "Tue" },
    { id: 3, label: "Wed" },
    { id: 4, label: "Thu" },
    { id: 5, label: "Fri" },
    { id: 6, label: "Sat" },
    { id: 0, label: "Sun" },
  ],
  tr: [
    { id: 1, label: "Pzt" },
    { id: 2, label: "Sal" },
    { id: 3, label: "Çar" },
    { id: 4, label: "Per" },
    { id: 5, label: "Cum" },
    { id: 6, label: "Cmt" },
    { id: 0, label: "Paz" },
  ],
  sv: [
    { id: 1, label: "Mån" },
    { id: 2, label: "Tis" },
    { id: 3, label: "Ons" },
    { id: 4, label: "Tors" },
    { id: 5, label: "Fre" },
    { id: 6, label: "Lör" },
    { id: 0, label: "Sön" },
  ],
  de: [
    { id: 1, label: "Mo" },
    { id: 2, label: "Di" },
    { id: 3, label: "Mi" },
    { id: 4, label: "Do" },
    { id: 5, label: "Fr" },
    { id: 6, label: "Sa" },
    { id: 0, label: "So" },
  ],
};


const AddRecurringTodoPage = () => {
  const { addTodo, t, getCategories, addUserCategory, language, todos } =
    useTodoListContext();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [dueTime, setDueTime] = useState("12:00:00");
  const [repeatEndDate, setRepeatEndDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState("");
  const [reminderTime, setReminderTime] = useState("5 minutes before");
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const doneRefCat = useRef();
  const [opacity, setOpacity] = useState(0);
  const [isLoading, setIsLoading] = useState(false);


  const handleReminderChange = (selectedLabel) => {
    let englishValue = "5 minutes before"; // Default value

    if (
      selectedLabel === translations[language].reminderTime._5_minutes_before
    ) {
      englishValue = "5 minutes before";
    } else if (
      selectedLabel === translations[language].reminderTime._10_minutes_before
    ) {
      englishValue = "10 minutes before";
    } else if (
      selectedLabel === translations[language].reminderTime._30_minutes_before
    ) {
      englishValue = "30 minutes before";
    } else if (
      selectedLabel === translations[language].reminderTime._1_hour_before
    ) {
      englishValue = "1 hour before";
    } else if (
      selectedLabel === translations[language].reminderTime._2_hours_before
    ) {
      englishValue = "2 hours before";
    } else if (
      selectedLabel === translations[language].reminderTime._6_hours_before
    ) {
      englishValue = "6 hours before";
    } else if (
      selectedLabel === translations[language].reminderTime._1_day_before
    ) {
      englishValue = "1 day before";
    } else if (
      selectedLabel === translations[language].reminderTime._1_week_before
    ) {
      englishValue = "1 week before";
    }

    setReminderTime(englishValue);
  };

  const toggleDay = (day) => {
    setSelectedDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day]
    );
  };

  const handleAddRecurringTodo = async () => {
    if (!title || selectedDays.length === 0 || !repeatEndDate || !category) {
      Alert.alert(t("Fill_all_fields"), t("non_optional_field"));
      return;
    }

    setIsLoading(true);

    const groupId = uuid.v4();
    const createdTodos = [];
    const today = moment().startOf("day");
    const endDate = moment(repeatEndDate).endOf("day");
    let current = today.clone();

    while (current.isSameOrBefore(endDate, "day")) {
      const currentDay = current.day();
      if (selectedDays.includes(currentDay)) {
        const baseTodo = {
          id: uuid.v4(),
          title,
          description,
          category,
          status: "pending",
          createdAt: moment().toISOString(),
          dueDate: current.format("YYYY-MM-DD"),
          dueTime,
          reminderTime,
          completedAt: null,
          isRecurring: true,
          repeatGroupId: groupId,
          repeatDays: selectedDays,
        };

        const notificationId = await scheduleNotification(baseTodo, t, language);
        const finalTodo = { ...baseTodo, notificationId };

        createdTodos.push(finalTodo);
      }
      current.add(1, "day");
    }

    for (const todo of createdTodos) {
      await addTodo(todo);
    }

    setIsLoading(false);
    playCorrectSound();
    playSuccess();
    Alert.alert(t("Recurring_todos_added"));
    // router.push("/filter");
    setTimeout(() => {
      router.push({ pathname: `/filter`, params: { from: category } });
    }, 500);
  };
  const doneRefTit = useRef();
  const doneRefDec = useRef();
  const doneRefEndDate = useRef();
  const doneRefDat = useRef();

  const handleCategorySelection = (selectedCategory) => {
    if (selectedCategory === "New Category") {
      setIsCategoryModalVisible(true);
    } else {
      setCategory(selectedCategory);
      Keyboard.dismiss();
      doneRefCat?.current?.play();
    }
  };

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
    <ScrollView className="flex-1 bg-[#0d1b2a]"
    contentContainerStyle={{ padding: 16, paddingBottom: 110 }}
    >
      <AddTodoTabs />

      <View className="relative ">
      <TextInput
        placeholder={t("Title_input")}
        placeholderTextColor="gray"
        value={title}
        onChangeText={setTitle}
        className="bg-gray-700 p-3 rounded-md text-white mt-4"
        maxLength={60}
      />
          {title !== "" && (
                  <LottieView
                    style={{ width: 27, height: 27, opacity: 1 }}
                    className="absolute right-0 top-[20px] z-40"
                    source={require("../../../../assets/data/done2.json")}
                    ref={doneRefTit}
                    loop={false}
                    autoPlay={true}
                    speed={2}
                  />
                )}
              </View>
       <Text className="text-gray-400 text-right text-[12px] mb-2">
                {title.length}/60
              </Text>

              <View>

              <TextInput
                placeholder={t("Description_input")}
                placeholderTextColor="gray"
                value={description}
                onChangeText={setDescription}
                className="bg-gray-700 p-3 rounded-md text-white"
                multiline
                maxLength={200}
              />
              {description !== "" && (
                <LottieView
                  style={{ width: 27, height: 27, opacity: 1 }}
                  className="absolute right-0 top-[5px] z-40"
                  source={require("../../../../assets/data/done2.json")}
                  ref={doneRefDec}
                  loop={false}
                  autoPlay={true}
                  speed={2}
                />
              )}
              </View>
              <Text className="text-gray-400 text-right text-[12px]">
                {description.length}/200
              </Text>

      <Text className="text-white text-md font-bold mb-2">{t("Select_a_category")}</Text>
      <View className="flex-row flex-wrap items-center justify-start bg-gray-700 py-2 rounded-lg">
        {getCategories()?.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => handleCategorySelection(item)}
          >
            <FilterByCategory
              categoryName={item}
              selectedCategory={category}
              bgColor="bg-gray-700"
              textColor="text-gray-400"
            />
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

      <CategoryModal
        isVisible={isCategoryModalVisible}
        onClose={() => setIsCategoryModalVisible(false)}
        onAddCategory={addUserCategory}
        setCategory={setCategory}
        t={t}
      />

      <Text className="text-white text-md font-bold mb-2 mt-4">
        {t("Select_repeat_days")}
      </Text>
      <View className="flex-row flex-wrap">
        {weekDays[language].map((day) => (
          <TouchableOpacity
            key={day.id}
            onPress={() => toggleDay(day.id)}
            className={`px-4 py-2 m-1 rounded-md ${
              selectedDays.includes(day.id) ? "bg-blue-500" : "bg-gray-700"
            }`}
          >
            <Text
              className={`text-gray-400 ${
                selectedDays.includes(day.id) ? "text-white" : ""
              }`}
            >
              {day.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TimePicker
        setDueTime={setDueTime}
        defaultTime={dueTime}
        bgColor="bg-gray-700"
        textColor="text-white"
      />

      <Text className="text-white text-md text-left w-full font-bold mb-2">
        {t("Select_a_remind_time")}
      </Text>
      <CustomRemindPicker
        bgColor="bg-gray-700"
        textColor="text-white"
        options={Object.values(translations[language].reminderTime)}
        selectedValue={
          translations[language].reminderTime[
            Object.keys(translations["en"].reminderTime).find(
              (key) => translations["en"].reminderTime[key] === reminderTime
            )
          ] || translations[language].reminderTime._5_minutes_before
        }
        onValueChange={handleReminderChange}
      />

      <Text className="text-white text-md font-bold mb-2 mt-4">
        {t("Select_repeat_end_date")}
      </Text>
      <View>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          className="bg-gray-700 p-3 rounded-md text-white"
        >
          <Text className="text-white">
            {repeatEndDate
              ? moment(repeatEndDate).format("YYYY-MM-DD")
              : t("Select_a_date")}
          </Text>
        </TouchableOpacity>
        {repeatEndDate !== null && (
                  <LottieView
                    style={{ width: 27, height: 27, opacity: 1 }}
                    className="absolute right-0 top-[5px] z-40"
                    source={require("../../../../assets/data/done2.json")}
                    ref={doneRefEndDate}
                    loop={false}
                    autoPlay={true}
                    speed={2}
                  />
                )}
      </View>
      {showDatePicker && (
        <DateTimePicker
          textColor="white"
          style={{ color: "white" }}
          value={repeatEndDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setRepeatEndDate(selectedDate);
          }}
        />
      )}

      <TouchableOpacity
          onPress={() => {
            handleAddRecurringTodo();
            Keyboard.dismiss();
          }}
        className="bg-red-400 p-4 rounded-md mt-6 h-[52px]"
      >
        {
          isLoading ? (
            <LottieView
            source={require("../../../../assets/data/loadingAddTodo.json")}
            className="absolute left-[42%] top-[-16px]"
            autoPlay
            loop
            speed={1.2}
            style={{ width: 80, height: 80 }}
          />
          ) : (
            <Text className="text-white text-center font-bold">
              {t("Add_Recurring_Todos")}
            </Text>
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
    </ScrollView>
  );
};

export default AddRecurringTodoPage;