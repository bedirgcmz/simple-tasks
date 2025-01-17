import { View } from 'react-native';
import React from 'react';
import { Calendar } from 'react-native-calendars';
import { useTodoListContext } from "../context/todos-context";
import { router } from 'expo-router';

const Calender = () => {
  const { todos } = useTodoListContext(); // Context'ten todos verisini al

  // Tarihi `YYYY-MM-DD` formatına dönüştürme
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ayı 2 haneli yap
    const day = String(date.getDate()).padStart(2, '0'); // Günü 2 haneli yap
    return `${year}-${month}-${day}`;
  };

  // Todos verilerini işleyerek markedDates oluştur
  const processTodos = () => {
    const marked = {};
    todos.forEach((todo) => {
      if (todo.dueDate) {
        const formattedDate = formatDate(todo.dueDate); // ISO tarihini formatla
        marked[formattedDate] = {
        //   selected: true,
          disableTouchEvent: false,
          marked: true,
        //   selectedColor: 'orange',
        };
      }
    });
    return marked;
  };

  const markedDates = processTodos(); // İşlenmiş markedDates

  return (
    <View className="px-4 mt-6 rounded-lg">
      <Calendar
        style={{
        //   borderWidth: 4,
        //   borderColor: 'gray',
          borderRadius: 10,
          height: 315,
        //   backgroundColor: '#000',
          elevation: 5,
          
        }}
        onDayPress={(day) => {
          console.log(day.dateString);
          router.push({ pathname: `list/${day.dateString}`, params: { from: 'home' } })
        }}
        markedDates={markedDates} // İşlenmiş markedDates'i ekle
        theme={{
            backgroundColor: '#fff', // Takvim arka plan rengi
            calendarBackground: '#240046', // Takvim iç alan arka plan rengi
            textSectionTitleColor: '#ffffff', // Ay ve hafta başlıklarının metin rengi
            selectedDayBackgroundColor: '#ff5722', // Seçili gün arka plan rengi
            selectedDayTextColor: '#ffffff', // Seçili gün metin rengi
            todayTextColor: '#00adf5', // Bugün tarihi metin rengi
            dayTextColor: '#ffffff', // Günlerin metin rengi
            textDisabledColor: '#555555', // Devre dışı günlerin metin rengi
            dotColor: '#ff5722', // Noktaların rengi
            selectedDotColor: '#ffffff', // Seçili gün nokta rengi
            arrowColor: '#ff5722', // Sağ-sol oklarının rengi
            monthTextColor: '#ffffff', // Ay adı metin rengi
            indicatorColor: '#ff5722', // Yükleme göstergesi rengi
            textDayFontFamily: 'Roboto-Regular', // Gün metni fontu
            textMonthFontFamily: 'Roboto-Bold', // Ay adı fontu
            textDayHeaderFontFamily: 'Roboto-Medium', // Haftalık başlık fontu
            textDayFontSize: 16, // Gün metni font boyutu
            textMonthFontSize: 18, // Ay adı font boyutu
            textDayHeaderFontSize: 14, // Haftalık başlık font boyutu
            
          }}
      />
    </View>
  );
};

export default Calender;
