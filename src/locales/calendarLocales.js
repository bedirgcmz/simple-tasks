import { LocaleConfig } from 'react-native-calendars';

const calendarLocales = {
  en: {
    monthNames: [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    monthNamesShort: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    dayNames: [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
      'Thursday', 'Friday', 'Saturday'
    ],
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  },
  tr: {
    monthNames: [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ],
    monthNamesShort: [
      'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 
      'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'
    ],
    dayNames: [
      'Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 
      'Perşembe', 'Cuma', 'Cumartesi'
    ],
    dayNamesShort: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
  },
  sv: {
    monthNames: [
      'Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 
      'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'
    ],
    monthNamesShort: [
      'Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'
    ],
    dayNames: [
      'Söndag', 'Måndag', 'Tisdag', 'Onsdag', 
      'Torsdag', 'Fredag', 'Lördag'
    ],
    dayNamesShort: ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'],
  },
  de: {
    monthNames: [
      'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ],
    monthNamesShort: [
      'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'
    ],
    dayNames: [
      'Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 
      'Donnerstag', 'Freitag', 'Samstag'
    ],
    dayNamesShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
  },
};

// `react-native-calendars` bileşeni için çeviri ayarlarını yapılandır
Object.keys(calendarLocales).forEach((locale) => {
  LocaleConfig.locales[locale] = calendarLocales[locale];
});

export const setCalendarLocale = (lang) => {
  LocaleConfig.defaultLocale = lang;
};

export default calendarLocales;
