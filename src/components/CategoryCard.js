import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

const CategoryCard = ({ category, completed, total, percentage }) => {
    const [bgColor, setBgColor] = useState('');

    useEffect(() => {
        if(category === "Family"){
            setBgColor('bg-customBlue');
        }else if(category === "School"){
            setBgColor('bg-customPurple');
            console.log(bgColor);
        }else if(category === "Shopping"){
            setBgColor('bg-customGreen');
        }else if(category === "Fun"){
            setBgColor('bg-customOrange');
        }else if(category === "Work"){
            setBgColor('bg-customCoffe');
        }else if(category === "Friends"){
            setBgColor('bg-customLila');
        }else if(category === "Others"){
            setBgColor('bg-customRed');
        }
    }, []);


  return (
    <View  className={`items-center justify-between py-2 rounded-lg mb-4 shadow-md border border-[#373f51] w-24 h-28 mr-4 mt-2 ${bgColor}`}>
      <Text className='text-lg font-bold text-white'>{category}</Text>
      <Text className='text-white font-bold'>{completed}/{total}</Text>
      <Text className='text-white font-bold text-md'>{percentage}%</Text>
    </View>
  );
};

export default CategoryCard;
