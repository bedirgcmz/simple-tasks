import React, { useState } from "react";
import { View, Text, ScrollView, Image, StatusBar, TouchableOpacity } from "react-native";
import { useTodoListContext } from "../../../context/todos-context";
import TodoCard from "../../../components/TodoCard";
import TodoDoneAnimation from "../../../components/TodoDoneAnimation";
import moment from "moment-timezone";
import LottieView from "lottie-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

const TodoBoardScreen = () => {
  const { todos, t } = useTodoListContext();
  const [isLoading, setIsLoading] = useState(false);
  const [collapsed, setCollapsed] = useState({ "past-days": true, "completed": true });

  const toggleCollapse = (key) =>
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

  // ── Date helpers (unchanged) ────────────────────────────
  const userTimezone = moment.tz.guess();

  const isToday = (date) => {
    const checkDate = moment.tz(date, "YYYY-MM-DD", userTimezone).startOf("day");
    const today = moment().tz(userTimezone).startOf("day");
    return checkDate.isSame(today, "day");
  };

  const isTomorrow = (date) => {
    const checkDate = moment.tz(date, "YYYY-MM-DD", userTimezone).startOf("day");
    const tomorrow = moment().tz(userTimezone).add(1, "day").startOf("day");
    return checkDate.isSame(tomorrow, "day");
  };

  const isNextDays = (date) => {
    const checkDate = moment.tz(date, "YYYY-MM-DD", userTimezone).startOf("day");
    const tomorrow = moment().tz(userTimezone).add(1, "day").startOf("day");
    return checkDate.isAfter(tomorrow, "day");
  };

  const isPastDays = (date) => {
    const checkDate = moment.tz(date, "YYYY-MM-DD", userTimezone).startOf("day");
    const today = moment().tz(userTimezone).startOf("day");
    return checkDate.isBefore(today, "day");
  };

  const validFormat = /^\d{4}-\d{2}-\d{2}$/;
  const normalizeDate = (d) => (typeof d === 'string' && d.includes('T') ? d.split('T')[0] : d?.trim());

  // ── Todo filters ────────────────────────────────────────
  const todaysTodos    = todos.filter((todo) => { const d = normalizeDate(todo.dueDate); return d && validFormat.test(d) && isToday(d); });
  const tomorrowsTodos = todos.filter((todo) => { const d = normalizeDate(todo.dueDate); return d && validFormat.test(d) && isTomorrow(d); });
  const nextDaysTodos  = todos.filter((todo) => { const d = normalizeDate(todo.dueDate); return d && validFormat.test(d) && isNextDays(d) && !isTomorrow(d); });
  const pastDaysTodos  = todos.filter((todo) => { const d = normalizeDate(todo.dueDate); return d && validFormat.test(d) && isPastDays(d); });
  const completedTodos = todos.filter((todo) => todo.status === "done");

  // ── Empty state images (unchanged) ─────────────────────
  const emptyImages = {
    "get-rest.png":       require("../../../../assets/images/get-rest.png"),
    "have-fun.png":       require("../../../../assets/images/have-fun.png"),
    "find-something.png": require("../../../../assets/images/find-something.png"),
  };

  // ── Section config ──────────────────────────────────────
  const sections = [
    {
      key: "today",
      title: t("todayTodosTitle"),
      todos: todaysTodos,
      icon: "sunny-outline",
      accentColor: "#60a5fa",
      borderColor: "rgba(96,165,250,0.40)",
      bgColor: "rgba(96,165,250,0.07)",
      image: "get-rest.png",
      message: t("todayTodosMessage"),
      hasDot: true,
    },
    {
      key: "tomorrow",
      title: t("tomorrowTodosTitle"),
      todos: tomorrowsTodos,
      icon: "calendar-outline",
      accentColor: "#a78bfa",
      borderColor: "rgba(167,139,250,0.40)",
      bgColor: "rgba(167,139,250,0.07)",
      image: "have-fun.png",
      message: t("tomorrowTodosMessage"),
    },
    {
      key: "next-days",
      title: t("nextDaysTodosTitle"),
      todos: nextDaysTodos,
      icon: "calendar-clear-outline",
      accentColor: "#67e8f9",
      borderColor: "rgba(103,232,249,0.35)",
      bgColor: "rgba(103,232,249,0.06)",
      image: "find-something.png",
      message: t("nextDaysTodosMessage"),
    },
    {
      key: "past-days",
      title: t("pastDaysTodosTitle"),
      todos: pastDaysTodos,
      icon: "time-outline",
      accentColor: "#fb923c",
      borderColor: "rgba(251,146,60,0.40)",
      bgColor: "rgba(251,146,60,0.07)",
      image: "find-something.png",
      message: t("pastDaysTodosMessage"),
    },
    {
      key: "completed",
      title: t("completedTodosTitle"),
      todos: completedTodos,
      icon: "checkmark-circle-outline",
      accentColor: "#4ade80",
      borderColor: "rgba(74,222,128,0.35)",
      bgColor: "rgba(74,222,128,0.06)",
      image: null,
      message: t("completedTodosMessage"),
      isCompleted: true,
    },
  ];

  return (
    <LinearGradient
      colors={["#07051a", "#130b30", "#0b1a45"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.4, y: 1 }}
      style={{ flex: 1, paddingTop: 40 }}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 12, paddingBottom: 100 }}
      >
        {sections.map((section) => {
          const doneCount = section.todos.filter((t) => t.status === "done").length;
          const isCollapsed = !!collapsed[section.key];

          return (
            <View
              key={section.key}
              style={{
                backgroundColor: section.bgColor,
                borderWidth: 1,
                borderColor: section.borderColor,
                borderRadius: 18,
                marginBottom: 10,
                shadowColor: "#000",
                shadowOpacity: 0.30,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
                overflow: 'hidden',
              }}
            >
              {/* ── Section header (tappable) ── */}
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => toggleCollapse(section.key)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 6, padding: 14, paddingBottom: isCollapsed ? 14 : 4 }}
              >
                <Ionicons name={section.icon} size={16} color={section.accentColor} />
                <Text style={{ color: 'white', fontSize: 15, fontWeight: '700', flex: 1 }}>
                  {section.title}
                </Text>

                {/* Red dot — today has pending todos */}
                {section.hasDot && todaysTodos.length > 0 && (
                  <View style={{
                    width: 8, height: 8, borderRadius: 4,
                    backgroundColor: '#ff5400',
                    shadowColor: '#ff5400',
                    shadowOpacity: 0.8,
                    shadowRadius: 4,
                  }} />
                )}

                {/* Counter badge */}
                <Text style={{ color: 'rgba(255,255,255,0.40)', fontSize: 12 }}>
                  {section.isCompleted
                    ? `${section.todos.length} ${t("Done")}`
                    : `${doneCount}/${section.todos.length} ${t("Done")}`}
                </Text>

                {/* Chevron */}
                <Ionicons
                  name={isCollapsed ? "chevron-down" : "chevron-up"}
                  size={14}
                  color="rgba(255,255,255,0.40)"
                />
              </TouchableOpacity>

              {/* ── Collapsible content ── */}
              {!isCollapsed && (
                <View style={{ paddingHorizontal: 14, paddingBottom: 14 }}>
                  {section.todos.length > 0 ? (
                    section.todos.map((todo) => (
                      <TodoCard
                        key={todo.id}
                        todo={todo}
                        fromText="list"
                        setIsLoading={setIsLoading}
                      />
                    ))
                  ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 4 }}>
                      <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
                        {section.message}
                      </Text>
                      {section.image && (
                        <Image
                          source={emptyImages[section.image]}
                          style={{ width: 80, height: 40 }}
                          resizeMode="contain"
                        />
                      )}
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        })}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Loading overlay */}
      {isLoading && (
        <LottieView
          source={require("../../../../assets/data/loadingAddTodo.json")}
          style={{ position: 'absolute', left: '35%', top: '45%', width: 140, height: 140, zIndex: 3333 }}
          autoPlay
          loop
          speed={1.2}
        />
      )}

      <TodoDoneAnimation />
    </LinearGradient>
  );
};

export default TodoBoardScreen;
