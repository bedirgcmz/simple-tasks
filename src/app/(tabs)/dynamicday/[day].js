import { View, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTodoListContext } from "../../../context/todos-context";
import { LinearGradient } from "expo-linear-gradient";
import TodoDoneAnimation from '../../../components/TodoDoneAnimation';
import TodoCard from '../../../components/TodoCard';
import QuickAddTodoModal from "../../../components/QuickAddTodoModal";
import LottieView from "lottie-react-native";

const DaysTodos = () => {
  const { day } = useLocalSearchParams();
  const [thisDaysTodos, setThisDaysTodos] = useState([]);
  const { todos, t } = useTodoListContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setThisDaysTodos(todos.filter((todo) => todo.dueDate === day));
  }, [day, todos]);

  const doneCount = thisDaysTodos.filter((t) => t.status === 'done').length;

  return (
    <LinearGradient
      colors={["#07051a", "#130b30", "#0b1a45"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.4, y: 1 }}
      style={{ flex: 1, paddingTop: 44 }}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ── Header ── */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 4,
              backgroundColor: 'rgba(255,255,255,0.08)',
              borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)',
              borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
            }}
          >
            <Ionicons name="chevron-back-outline" size={16} color="rgba(255,255,255,0.70)" />
            <Text style={{ color: 'rgba(255,255,255,0.70)', fontSize: 13, fontWeight: '600' }}>
              {t("Back_Button")}
            </Text>
          </TouchableOpacity>

          {thisDaysTodos.length > 0 && (
            <Text style={{ color: 'rgba(255,255,255,0.40)', fontSize: 12 }}>
              {doneCount}/{thisDaysTodos.length} {t("Done")}
            </Text>
          )}
        </View>

        {/* Date title */}
        <View style={{ marginTop: 14 }}>
          <Text style={{ color: '#fbbf24', fontSize: 13, fontWeight: '600', marginBottom: 2 }}>
            {day}
          </Text>
          <Text style={{ color: 'white', fontSize: 20, fontWeight: '800' }}>
            {t("todos_of_the_day")}
          </Text>
        </View>
      </View>

      {/* ── Todo grid ── */}
      <ScrollView
        contentContainerStyle={{
          flexDirection: 'row', flexWrap: 'wrap',
          justifyContent: 'space-between',
          paddingHorizontal: 12, paddingBottom: 120,
        }}
      >
        <TodoDoneAnimation />

        {thisDaysTodos.map((todo, index) => (
          <View key={index} style={{ width: '48%', marginBottom: 10 }}>
            <TodoCard todo={todo} fromText={day} setIsLoading={setIsLoading} />
          </View>
        ))}

        {thisDaysTodos.length === 0 && (
          <View style={{ flex: 1, alignItems: 'center', paddingTop: 80, gap: 10 }}>
            <Ionicons name="calendar-outline" size={48} color="rgba(255,255,255,0.18)" />
            <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 15, textAlign: 'center' }}>
              {t("No_ToDos_found")}
            </Text>
            <Text style={{ color: '#fbbf24', fontSize: 13, fontWeight: '600' }}>{day}</Text>
          </View>
        )}
      </ScrollView>

      {/* ── FAB (add) ── */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          position: 'absolute', bottom: 100, right: 20, zIndex: 50,
          width: 56, height: 56, borderRadius: 28,
          backgroundColor: 'rgba(251,146,60,0.20)',
          borderWidth: 1.5, borderColor: 'rgba(251,146,60,0.50)',
          alignItems: 'center', justifyContent: 'center',
          shadowColor: '#fb923c', shadowOpacity: 0.45, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
        }}
      >
        <LottieView
          source={require("../../../../assets/data/plusIcon.json")}
          autoPlay
          loop
          speed={0.6}
          style={{ width: 60, height: 60 }}
        />
      </TouchableOpacity>

      <QuickAddTodoModal
        visible={modalVisible}
        selectedDate={day}
        onClose={() => setModalVisible(false)}
      />

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

export default DaysTodos;
