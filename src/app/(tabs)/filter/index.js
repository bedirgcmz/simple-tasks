import React, { useEffect, useState } from 'react';
import { FlatList, View, StatusBar, Text, TouchableOpacity } from 'react-native';
import { useTodoListContext } from '../../../context/todos-context';
import Todo from '../../../components/Todo';
import { useLocalSearchParams } from 'expo-router';
import FilterByCategory from '../../../components/FilterByCategory';
import TodoDoneAnimation from '../../../components/TodoDoneAnimation';
import LottieView from "lottie-react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

const FilterTodosScreen = () => {
  const { todos, language, categories, userCategories, t, isTodosReady } = useTodoListContext();
  const { from } = useLocalSearchParams();

  const categoryNames = Array.from(new Set(todos.map((item) => item.category)));
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (from && (categories[language]?.includes(from) || userCategories?.includes(from))) {
      setSelectedCategory(from);
    } else {
      setSelectedCategory("All");
    }
  }, [from, language, userCategories]);

  const filteredTodos = selectedCategory === "All"
    ? todos
    : todos.filter((todo) => todo.category === selectedCategory);

  if (!isTodosReady) {
    return (
      <LinearGradient
        colors={["#07051a", "#130b30", "#0b1a45"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.4, y: 1 }}
        style={{ flex: 1 }}
      />
    );
  }

  return (
    <LinearGradient
      colors={["#07051a", "#130b30", "#0b1a45"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.4, y: 1 }}
      style={{ flex: 1, paddingTop: 40 }}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ── Category filter bar ── */}
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 12,
        paddingVertical: 12,
        gap: 4,
        alignItems: 'center',
      }}>
        {/* "All" pill */}
        <TouchableOpacity onPress={() => setSelectedCategory("All")}>
          <View style={{
            backgroundColor: selectedCategory === "All" ? 'rgba(96,165,250,0.22)' : 'rgba(255,255,255,0.08)',
            borderWidth: 1,
            borderColor: selectedCategory === "All" ? 'rgba(96,165,250,0.50)' : 'rgba(255,255,255,0.14)',
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 5,
            marginBottom: 6,
            marginRight: 6,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
          }}>
            <Ionicons
              name="apps-outline"
              size={12}
              color={selectedCategory === "All" ? '#93c5fd' : 'rgba(255,255,255,0.55)'}
            />
            <Text style={{
              color: selectedCategory === "All" ? '#93c5fd' : 'rgba(255,255,255,0.65)',
              fontSize: 13,
              fontWeight: selectedCategory === "All" ? '700' : '500',
            }}>
              {t("All_ToDos")}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Category pills */}
        {categoryNames.map((item) => (
          <TouchableOpacity key={item} onPress={() => setSelectedCategory(item)}>
            <FilterByCategory
              categoryName={item}
              selectedCategory={selectedCategory}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Todo list ── */}
      <FlatList
        data={filteredTodos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 60, gap: 8 }}>
            <Ionicons name="checkmark-done-circle-outline" size={48} color="rgba(255,255,255,0.20)" />
            <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 15 }}>
              {t("No_Todos_Found") ?? "No todos here"}
            </Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <Todo
            todo={item}
            index={index}
            fromText="filter"
            setIsLoading={setIsLoading}
          />
        )}
      />

      <TodoDoneAnimation />

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

export default FilterTodosScreen;
