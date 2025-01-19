import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useTodoListContext } from "../../../context/todos-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import ToDoDetailsCard from "../../../components/ToDoDetailsCard";

const TaskScreen = () => {
  const { id, from } = useLocalSearchParams();
  const { todos } = useTodoListContext();
  const todo = todos.find((todo) => todo.id === id);


// const pageTitle = from === 'list' || from === 'filter' ? "ToDo Details" : "ToDo's Found for This Date";
  return (
    <LinearGradient
    colors={["#01061b", "#431127", "#931e36"]}
      style={{ flex: 1, padding: 7, justifyContent: "center" }}
    >
      {
        todo ? (
          <View className="flex-1 p-3 pt-20">
            {/* <Text className="text-white text-lg text-center pt-4 pb-2">{pageTitle}</Text> */}
            <ToDoDetailsCard pTodoId={id} pPageTitle="ToDo Details"/>
            <TouchableOpacity
              className="bg-[#001d3d] h-10 w-[110px] pb-2 pr-4 rounded-full items-center flex-row gap-2 justify-center absolute bottom-[100px] right-[36%]"
              onPress={() => {
                if (from === 'list') {
                  router.push('/list');
                } else if (from === 'filter') {
                  router.push('/filter');
                } else if (from) {
                  router.push(`dynamicday/${from}`); //Eger [id] sayfasina, list veya add ana sayfalarindan gelmiyorsam, [day] sayfasindan geliyorumdur. Bu satir beni yine ayni gunun sayfasina goturur.
                } else {
                  router.back(); // Varsayılan olarak bir önceki ekrana git
                }
              }}
            >
              <Ionicons name="chevron-back-outline" size={24} color="white" />
              <Text className="text-white text-md font-bold">Back</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-2xl text-white">ToDo not found</Text>
          </View>
        )
      }

    </LinearGradient>
  );
};

export default TaskScreen;

