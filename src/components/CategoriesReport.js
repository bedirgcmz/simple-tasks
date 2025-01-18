import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTodoListContext } from "../context/todos-context";
import {createCategoryCard} from '../utils/create-categori-card';

const CategoriesReport = () => {
  const { todos } = useTodoListContext();
  // const report = generateCategoryReport(todos);


const categoryNames = Array.from(new Set(todos.map((item) => item.category)));

  return (
    <View horizontal showsHorizontalScrollIndicator={false} className="px-4 mt-4">
      <Text className="text-white text-lg font-bold mb-2">
        Categories Report
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {
            categoryNames.map((item) => (
                createCategoryCard(item)
            ))
        }
      </ScrollView>
    </View>
  );
};

export default CategoriesReport;
