import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';

const CategoryCard = ({ category, completed, total, percentage }) => {
    const [bgColor, setBgColor] = useState('');

    const categoryColors = {
        School: "bg-customPurple",
        Finance: "bg-customBlue",
        Shopping: "bg-customGreen",
        Family: "bg-customOrangeDark",
        Travel: "bg-customOrange",
        Health: "bg-customDarkBlue",
        Home: "bg-customCoffe",
        Friends: "bg-customLila",
        Work: "bg-customGray",
        Fun: "bg-customTurkuaz",
        Others: "bg-customRed",
      };
      
      // Tüm dillerdeki kategorileri İngilizceye eşle
      const categoryMap = {
        Okul: "School",
        Finans: "Finance",
        Alışveriş: "Shopping",
        Aile: "Family",
        Seyahat: "Travel",
        Sağlık: "Health",
        Ev: "Home",
        Arkadaşlar: "Friends",
        İş: "Work",
        Eğlence: "Fun",
        Diğerleri: "Others",
        Skola: "School",
        Ekonomi: "Finance",
        Shopping: "Shopping",
        Familj: "Family",
        Resa: "Travel",
        Hälsa: "Health",
        Hem: "Home",
        Vänner: "Friends",
        Arbete: "Work",
        Nöje: "Fun",
        Övrigt: "Others",
        Schule: "School",
        Finanzen: "Finance",
        Einkaufen: "Shopping",
        Familie: "Family",
        Reisen: "Travel",
        Gesundheit: "Health",
        Zuhause: "Home",
        Freunde: "Friends",
        Arbeit: "Work",
        Spaß: "Fun",
        Sonstiges: "Others",
      };
      
      useEffect(() => {
        // Eğer gelen kategori farklı bir dildeyse İngilizce karşılığını al
        const categoryKey = categoryMap[category] || category;
      
        // İngilizce karşılığına göre rengi ayarla
        setBgColor(categoryColors[categoryKey] || "bg-default");
      }, [category]);
      

  return (
    <TouchableOpacity onPress={() => router.push({ pathname: `/filter`, params: { from: category } })}  className={`items-center justify-between py-2 rounded-lg mb-4 shadow-md border border-[#373f51] w-24 h-28 mr-4 mt-2 ${bgColor}`}>
      <Text className='text-sm font-bold text-white'>{category}</Text>
      <Text className='text-white font-bold'>{completed}/{total}</Text>
      <Text className='text-white font-bold text-md'>{percentage}%</Text>
    </TouchableOpacity>
  );
};

export default CategoryCard;
