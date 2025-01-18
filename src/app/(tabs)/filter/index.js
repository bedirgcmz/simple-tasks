import React, { useEffect, useState } from 'react';
import { FlatList, View, StatusBar, ImageBackground, Text, TouchableOpacity } from 'react-native';
import { useTodoListContext } from '../../../context/todos-context';
import Todo from '../../../components/todo';
import { useLocalSearchParams } from 'expo-router';
import FilterByCategory from '../../../components/FilterByCategory';

const FilterTodosScreen = () => {
  const { todos } = useTodoListContext();
  const { from  } = useLocalSearchParams();
const categoryNames = Array.from(new Set(todos.map((item) => item.category)));
const [selectedCategory, setSelectedCategory] = useState("")

useEffect(() => {
  if (from) {
    setSelectedCategory(from);
  }
}, [from]);

console.log(from);

// const filteredTodos = from === undefined || selectedCategory === "All" ? todos : todos.filter((todo) => todo.category === selectedCategory);
let filteredTodos;
if (selectedCategory === "All") {
  filteredTodos = todos;
} else if(from === undefined && selectedCategory === ""){
  filteredTodos = todos;
}else if(from !== undefined && selectedCategory !== undefined ){
  filteredTodos = todos.filter((todo) => todo.category === selectedCategory);
}else{
  filteredTodos = todos.filter((todo) => todo.category === selectedCategory);
} 

  return (
    <ImageBackground source={require("../../../../assets/images/bg-add.jpg")} resizeMode="cover" className="flex-1 pt-10 pb-20">
    <View className="flex-row flex-wrap pt-6 px-2 items-center justify-center">
      {
        categoryNames.map((item) => (
          <TouchableOpacity onPress={() => setSelectedCategory(item)} key={item} >
            <FilterByCategory categoryName={item} selectedCategory={selectedCategory}/>
          </TouchableOpacity>
        ))
      }
      <TouchableOpacity onPress={() => setSelectedCategory("All")} >
         <Text className={`text-gray-600 bg-white px-3 py-[2px] mb-2 rounded-md text-[16px] mx-1 ${selectedCategory === "All" ? "bg-gray-600 text-white" : ""}`}>All ToDos</Text>
      </TouchableOpacity>

    </View>
    {/* <Text className="text-lg text-white text-center mt-2">Your All ToDos</Text> */}
    <FlatList
      className="p-2 "
        data={filteredTodos}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Todo todo={item} index={index} fromText="filter"/>
        )}
      />
     <StatusBar 
          style="light"
          backgroundColor="transparent"
          translucent={true}
    
    /> 
</ImageBackground>
  );
};

export default FilterTodosScreen;

