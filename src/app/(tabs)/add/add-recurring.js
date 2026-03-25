import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  StatusBar,
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
import { playCorrectSound } from "../../../utils/play-success-sound";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";

// ── Shared styles ──────────────────────────────────────────
const glassField = {
  backgroundColor: 'rgba(255,255,255,0.08)',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.15)',
  borderRadius: 14,
};

const SectionLabel = ({ icon, label }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
    <Ionicons name={icon} size={13} color="#60a5fa" />
    <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase' }}>
      {label}
    </Text>
  </View>
);

// ── Weekday data ───────────────────────────────────────────
const weekDays = {
  en: [
    { id: 1, label: "Mon" }, { id: 2, label: "Tue" }, { id: 3, label: "Wed" },
    { id: 4, label: "Thu" }, { id: 5, label: "Fri" }, { id: 6, label: "Sat" }, { id: 0, label: "Sun" },
  ],
  tr: [
    { id: 1, label: "Pzt" }, { id: 2, label: "Sal" }, { id: 3, label: "Çar" },
    { id: 4, label: "Per" }, { id: 5, label: "Cum" }, { id: 6, label: "Cmt" }, { id: 0, label: "Paz" },
  ],
  sv: [
    { id: 1, label: "Mån" }, { id: 2, label: "Tis" }, { id: 3, label: "Ons" },
    { id: 4, label: "Tors" }, { id: 5, label: "Fre" }, { id: 6, label: "Lör" }, { id: 0, label: "Sön" },
  ],
  de: [
    { id: 1, label: "Mo" }, { id: 2, label: "Di" }, { id: 3, label: "Mi" },
    { id: 4, label: "Do" }, { id: 5, label: "Fr" }, { id: 6, label: "Sa" }, { id: 0, label: "So" },
  ],
};

