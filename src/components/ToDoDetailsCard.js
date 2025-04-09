import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useTodoListContext } from "../context/todos-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { calculateDaysLeft, calculateReminderDateTime, formatToShortDate } from "../utils/date-utils";
import { router } from "expo-router";
import { playSuccessSound } from "../utils/play-success-sound";
import LottieView from "lottie-react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const ToDoDetailsCard = ({ pTodoId, pPageTitle }) => {
  const { todos, deleteTodo, updateTodo, t, language, deleteAllInGroup } = useTodoListContext();
    const [confettiVisible, setConfettiVisible] = useState(false);

  const todo = todos.find((todo) => todo.id === pTodoId);


  const handleDelete = () => {
    if (todo.repeatGroupId) {
      Alert.alert(
        t("Recurring_Task"),
        t("Recurring_Delete_Question"),
        [
          {
            text: t("Only_This"),
            onPress: async () => {
              await deleteTodo(todo.id); // Tek todo’yu sil
            },
            style: "default",
          },
          {
            text: t("Delete_All"),
            onPress: async () => {
              await deleteAllInGroup(todo.repeatGroupId); // Tüm grubu ve bildirimleri sil
            },
            style: "destructive",
          },
          {
            text: t("Cancel"),
            style: "cancel",
          },
        ],
        { cancelable: true }
      );
    } else {
      Alert.alert(
        t("Delete"),
        t("Delete_Confirmation"),
        [
          { text: t("Cancel"), style: "cancel" },
          {
            text: t("Delete"),
            onPress: async () => {
              await deleteTodo(todo.id);
            },
            style: "destructive",
          },
        ],
        { cancelable: true }
      );
    }
  };
  

  const handleUpdate = () => {
    if (todo.repeatGroupId) {
      router.push({
        pathname: `/edit-recurring/${pTodoId}`,
        params: { from: "details" },
      })
    } else {
      router.push({
        pathname: `/edit/${pTodoId}`,
        params: { from: "details" },
      })
    }
  }


  const confettiRef = useRef()
  const playConfetti = () => {
    setConfettiVisible(true);
    setTimeout(() => {
      confettiRef?.current?.play();
    }, 100); // animasyon render edildikten sonra başlat
    setTimeout(() => {
      setConfettiVisible(false);
    }, 3000); // 2 saniye sonra kaldır
  };

  useEffect(() => {
    if(todo.status === "done"){
      playConfetti()
    }
  },[todo])
  
  
  return (
    <View className="">
      <Text className="font-bold text-2xl text-center text-white mb-4">
        {pPageTitle}
      </Text>
      <View className="z-10 rounded-md bg-[#ebd9fc]">
          <View
            className={`border-4 rounded-md shadow-lg transparan z-20 pb-3 ${
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
              className={`mb-3 border border-[#e9ecef] rounded-t-md items-center relative 
            ${todo.status === "done" ? "bg-[#fe9092]" : "bg-[#6c757d]"}
            `}
            >
              <Text className="text-lg text-white">{calculateDaysLeft(todo, t)}</Text>
              {
                todo.isRecurring && 
              <View className="absolute right-2 top-1">
                  <MaterialIcons name="event-repeat" size={20} color="white" />
              </View>
              }
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
              <View className="mb-2 flex-row items-center justify-start gap-2 ">
                <Text><Ionicons name="ellipse" size={12} color="#6c757d" /></Text>
                <Text className="text-lg font-bold text-[#495057] pr-2 w-[91%]">
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
                  <Text className="ml-1 tracking-tighter  text-[13px]">{formatToShortDate(todo.dueDate, language, t)}</Text>
                    <Text className="ml-1 tracking-tighter  text-[13px]">- {todo.dueTime.slice(0, 5)}</Text>
                  
                </View>
                <View className="flex-row items-center text-gray-500">
                  <View className="flex-row items-center">
                    {
                      todo.status === "done" ?
                      <Ionicons name="notifications-off" size={19} color="#495057" /> :
                      <Ionicons name="notifications" size={19} color="#fe9092" />

                    }
                    <Text className="ml-1 tracking-tighter text-[13px]">
                      {formatToShortDate(calculateReminderDateTime(todo).slice(0, 11), language, t)} {" "}
                      {calculateReminderDateTime(todo).slice(11, 16)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Edit Button */}
              <View className="flex-row justify-end gap-2">
                <TouchableOpacity
                  onPress={handleUpdate} // Edit ekranına yönlendirme
                  className="flex-row items-center space-x-2 px-2 py-1 rounded-lg bg-gray-600"
                >
                  <Text className="text-white text-[14px]">{t("Edit_button")}</Text>
                  <Text><MaterialCommunityIcons name="pencil" size={14} color="white" /></Text>
                </TouchableOpacity>

                {/* Delete Button */}
                <TouchableOpacity
                onPress={handleDelete}
                  
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
          {
            confettiVisible && 
          <LottieView
          style={{ width: 300, height: 300, 
            position: 'absolute', 
            bottom: 1, 
            left: 1, 
            width: "100%",
            height: "84%",
            zIndex:15
          }}
          source={require('../../assets/data/confetti.json')}
          ref={confettiRef}
          loop={false}
          autoPlay={false}
          speed={2.3}
          />
          }

      </View>
    </View>
  );
};

export default ToDoDetailsCard;
