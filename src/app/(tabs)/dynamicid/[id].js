import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, StatusBar } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useTodoListContext } from "../../../context/todos-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ToDoDetailsCard from "../../../components/ToDoDetailsCard";
import LottieView from "lottie-react-native";

const TaskScreen = () => {
  const { id, from } = useLocalSearchParams();
  const { todos, t } = useTodoListContext();
  const todo = todos.find((todo) => todo.id === id);
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();
  // tab bar height (45) + tab bar bottom offset (max 10, insets) + extra margin
  const backButtonBottom = Math.max(insets.bottom, 10) + 45 + 14;

  const handleBack = () => {
    if (from === 'list') {
      router.push('/list');
    } else if (from === 'filter') {
      router.push('/filter');
    } else if (from) {
      router.push(`dynamicday/${from}`);
    } else {
      router.push('/');
    }
  };

  return (
    <LinearGradient
      colors={["#02043d", "#3f127e", "#0671b4"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.4, y: 1 }}
      style={{ flex: 1, paddingTop: 44 }}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {todo ? (
        <>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 14, paddingBottom: 110 }}
            showsVerticalScrollIndicator={false}
          >
            <ToDoDetailsCard pTodoId={id} pPageTitle={t("ToDo_Details")} setIsLoading={setIsLoading} />
          </ScrollView>

          {/* Back button — fixed footer, outside ScrollView */}
          <View style={{ position: 'absolute', bottom: backButtonBottom, left: 0, right: 0, alignItems: 'center' }}>
            <Pressable
              onPress={handleBack}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: 6,
                backgroundColor: 'rgba(10,15,50,0.85)',
                borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)',
                borderRadius: 24, paddingHorizontal: 20, paddingVertical: 9,
              }}
            >
              <Ionicons name="chevron-back-outline" size={18} color="white" />
              <Text style={{ color: 'white', fontSize: 14, fontWeight: '700' }}>{t("Back_Button")}</Text>
            </Pressable>
          </View>
        </>
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: 'white', fontSize: 18 }}>{t("ToDo_not_found")}</Text>
        </View>
      )}

      {isLoading && (
        <LottieView
          source={require("../../../../assets/data/loadingAddTodo.json")}
          style={{ position: 'absolute', left: '35%', top: '45%', width: 140, height: 140, zIndex: 3333 }}
          autoPlay
          loop
          speed={1.2}
        />
      )}
    </LinearGradient>
  );
};

export default TaskScreen;
