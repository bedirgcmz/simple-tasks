import { View, Text } from 'react-native';
import React from 'react';

const FilterByCategory = ({ categoryName, selectedCategory }) => {
  const isSelected = categoryName === selectedCategory;

  return (
    <View
      style={{
        backgroundColor: isSelected ? 'rgba(96,165,250,0.22)' : 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        borderColor: isSelected ? 'rgba(96,165,250,0.50)' : 'rgba(255,255,255,0.14)',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 5,
        marginBottom: 6,
        marginRight: 6,
      }}
    >
      <Text
        style={{
          color: isSelected ? '#93c5fd' : 'rgba(255,255,255,0.65)',
          fontSize: 13,
          fontWeight: isSelected ? '700' : '500',
        }}
      >
        {categoryName}
      </Text>
    </View>
  );
};

export default FilterByCategory;
