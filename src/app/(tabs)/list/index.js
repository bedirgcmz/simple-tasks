import React from "react";
import { View, Text, ScrollView, Image, ImageBackground, StatusBar } from "react-native";
import { useTodoListContext } from "../../../context/todos-context";
import TodoCard from "../../../components/TodoCard";
import TodoDoneAnimation from "../../../components/TodoDoneAnimation";

const TodoBoardScreen = () => {
  const { todos, t } = useTodoListContext();

  // Helper functions to filter todos
  const isToday = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(date).setHours(0, 0, 0, 0) === today.getTime();
  };

  const isTomorrow = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return new Date(date).setHours(0, 0, 0, 0) === tomorrow.getTime();
  };

  const isNextDays = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
  
    return new Date(date) > tomorrow;
  };
  const isPastDays = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    return new Date(date).setHours(0, 0, 0, 0) < today.getTime();
  };
  
  

  const todaysTodos = todos.filter(
    (todo) => isToday(todo.dueDate) && todo.status !== "done"
  );
  const tomorrowsTodos = todos.filter(
    (todo) => isTomorrow(todo.dueDate) && todo.status !== "done"
  );
  const nextDaysTodos = todos.filter(
    (todo) =>
      isNextDays(todo.dueDate) &&
      !isTomorrow(todo.dueDate) &&
      todo.status !== "done"
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
      <View key={key} className="p-4 pb-8 border-gray-300">
        <Text className="text-lg font-bold text-[#ef6351]">{title}</Text>
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
                  <Text className="text-gray-500 text-center">{completedTodosMessage}</Text>
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
