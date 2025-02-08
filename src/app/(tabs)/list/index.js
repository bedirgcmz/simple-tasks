import React from "react";
import { View, Text, ScrollView, Image, ImageBackground, StatusBar } from "react-native";
import { useTodoListContext } from "../../../context/todos-context";
import TodoCard from "../../../components/TodoCard";
import TodoDoneAnimation from "../../../components/TodoDoneAnimation";
import moment from "moment-timezone";

const TodoBoardScreen = () => {
  const { todos, t } = useTodoListContext();

  // Kullanıcının saat dilimini al
const userTimezone = moment.tz.guess();
  const isToday = (date) => {
    // 📌 Tarih formatını düzelt ("YYYY:MM:DD" → "YYYY-MM-DD")
    // const formattedDate = date.replace(/:/g, "-");
  
    // 📌 `date` değişkenini yerel saat dilimiyle `moment` nesnesine çevir
    const checkDate = moment.tz(date, "YYYY-MM-DD", userTimezone).startOf("day");
  
    // 📌 Bugünün tarihini yerel saat dilimiyle al ve saatlerini sıfırla
    const today = moment().tz(userTimezone).startOf("day");
  
    // 📌 Günleri karşılaştır (sadece gün bazında!)
    return checkDate.isSame(today, "day");
  };

  /**
 * Verilen tarih yarın mı? (Cihaz saat dilimine göre çalışır)
 */
const isTomorrow = (date) => {
  // const formattedDate = date.replace(/:/g, "-");
  const checkDate = moment.tz(date, "YYYY-MM-DD", userTimezone).startOf("day");
  const tomorrow = moment().tz(userTimezone).add(1, "day").startOf("day");

  return checkDate.isSame(tomorrow, "day");
};

/**
 * Verilen tarih gelecek günlerden biri mi? (Yarından sonrası mı?)
 */
const isNextDays = (date) => {
  // const formattedDate = date.replace(/:/g, "-");
  const checkDate = moment.tz(date, "YYYY-MM-DD", userTimezone).startOf("day");
  const tomorrow = moment().tz(userTimezone).add(1, "day").startOf("day");

  return checkDate.isAfter(tomorrow, "day");
};

/**
 * Verilen tarih geçmiş günlerden biri mi? (Bugünden önce mi?)
 */
const isPastDays = (date) => {
  // const formattedDate = date.replace(/:/g, "-");
  const checkDate = moment.tz(date, "YYYY-MM-DD", userTimezone).startOf("day");
  const today = moment().tz(userTimezone).startOf("day");

  return checkDate.isBefore(today, "day");
};
  
  

  const todaysTodos = todos.filter(
    (todo) => isToday(todo.dueDate) //&& todo.status !== "done"
  );
  const tomorrowsTodos = todos.filter(
    (todo) => isTomorrow(todo.dueDate) //&& todo.status !== "done"
  );
  const nextDaysTodos = todos.filter(
    (todo) =>
      isNextDays(todo.dueDate) &&
      !isTomorrow(todo.dueDate) 
      // && todo.status !== "done"
  );
  const pastDaysTodos = todos.filter(
    (todo) => isPastDays(todo.dueDate)
  );
  const completedTodos = todos.filter((todo) => todo.status === "done");

  // Empty state message
  const emptyImages = {
    "get-rest.png": require("../../../../assets/images/get-rest.png"),
    "have-fun.png": require("../../../../assets/images/have-fun.png"),
    "find-something.png": require("../../../../assets/images/find-something.png"),
  };
  
  const renderRestState = (pImage, pMessage) => (
    <View className="items-start">
      <Text className="text-gray-500 text-center">
        {pMessage}
      </Text>
      <Image
        source={emptyImages[pImage]} 
        className="w-44 h-16 mt-2"
        resizeMode="contain"
      />
    </View>
  );
 
  const renderTodoSection = (title, todos, key, image, message, cardBgColor) => (
      <View key={key} className="p-4 pb-8 border-gray-300 relative">
        {/* Kırmızı Nokta */}
        <Text className="text-lg font-bold text-[#ef6351]">{title}
        {todaysTodos.length > 0 &&  key === "today" &&(
                  <View
                    className="absolute top-0 right-0 h-2 w-2 bg-[#ff5400] rounded-full"
                    style={{ transform: [{ translateX: 6 }, { translateY: -6 }] }} // Noktayı daha iyi konumlandırma
                  />
                )}
        </Text>
        {todos.length > 0 ? (
          <>
            <Text className="text-gray-500 mb-4 pl-1">
              {todos.filter((t) => t.status === "done").length}/{todos.length}{" "}
              {t("Done")}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {todos.map((todo) => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  bgColor={cardBgColor}
                />
              ))}
            </ScrollView>
          </>
        ) : (
          renderRestState(image, message)
        )}
      </View>
    
  );

  //dil dosyasindan alinan bolum title bilgileri
  const todayTodosTitle = t("todayTodosTitle")
  const tomorrowTodosTitle = t("tomorrowTodosTitle")
  const nextDaysTodosTitle = t("nextDaysTodosTitle")
  const pastDaysTodosTitle = t("pastDaysTodosTitle")
  const completedTodosTitle = t("completedTodosTitle")
  //dil dosyasindan alinan "todo yoksa mesaj text" bilgileri
  const todayTodosMessage = t("todayTodosMessage")
  const tomorrowTodosMessage = t("tomorrowTodosMessage")
  const nextDaysTodosMessage = t("nextDaysTodosMessage")
  const pastDaysTodosMessage = t("pastDaysTodosMessage")
  const completedTodosMessage = t("completedTodosMessage")
  
  return (
    <ImageBackground source={require("../../../../assets/images/home-bg-2.jpg")} resizeMode="cover" className="flex-1 pt-10 ">
      <ScrollView className="flex-1">
          <StatusBar
          barStyle="light-content" 
          backgroundColor="transparent" // Status bar arka planı
          translucent={true} // Status barı saydam yapar
        />
          {/* Today's ToDo */}
          {renderTodoSection(todayTodosTitle, todaysTodos, "today", "get-rest.png", todayTodosMessage, "bg-customLila")}
         
         {/* Tomorrow's ToDo */}
          {renderTodoSection(tomorrowTodosTitle, tomorrowsTodos, "tomorrow", "have-fun.png", tomorrowTodosMessage, "bg-customPurple")}
         
          {/* Next Days ToDo */}
          {renderTodoSection(nextDaysTodosTitle, nextDaysTodos, "next-days", "find-something.png", nextDaysTodosMessage, "bg-customTurkuaz",)}
          
          {/* Past Days ToDo */}
          {renderTodoSection(pastDaysTodosTitle, pastDaysTodos, "past-days", "find-something.png", pastDaysTodosMessage, "bg-customOrangeDark",)}
         
         {/* Completed ToDos */}
            <View className="p-4 pb-6">
              <Text className="text-lg font-bold  text-[#ef6351]">{completedTodosTitle}</Text>
              <Text className="text-gray-500 mb-4 pl-1">
              {/* {completedTodos.length}{completedTodos.length > 1 ? " ToDos are done" : " ToDo is done"}   */}
              {completedTodos.length} {t("Done")}
            </Text>
              {completedTodos.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {completedTodos.map((todo) => (
                    <TodoCard
                      key={todo.id}
                      todo={todo}
                      // bgColor={"bg-customGreen"}
                      bgColor={"bg-[#343a40]"}
                    />
                  ))}
                </ScrollView>
              ) : (
                <View className="items-center mt-4">
                  <Text className="text-gray-500 text-start w-full">{completedTodosMessage}</Text>
                </View>
              )}
            </View>
        <View className="h-20"></View>
        </ScrollView>
    <TodoDoneAnimation  />
    </ImageBackground>

  );
};

export default TodoBoardScreen;
