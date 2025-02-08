import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useRef } from "react";
import { useTodoListContext } from "../context/todos-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { formatToShortDate } from "../utils/date-utils";
import { router } from "expo-router";
import { showConfirmAlert } from "../utils/alerts";
import { playSuccessSound } from "../utils/play-success-sound";
import LottieView from "lottie-react-native";
import moment from "moment-timezone";

const ToDoDetailsCard = ({ pTodoId, pPageTitle }) => {
  const { todos, deleteTodo, updateTodo, setShowCongrats, t, language } =
    useTodoListContext();
  const todo = todos.find((todo) => todo.id === pTodoId);
  // function calculateDaysLeft(todo) {
  //   const createdAt = new Date();
  //   const dueDate = new Date(todo.dueDate);

  //   // Calculate the difference in milliseconds
  //   const timeDifference = dueDate.getTime() - createdAt.getTime();

  //   // Convert milliseconds to days
  //   const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  //   // Check if due date has passed
  //   if (daysLeft < 0) {
  //     return <Text>{`${t("calculateDays_text_1")} ${Math.abs(daysLeft)} ${t("calculateDays_text_2")}`}</Text>;
  //   } else if (daysLeft === 0) {
  //     return  <Text>{t("calculateDays_text_3")} </Text>
  //   } else {
  //     return <Text>{`${daysLeft} ${t("calculateDays_text_4")}`}</Text>
  //   }
  // }
  function calculateDaysLeft(todo) {
    // 📌 `dueDate` formatını düzelt ("YYYY:MM:DD" → "YYYY-MM-DD")
    // const formattedDueDate = todo.dueDate.replace(/:/g, "-");

    // console.log("createdSt control", todo.createdAt);

    // 📌 `createdAt` ve `dueDate` nesnelerini oluştur
    const createdAt = moment(todo.createdAt, "YYYY-MM-DD").startOf("day");
    const dueDate = moment(todo.dueDate, "YYYY-MM-DD").startOf("day");

    // 📌 Eğer `dueDate` geçersizse, hata ver
    if (!dueDate.isValid()) {
        throw new Error("❌ Geçersiz tarih formatı! " + todo.dueDate);
    }

    // 📌 Gün farkını hesapla
    const daysLeft = dueDate.diff(createdAt, "days");

    // console.log("📌 Gün farkı:", daysLeft);

    // 📌 DueDate geçmişse
    if (daysLeft < 0) {
        return `${Math.abs(daysLeft)} ${t("calculateDays_text_5")}`;
    } else if (daysLeft === 0) {
        return t("calculateDays_text_6");
    } else {
        return `${daysLeft} ${t("calculateDays_text_7")}`;
    }
}


  const confettiRef = useRef()

  const playConfetti = () => {
    confettiRef?.current?.play()
  }
  
  return (
    <View className="">
      <Text className="font-bold text-2xl text-center text-white mb-4">
        {pPageTitle}
      </Text>
      <View
        className={`border-4 rounded-md shadow-lg bg-[#ebd9fc] pb-3 ${
          todo.status === "done" ? "border-[#fe9092]" : "border-[#6c757d]"
        }`}
      >
        <TouchableOpacity
          onPress={() => {
            updateTodo(todo.id, {
              ...todo,
              status: todo.status === "done" ? "pending" : "done",
            });
            todo.status === "done" ? <Text></Text> : playSuccessSound();
            todo.status === "done" ? <Text></Text> : playConfetti();
            setShowCongrats(todo.status === "done" ? false : true);
          }}
          className="p-2 absolute bottom-[0] left-[0]"
        >
          {todo.status === "done" ? (
            <Text><Ionicons name="checkbox" size={32} color="#fe9092" /></Text>
          ) : (
            <Text><Ionicons name="square-outline" size={32} color="gray" /></Text>
          )}
        </TouchableOpacity>
        
        {/* Days Left */}
        <View
          className={`mb-3 border border-[#e9ecef] rounded-t-md items-center 
        ${todo.status === "done" ? "bg-[#fe9092]" : "bg-[#6c757d]"}
        `}
        >
          <Text className="text-lg text-white">{calculateDaysLeft(todo)}</Text>
        </View>

        <View className="px-2">
          {/* Todo Category */}
          <View className="flex-row items-center justify-end gap-2">
            <Text className="text-xl font-bold text-[#fe9092]">
              {todo.category}
            </Text>
            <Text><Ionicons name="bookmarks" size={12} color="#fe9092" /></Text>
          </View>

          {/* ToDo Title */}
          <View className="mb-2 flex-row items-center justify-start gap-2">
            <Text><Ionicons name="ellipse" size={12} color="#6c757d" /></Text>
            <Text className="text-lg font-bold text-[#495057] pr-2">
              {todo.title}
            </Text>
          </View>

          {/* ToDo Description */}
          <ScrollView className="mb-4 max-h-[220px]"
          contentContainerStyle={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "flex-start", gap: 8, paddingBottom:22 }}
          >
            <View className="pt-1">
              <Text><Ionicons name="document-text-outline" size={18} color="black" /></Text>
            </View>
            <Text className="text-[15px] w-[87%] text-gray-600">
              {todo.description}
            </Text>
          </ScrollView>

          {/* ToDo Dates */}
          <View className="mb-4 flex-row justify-between px-2">
            <View className="flex-row items-center text-sm text-gray-500">
              <Text><Ionicons name="calendar" size={18} color="#495057" /></Text>
              <Text className="ml-1">{formatToShortDate(todo.dueDate, language)}</Text>
            </View>
            <View className="flex-row items-center text-sm text-gray-500">
              <Text><Ionicons name="time" size={18} color="#495057" /></Text>
              <Text className="ml-1">{todo.dueTime.slice(0, 5)}</Text>
            </View>
          </View>

          {/* Edit Button */}
          <View className="flex-row justify-end gap-2">
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: `/edit/${todo.id}`,
                  params: { from: "details" },
                })
              } // Edit ekranına yönlendirme
              className="flex-row items-center space-x-2 px-2 py-1 rounded-lg bg-gray-600"
            >
              <Text className="text-white text-[14px]">{t("Edit_button")}</Text>
              <Text><MaterialCommunityIcons name="pencil" size={14} color="white" /></Text>
            </TouchableOpacity>

            {/* Delete Button */}
            <TouchableOpacity
              onPress={() =>
                showConfirmAlert(
                  t("You_want_to_DELETE"),
                  t("Are_you_sure"),
                  deleteTodo,
                  todo.id,
                  t
                  
                )
              }
              className="flex-row items-center space-x-2 px-2 py-1 rounded-lg bg-gray-600"
            >
              <Text>
                <MaterialCommunityIcons
                  name="trash-can"
                  size={16}
                  color="white"
                />
              </Text>
              <Text className="text-white  text-[14px]">{t("Delete_button")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <LottieView
      style={{ width: 300, height: 300}}
      source={require('../../assets/data/confetti.json')}
      ref={confettiRef}
      loop={false}
      autoPlay={false}
      speed={2.3}
      />
    </View>
  );
};

export default ToDoDetailsCard;