const AddRecurringTodoPage = () => {
  const { addTodo, t, getCategories, addUserCategory, language } = useTodoListContext();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [dueTime, setDueTime] = useState("12:00:00");
  const [repeatEndDate, setRepeatEndDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState("");
  const [reminderTime, setReminderTime] = useState("5 minutes before");
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const doneRefTit = useRef();
  const doneRefDec = useRef();
  const doneRefCat = useRef();
  const doneRefEndDate = useRef();
  const successRef = useRef();

  // ── Logic (unchanged) ──────────────────────────────────
  const handleReminderChange = (selectedLabel) => {
    let englishValue = "5 minutes before";
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

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
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
          title, description, category,
          status: "pending",
          createdAt: moment().toISOString(),
          dueDate: current.format("YYYY-MM-DD"),
          dueTime, reminderTime,
          completedAt: null,
          isRecurring: true,
          repeatGroupId: groupId,
          repeatDays: selectedDays,
        };
        const notificationId = await scheduleNotification(baseTodo, t, language);
        createdTodos.push({ ...baseTodo, notificationId });
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
    setTimeout(() => {
      router.push({ pathname: `/filter`, params: { from: category } });
    }, 500);
  };

  const handleCategorySelection = (selectedCategory) => {
    if (selectedCategory === "New Category") {
      setIsCategoryModalVisible(true);
    } else {
      setCategory(selectedCategory);
      Keyboard.dismiss();
      doneRefCat?.current?.play();
    }
  };

  const playSuccess = () => {
    setOpacity(1);
    successRef?.current?.reset();
    successRef?.current?.play();
    setTimeout(() => setOpacity(0), 1500);
  };

  // ── Render ─────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient
          colors={["#07051a", "#130b30", "#0b1a45"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.4, y: 1 }}
          style={{ flex: 1, paddingTop: 40, paddingBottom: 80 }}
        >
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
            keyboardShouldPersistTaps="handled"
          >
            <AddTodoTabs />

            {/* ── TITLE ─────────────────────────────── */}
            <View style={{ marginTop: 20 }}>
              <SectionLabel icon="pencil-outline" label={t("Title_input")} />
              <View style={{ ...glassField, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, marginBottom: 4 }}>
                <Ionicons name="pencil-outline" size={15} color="rgba(255,255,255,0.35)" />
                <TextInput
                  placeholder={t("Title_input")}
                  placeholderTextColor="rgba(255,255,255,0.30)"
                  value={title}
                  onChangeText={setTitle}
                  maxLength={60}
                  style={{ flex: 1, color: 'white', paddingVertical: 13, paddingLeft: 8, fontSize: 15 }}
                />
                {title !== "" && (
                  <LottieView
                    style={{ width: 24, height: 24 }}
                    source={require("../../../../assets/data/done2.json")}
                    ref={doneRefTit}
                    loop={false} autoPlay speed={2}
                  />
                )}
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.28)', fontSize: 11, textAlign: 'right', marginBottom: 12 }}>
                {title.length}/60
              </Text>
            </View>

            {/* ── DESCRIPTION ───────────────────────── */}
            <View style={{ marginBottom: 4 }}>
              <SectionLabel icon="document-text-outline" label={t("Description_input")} />
              <View style={{ ...glassField, paddingHorizontal: 12, paddingTop: 4 }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                  <Ionicons name="document-text-outline" size={15} color="rgba(255,255,255,0.35)" style={{ marginTop: 13 }} />
                  <TextInput
                    placeholder={t("Description_input")}
                    placeholderTextColor="rgba(255,255,255,0.30)"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    maxLength={200}
                    style={{ flex: 1, color: 'white', paddingVertical: 13, fontSize: 14, minHeight: 60 }}
                  />
                  {description !== "" && (
                    <LottieView
                      style={{ width: 24, height: 24, marginTop: 10 }}
                      source={require("../../../../assets/data/done2.json")}
                      ref={doneRefDec}
                      loop={false} autoPlay speed={2}
                    />
                  )}
                </View>
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.28)', fontSize: 11, textAlign: 'right', marginTop: 4, marginBottom: 16 }}>
                {description.length}/200
              </Text>
            </View>

            {/* ── CATEGORY ──────────────────────────── */}
            <View style={{ marginBottom: 16 }}>
              <SectionLabel icon="folder-outline" label={t("Select_a_category")} />
              <View style={{ ...glassField, padding: 12, flexDirection: 'row', flexWrap: 'wrap', position: 'relative' }}>
                {getCategories()?.map((item) => (
                  <TouchableOpacity key={item} onPress={() => handleCategorySelection(item)}>
                    <FilterByCategory categoryName={item} selectedCategory={category} />
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  onPress={() => handleCategorySelection("New Category")}
                  style={{
                    backgroundColor: 'rgba(167,139,250,0.20)',
                    borderWidth: 1,
                    borderColor: 'rgba(167,139,250,0.40)',
                    borderRadius: 20,
                    paddingHorizontal: 12,
                    paddingVertical: 5,
                    marginBottom: 6,
                    marginRight: 6,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Ionicons name="add" size={14} color="#c4b5fd" />
                  <Text style={{ color: '#c4b5fd', fontSize: 13, fontWeight: '600' }}>
                    {t("Create_Category")}
                  </Text>
                </TouchableOpacity>
                {category !== "" && (
                  <LottieView
                    style={{ width: 24, height: 24, position: 'absolute', right: 4, top: 4 }}
                    source={require("../../../../assets/data/done2.json")}
                    ref={doneRefCat}
                    loop={false} autoPlay speed={2}
                  />
                )}
              </View>
            </View>

            <CategoryModal
              isVisible={isCategoryModalVisible}
              onClose={() => setIsCategoryModalVisible(false)}
              onAddCategory={addUserCategory}
              setCategory={setCategory}
              t={t}
            />

            {/* ── REPEAT DAYS ───────────────────────── */}
            <View style={{ marginBottom: 16 }}>
              <SectionLabel icon="repeat-outline" label={t("Select_repeat_days")} />
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {weekDays[language]?.map((day) => {
                  const isSelected = selectedDays.includes(day.id);
                  return (
                    <TouchableOpacity
                      key={day.id}
                      onPress={() => toggleDay(day.id)}
                      style={{
                        paddingHorizontal: 14,
                        paddingVertical: 8,
                        borderRadius: 12,
                        backgroundColor: isSelected ? 'rgba(96,165,250,0.25)' : 'rgba(255,255,255,0.08)',
                        borderWidth: 1,
                        borderColor: isSelected ? 'rgba(96,165,250,0.55)' : 'rgba(255,255,255,0.14)',
                      }}
                    >
                      <Text style={{
                        color: isSelected ? '#93c5fd' : 'rgba(255,255,255,0.55)',
                        fontWeight: isSelected ? '700' : '500',
                        fontSize: 13,
                      }}>
                        {day.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* ── TIME PICKER ───────────────────────── */}
            <TimePicker setDueTime={setDueTime} defaultTime={dueTime} />

            {/* ── REMINDER ──────────────────────────── */}
            <View style={{ marginBottom: 16 }}>
              <SectionLabel icon="notifications-outline" label={t("Select_a_remind_time")} />
              <CustomRemindPicker
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
            </View>

            {/* ── REPEAT END DATE ───────────────────── */}
            <View style={{ marginBottom: 28 }}>
              <SectionLabel icon="calendar-outline" label={t("Select_repeat_end_date")} />
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={{
                  ...glassField,
                  borderColor: repeatEndDate ? 'rgba(96,165,250,0.35)' : 'rgba(255,255,255,0.15)',
                  paddingHorizontal: 14,
                  paddingVertical: 13,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color={repeatEndDate ? '#60a5fa' : 'rgba(255,255,255,0.35)'}
                />
                <Text style={{
                  flex: 1,
                  color: repeatEndDate ? 'white' : 'rgba(255,255,255,0.35)',
                  fontWeight: repeatEndDate ? '600' : '400',
                  fontSize: 15,
                }}>
                  {repeatEndDate ? moment(repeatEndDate).format("YYYY-MM-DD") : t("Select_a_date")}
                </Text>
                {repeatEndDate !== null && (
                  <LottieView
                    style={{ width: 24, height: 24 }}
                    source={require("../../../../assets/data/done2.json")}
                    ref={doneRefEndDate}
                    loop={false} autoPlay speed={2}
                  />
                )}
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={repeatEndDate || new Date()}
                  mode="date"
                  display="default"
                  style={{ backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 14, marginTop: 8 }}
                  onChange={(_event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) setRepeatEndDate(selectedDate);
                  }}
                />
              )}
            </View>

            {/* ── ADD BUTTON ────────────────────────── */}
            <LinearGradient
              colors={['#fb923c', '#ea580c']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ borderRadius: 16, overflow: 'hidden' }}
            >
              <TouchableOpacity
                onPress={() => { handleAddRecurringTodo(); Keyboard.dismiss(); }}
                style={{ height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
              >
                {isLoading ? (
                  <LottieView
                    source={require("../../../../assets/data/loadingAddTodo.json")}
                    autoPlay loop speed={1.2}
                    style={{ width: 80, height: 80, position: 'absolute' }}
                  />
                ) : (
                  <Text style={{ color: 'white', fontWeight: '700', fontSize: 16, letterSpacing: 0.3 }}>
                    {t("Add_Recurring_Todos")}
                  </Text>
                )}
                <LottieView
                  style={{ width: 45, height: 45, opacity, position: 'absolute', left: 0 }}
                  source={require("../../../../assets/data/success.json")}
                  ref={successRef}
                  loop={false} autoPlay={false} speed={1.5}
                />
              </TouchableOpacity>
            </LinearGradient>

          </ScrollView>
          <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default AddRecurringTodoPage;
