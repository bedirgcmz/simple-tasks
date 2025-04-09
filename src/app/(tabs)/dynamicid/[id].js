import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView,  Pressable} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useTodoListContext } from "../../../context/todos-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import ToDoDetailsCard from "../../../components/ToDoDetailsCard";
import LottieView from "lottie-react-native";

const TaskScreen = () => {
  const { id, from } = useLocalSearchParams();
  const { todos, t } = useTodoListContext();
  const todo = todos.find((todo) => todo.id === id);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LinearGradient
    colors={["#01061b", "#431127", "#931e36"]}
      style={{ flex: 1, padding: 7, justifyContent: "center" }}
    >
      {
        todo ? (
          <View className="flex-1 p-3 pt-20">
            <ToDoDetailsCard pTodoId={id} pPageTitle={t("ToDo_Details")} setIsLoading={setIsLoading}/>
            <Pressable
              className="bg-[#001d3d] h-10 w-[110px] pb-2 pr-4 rounded-full items-center flex-row gap-2 justify-center absolute bottom-[100px] right-[36%]"
              onPress={() => {
                if (from === 'list') {
                  router.push('/list');
                } else if (from === 'filter') {
                  router.push('/filter');
                } else if (from) {
                  router.push(`dynamicday/${from}`); //Eger [id] sayfasina, list veya add ana sayfalarindan gelmiyorsam, [day] sayfasindan geliyorumdur. Bu satir beni yine ayni gunun sayfasina goturur.
                } else {
                  router.push('/'); // Varsayılan olarak bir önceki ekrana git
                }
              }}
            >
              <Ionicons name="chevron-back-outline" size={24} color="white" />
              <Text className="text-white text-md font-bold">{t("Back_Button")}</Text>
            </Pressable>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-2xl text-white">{t("ToDo_not_found")}</Text>
          </View>
        )
      }
     {
        isLoading &&
        <LottieView
            source={require("../../../../assets/data/loadingAddTodo.json")}
            className="absolute left-[35%] top-[45%] z-[3333]"
            autoPlay
            loop
            speed={1.2}
            style={{ width: 140, height: 140 }}
          />
      }
    </LinearGradient>
  );
};

export default TaskScreen;

