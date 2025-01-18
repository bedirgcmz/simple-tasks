import { View, Text } from 'react-native'
import React from 'react'
import { useTodoListContext } from "../context/todos-context";



const FilterByCategory = ({categoryName, selectedCategory}) => {
    const { todos } = useTodoListContext();

    const activeFilteredItemBg = categoryName === selectedCategory ? "bg-gray-600 text-white" : "";

  return (
      <Text className={`text-gray-600 bg-white px-3 py-[2px] mb-2 rounded-md text-[16px] mx-1 ${activeFilteredItemBg}`}>{categoryName}</Text>
    
  )
}

export default FilterByCategory