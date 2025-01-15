import React from "react";
import { View, Text, ScrollView, Image, ImageBackground, SafeAreaView, StatusBar } from "react-native";
import { useTodoListContext } from "../../../context/todos-context";
import TodoCard from "../../../components/TodoCard";
import { useRouter } from "expo-router";

const TodoBoardScreen = () => {
  const { todos } = useTodoListContext();
  const router = useRouter();

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
  const completedTodos = todos.filter((todo) => todo.status === "done");

  // Empty state message
  const emptyImages = {
    "get-rest.png": require("../../../../assets/images/get-rest.png"),
    "have-fun.png": require("../../../../assets/images/have-fun.png"),
    "find-something.png": require("../../../../assets/images/find-something.png"),
  };
  
  const renderRestState = (pImage, pMessage) => (
    <View className="items-center">
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
 
  const bgImages = {
    "bg-next.jpg": require("../../../../assets/images/bg-next.jpg"),
    "bg-today.jpg": require("../../../../assets/images/bg-today.jpg"),
    "bg-tomorrow.jpg": require("../../../../assets/images/bg-tomorrow.jpg"),
  };
 
  const renderTodoSection = (title, todos, key, image, message, cardBgColor, bgImage) => (
      <View key={key} className="p-4 pb-8 border-gray-300">
        <Text className="text-lg font-bold text-blue-500">{title}</Text>
        {todos.length > 0 ? (
          <>
            <Text className="text-gray-500 mb-4 pl-1">
              {todos.filter((t) => t.status === "done").length}/{todos.length}{" "}
              Done
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {todos.map((todo) => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  onPress={() => router.push(`/todos/${todo.id}`)}
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
  
  return (
    <ImageBackground source={require("../../../../assets/images/bg-tomorrow.jpg")} resizeMode="cover" className="flex-1 pt-10">
      <ScrollView className="flex-1">
          <StatusBar
          barStyle="dark-content" // Yazı rengi: "dark-content", "light-content" veya "default"
          backgroundColor="transparent" // Status bar arka planı
          translucent={true} // Status barı saydam yapar
        />
          {/* Today's ToDo */}
          {renderTodoSection("Today's ToDo", todaysTodos, "today", "get-rest.png", "Enjoy yourself today, you don't have any todo.", "bg-[#90e0ef]", "bg-today.jpg")}
            {/* <View className="h-1 w-[80%] bg-[#d4d700] self-center rounded-full"></View> */}
          {/* Tomorrow's ToDo */}
          {renderTodoSection("Tomorrow's ToDo", tomorrowsTodos, "tomorrow", "have-fun.png", "You'll have time to have fun tomorrow.", "bg-[#f7b267]", "bg-tomorrow.jpg")}
          {/* <View className="h-1 w-[80%] bg-[#d4d700] self-center rounded-full"></View> */}
          {/* Next Days ToDo */}
          {renderTodoSection("Next Days ToDo", nextDaysTodos, "next-days", "find-something.png", "You should find something to do.", "bg-[#07beb8]", "bg-next.jpg")}
          {/* <View className="h-1 w-[80%] bg-[#d4d700] self-center rounded-full"></View> */}
          {/* Completed ToDos */}
            <View className="p-4 pb-6">
              <Text className="text-lg font-bold mb-2">Completed ToDos</Text>
              {completedTodos.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {completedTodos.map((todo) => (
                    <TodoCard
                      key={todo.id}
                      todo={todo}
                      onPress={() => router.push(`/todos/${todo.id}`)}
                      bgColor={"bg-[#f4978e]"}
                    />
                  ))}
                </ScrollView>
              ) : (
                <View className="items-center mt-4">
                  <Text className="text-gray-500 text-center">Tamamlanmış görev yok</Text>
                </View>
              )}
            </View>
        </ScrollView>
    </ImageBackground>

  );
};

export default TodoBoardScreen;
