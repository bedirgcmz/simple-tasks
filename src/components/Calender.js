import { View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useTodoListContext } from "../context/todos-context";
import { router } from 'expo-router';

// Locale ayarlarını yapılandıralım
LocaleConfig.locales['en'] = {
  monthNames: [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  today: 'Today'
};

LocaleConfig.locales['tr'] = {
  monthNames: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
  monthNamesShort: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
  dayNames: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
  dayNamesShort: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
  today: 'Bugün'
};

LocaleConfig.locales['sv'] = {
  monthNames: ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
  dayNames: ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag'],
  dayNamesShort: ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'],
  today: 'Idag'
};

LocaleConfig.locales['de'] = {
  monthNames: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
  monthNamesShort: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
  dayNames: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
  dayNamesShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
  today: 'Heute'
};

const Calender = () => {
  const { todos, language } = useTodoListContext();
  const [selected, setSelected] = useState('');
  const [calendarKey, setCalendarKey] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      LocaleConfig.defaultLocale = language;
      setCalendarKey((prevKey) => prevKey + 1); // Bileşeni zorla yeniden oluştur
    }, 50); // Küçük bir gecikme ekleyerek LocaleConfig'in güncellenmesini bekletiyoruz
  }, [language]);

  
  const processTodos = () => {
    const marked = {};
    todos.forEach((todo) => {
      // const todoDueDate = todo.dueDate.split("T")[0]
      const todoDueDate = todo.dueDate.replace(/:/g, "-")
      if (todoDueDate) {
        marked[todoDueDate] = {
          disableTouchEvent: false,
          marked: true,
        };
      }
    });
    return marked;
  };

  const markedDates = processTodos();

  return (
    <View className="px-4 mt-6 rounded-lg">
      <Calendar
        key={calendarKey} // Takvimi tamamen yeniden oluştur
        p
        style={{ borderRadius: 10, height: 365, elevation: 5 }}
        onDayPress={(day) =>  router.push({ pathname: `dynamicday/${day.dateString}`, params: { from: 'home' } }) } 
        markedDates={{
          ...markedDates,
          [selected]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' },
        }}
        theme={{
          backgroundColor: '#fff',
          calendarBackground: '#240046',
          textSectionTitleColor: '#ffffff',
          selectedDayBackgroundColor: '#ff5722',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#00adf5',
          dayTextColor: '#ffffff',
          textDisabledColor: '#555555',
          dotColor: '#ff5722',
          selectedDotColor: '#fffff',
          arrowColor: '#ff5722',
          monthTextColor: '#ffffff',
          indicatorColor: '#ff5722',
          textDayFontFamily: 'Roboto-Regular',
          textMonthFontFamily: 'Roboto-Bold',
          textDayHeaderFontFamily: 'Roboto-Medium',
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}
        
      />
    </View>
  );
};

export default Calender;



