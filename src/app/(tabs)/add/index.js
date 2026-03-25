import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  AppState,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTodoListContext } from "../../../context/todos-context";
import uuid from "react-native-uuid";
import { router } from "expo-router";
import CustomRemindPicker from "../../../components/CustomRemindPicker";
import FilterByCategory from "../../../components/FilterByCategory";
import TimePicker from "../../../components/TimePicker";
import LottieView from "lottie-react-native";
import translations from "../../../locales/translations";
import moment from "moment-timezone";
import CategoryModal from "../../../components/CategoryModal";
import AddTodoTabs from "../../../components/AddTodoTabs";
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

const AddTodoPage = () => {
  const { addTodo, t, language, addUserCategory, getCategories } =
    useTodoListContext();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [dueTime, setDueTime] = useState("12:00");
  const [dueDate, setDueDate] = useState("");
  const [reminderTime, setReminderTime] = useState("2 hours before");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {}
    });
    return () => subscription.remove();
  }, []);

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

  const handleAddTodo = async () => {
    if (!title || !category || !dueDate) {
      alert(t("Alert_in_handle_add_todo"));
      return;
    }
    setIsLoading(true);
    const newTodo = {
      id: uuid.v4(),
      title,
      description,
      category,
      status: "pending",
      createdAt: new Date().toISOString(),
      dueDate,
      dueTime,
      reminderTime,
      completedAt: null,
      isRecurring: false,
      repeatGroupId: null,
      repeatDays: null,
    };
    const notificationId = await scheduleNotification(newTodo, t, language);
    const finalTodo = { ...newTodo, notificationId };
    addTodo(finalTodo);
    setTitle("");
    setDescription("");
    setCategory("");
    setDueDate("");
    setDueTime("12:00");
    setReminderTime("5 minutes before");
    setIsLoading(false);
    playCorrectSound();
    playSuccess();
    setTimeout(() => {
      router.push({ pathname: `/filter`, params: { from: category } });
    }, 500);
  };

  const doneRefTit = useRef();
  const doneRefDec = useRef();
  const doneRefCat = useRef();
  const doneRefDat = useRef();
  const successRef = useRef();

  const playSuccess = () => {
    setOpacity(1);
    successRef?.current?.reset();
    successRef?.current?.play();
    setTimeout(() => setOpacity(0), 1500);
  };

  const handleCategorySelection = (selectedCategory) => {
    if (selectedCategory === "New Category") {
      setIsCategoryModalVisible(true);
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
        <LinearGradient
          colors={["#02043d", "#370979", "#0386d7"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.4, y: 1 }}
          style={{ flex: 1, paddingTop: 40, paddingBottom: 80 }}
        >
          <ScrollView
            contentContainerStyle={{ paddingBottom: 16 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ paddingHorizontal: 16, flex: 1 }}>
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
                      loop={false}
                      autoPlay={true}
                      speed={2}
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
                        loop={false}
                        autoPlay={true}
                        speed={2}
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
                <View style={{
                  ...glassField,
                  padding: 12,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  position: 'relative',
                }}>
                  {getCategories()?.map((item) => (
                    <TouchableOpacity
                      key={item}
                      onPress={() => {
                        setCategory(item);
                        Keyboard.dismiss();
                        doneRefCat?.current?.play();
                      }}
                    >
                      <FilterByCategory
                        categoryName={item}
                        selectedCategory={category}
                      />
                    </TouchableOpacity>
                  ))}

                  {/* New Category button */}
                  <TouchableOpacity
                    onPress={() => {
                      handleCategorySelection("New Category");
                      Keyboard.dismiss();
                    }}
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
                      loop={false}
                      autoPlay={true}
                      speed={2}
                    />
                  )}
                </View>
              </View>

              {/* CategoryModal */}
              <CategoryModal
                isVisible={isCategoryModalVisible}
                onClose={() => setIsCategoryModalVisible(false)}
                onAddCategory={addUserCategory}
                setCategory={setCategory}
                t={t}
              />

              {/* ── DUE DATE ──────────────────────────── */}
              <View style={{ marginBottom: 16 }}>
                <SectionLabel icon="calendar-outline" label={t("Select_a_due_date")} />
                <TouchableOpacity
                  onPress={() => {
                    Keyboard.dismiss();
                    setShowDatePicker(true);
                  }}
                  style={{
                    ...glassField,
                    borderColor: dueDate && typeof dueDate === 'string'
                      ? 'rgba(96,165,250,0.35)'
                      : 'rgba(255,255,255,0.15)',
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
                    color={dueDate && typeof dueDate === 'string' ? '#60a5fa' : 'rgba(255,255,255,0.35)'}
                  />
                  <Text style={{
                    flex: 1,
                    color: dueDate && typeof dueDate === 'string' ? 'white' : 'rgba(255,255,255,0.35)',
                    fontWeight: dueDate && typeof dueDate === 'string' ? '600' : '400',
                    fontSize: 15,
                  }}>
                    {!dueDate || typeof dueDate === "object"
                      ? t("Not_Yet_Selected")
                      : dueDate}
                  </Text>
                  {dueDate !== "" && (
                    <LottieView
                      style={{ width: 24, height: 24 }}
                      source={require("../../../../assets/data/done2.json")}
                      ref={doneRefDat}
                      loop={false}
                      autoPlay={true}
                      speed={2}
                    />
                  )}
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={typeof dueDate === 'string' && dueDate ? new Date(dueDate) : new Date()}
                    mode="date"
                    display="default"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.08)",
                      borderRadius: 14,
                      marginTop: 8,
                      marginBottom: 4,
                    }}
                    onChange={(_event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        const localDate = moment
                          .tz(selectedDate, moment.tz.guess())
                          .format("YYYY-MM-DD");
                        setDueDate(localDate);
                      }
                    }}
                  />
                )}
              </View>

              {/* ── TIME PICKER ───────────────────────── */}
              <TimePicker
                setDueTime={setDueTime}
                defaultTime={false}
              />

              {/* ── REMINDER ──────────────────────────── */}
              <View style={{ marginBottom: 28 }}>
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

              {/* ── ADD BUTTON ────────────────────────── */}
              <LinearGradient
                colors={['#fb923c', '#ea580c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 16, overflow: 'hidden' }}
              >
                <TouchableOpacity
                  onPress={() => { handleAddTodo(); Keyboard.dismiss(); }}
                  style={{ height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                >
                  {isLoading ? (
                    <LottieView
                      source={require("../../../../assets/data/loadingAddTodo.json")}
                      autoPlay
                      loop
                      speed={1.2}
                      style={{ width: 80, height: 80, position: 'absolute' }}
                    />
                  ) : (
                    <Text style={{ color: 'white', fontWeight: '700', fontSize: 16, letterSpacing: 0.3 }}>
                      {t("Add_ToDo")}
                    </Text>
                  )}
                  <LottieView
                    style={{ width: 45, height: 45, opacity, position: 'absolute', left: 0 }}
                    source={require("../../../../assets/data/success.json")}
                    ref={successRef}
                    loop={false}
                    autoPlay={false}
                    speed={1.5}
                  />
                </TouchableOpacity>
              </LinearGradient>

            </View>
            <StatusBar style="light" backgroundColor="transparent" translucent />
          </ScrollView>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default AddTodoPage;
