import { Text } from 'react-native'
import React from 'react'

const FilterByCategory = ({categoryName, selectedCategory}) => {
  const activeFilteredItemBg = categoryName === selectedCategory ? "bg-gray-600 text-white" : "";

  return (
      <Text className={`text-gray-600 bg-[#d7c8f3]  px-3 py-[2px] mb-1 rounded-md text-[14px] mx-1 ${activeFilteredItemBg}`}>{categoryName}</Text>
  )
}

export default FilterByCategory