import moment from "moment-timezone";  
import { useTodoListContext } from "../context/todos-context";
  
export const truncateText = (pText, pNumber) =>
  pText.length > pNumber ? `${pText.slice(0, pNumber)}...` : pText;

export function formatToShortDate(dateString, language = "en") {
  const {  t } = useTodoListContext(); 

  const monthNames = {
    en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    tr: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haz", "Tem", "Ağu", "Eylül", "Ekim", "Kasım", "Ara"],
    sv: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
    de: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
  };

  try {
    if (dateString) {
      const validFormat = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD formatı için regex
    
      if (!validFormat.test(dateString.trim())) {
        return t("Date_Not_Found");
      } else {
        // 📌 Stringi `-` ile ayırarak gün, ay ve yılı al
        const [year, month, day] = dateString.split("-");
      
        // 📌 Kullanıcının cihaz saat dilimini al
        const userTimezone = moment.tz.guess();
      
        // 📌 Tarihi moment ile oluştur ve cihazın saat dilimine göre ayarla
        const date = moment.tz(`${year}-${month}-${day}`, "YYYY-MM-DD", userTimezone);
      
        if (!date.isValid()) {
          throw new Error("❌ Geçersiz tarih formatı!");
        }
      
        const shortMonth = monthNames[language] || monthNames["en"];
        const formattedMonth = shortMonth[parseInt(month, 10) - 1]; // Ay index'i 0'dan başlıyor
      
        return `${day} ${formattedMonth}`;
      }
    }else {
      console.error("Date Bilgisi Yok");
    }
  } catch (error) {
    console.log("Gelen date bilgisi okunamadi",error);
  }
}


export function calculateReminderDateTime(todo) {
  if (!todo || !todo.dueDate || !todo.dueTime || !todo.reminderTime) {
    console.log("❌ Geçersiz todo verisi:", todo);
    return null;
  }

  // 📌 Kullanıcının saat dilimini tespit et
  const userTimeZone = moment.tz.guess(); // Örneğin: "Europe/Stockholm"

  // 📌 Hatırlatma süreleri (dakika cinsinden)
  const reminderMap = {
    "5 minutes before": 5,
    "10 minutes before": 10,
    "30 minutes before": 30,
    "1 hour before": 60,
    "2 hours before": 120,
    "6 hours before": 360,
    "1 day before": 1440,
    "1 week before": 10080,
  };

  const reminderMinutes = reminderMap[todo.reminderTime];
  if (!reminderMinutes) {
    console.log("❌ Geçersiz hatırlatma süresi:", todo.reminderTime);
    return null;
  }

  try {
    // 📌 Kullanıcının yerel saatinde `dueDate` ve `dueTime`'ı oluştur
    const localDateTime = moment.tz(`${todo.dueDate} ${todo.dueTime}`, "YYYY-MM-DD HH:mm:ss", userTimeZone);

    // 📌 Hatırlatma zamanını hesapla
    const reminderDateTime = localDateTime.subtract(reminderMinutes, "minutes");

    // 📌 Sonucu kullanıcıya uygun formatta döndür
    return reminderDateTime.format("YYYY-MM-DD HH:mm");
  } catch (error) {
    console.log("❌ Hatırlatma zamanı hesaplanırken hata oluştu:", error);
    return null;
  }
}

export function calculateDaysLeft(todo) {
  const {  t } = useTodoListContext(); 

  // 📌 `dueDate` formatı kesin olarak "YYYY-MM-DD" olmalı
  const dueDate = moment(todo.dueDate, "YYYY-MM-DD").startOf("day");

  // 📌 Eğer `dueDate` geçersizse hata ver
  if (!dueDate.isValid()) {
      throw new Error("❌ Geçersiz dueDate formatı! " + todo.dueDate);
  }

  // 📌 Bugünün tarihini al ve başlangıcını belirle (createdAt yerine)
  const today = moment().startOf("day");

  // 📌 Gün farkını hesapla
  const daysLeft = dueDate.diff(today, "days");

  // 📌 DueDate geçmişse
  if (daysLeft < 0) {
      return `${Math.abs(daysLeft)} ${t("calculateDays_text_5")}`; // Örn: "3 gün geçti"
  } else if (daysLeft === 0) {
      return t("calculateDays_text_6"); // "Bugün"
  } else {
      return `${daysLeft} ${t("calculateDays_text_7")}`; // Örn: "5 gün kaldı"
  }
}
