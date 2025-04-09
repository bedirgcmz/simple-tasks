import React, { useEffect, useState } from 'react';
import { FlatList, View, StatusBar, ImageBackground, Text, TouchableOpacity } from 'react-native';
import { useTodoListContext } from '../../../context/todos-context';
import Todo from '../../../components/Todo';
import { useLocalSearchParams } from 'expo-router';
import FilterByCategory from '../../../components/FilterByCategory';
import TodoDoneAnimation from '../../../components/TodoDoneAnimation';
import LottieView from "lottie-react-native";

const FilterTodosScreen = () => {
  const { todos, language, categories, userCategories, t } = useTodoListContext();
  const { from  } = useLocalSearchParams();
const categoryNames = Array.from(new Set(todos.map((item) => item.category)));
const [selectedCategory, setSelectedCategory] = useState("All")
const [isLoading, setIsLoading] = useState(false);


useEffect(() => {
  if (from && (categories[language]?.includes(from) || userCategories?.includes(from))) {
    setSelectedCategory(from);
  } else {
    setSelectedCategory("All");
  }
}, [from, language]);

let filteredTodos;
if (selectedCategory === "All") {
  filteredTodos = todos;
} else {
  filteredTodos = todos.filter((todo) => todo.category === selectedCategory);
}

  return (
    <ImageBackground source={require("../../../../assets/images/bg-add.jpg")} resizeMode="cover" className="flex-1 pt-10 pb-20">
    <View className="flex-row flex-wrap pt-6 px-2 items-center justify-center">
      {
        categoryNames.map((item) => (
          <TouchableOpacity onPress={() => setSelectedCategory(item)} key={item} >
            <FilterByCategory categoryName={item} selectedCategory={selectedCategory} bgColor="" textColor=""  />
          </TouchableOpacity>
        ))
      }
      <TouchableOpacity onPress={() => setSelectedCategory("All")} >
         <Text className={`text-gray-600 bg-[#d7c8f3]  px-3 py-[2px] mb-1 rounded-md text-[14px] mx-1 ${selectedCategory === "All" ? "bg-gray-600 text-white" : ""}`}>{t("All_ToDos")}</Text>
      </TouchableOpacity>

    </View>
    <FlatList
      className="p-2 "
        data={filteredTodos}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Todo todo={item} index={index} fromText="filter" setIsLoading={setIsLoading}/>
        )}
      />
      <TodoDoneAnimation />
     <StatusBar 
          style="light"
          backgroundColor="transparent"
          translucent={true}
    /> 
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
</ImageBackground>
  );
};

export default FilterTodosScreen;

