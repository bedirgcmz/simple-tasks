import moment from "moment-timezone";  
  
export const truncateText = (pText, pNumber) =>
  pText.length > pNumber ? `${pText.slice(0, pNumber)}...` : pText;
  
// export function formatToShortDate(dateString, language = "en") {
//   const monthNames = {
//     en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
//     tr: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haz", "Tem", "Ağu", "Eylül", "Ekim", "Kasım", "Ara"],
//     sv: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
//     de: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
//   };

//   console.log("Cihaz saat dilimi:", moment.tz.guess());
// console.log("gelen dueDate:", dateString);
// // const date = moment.utc(dateString).local();
// const date = moment.tz(dateString, "UTC").local();

// console.log("gelen dueDate moment.utc ile duzenlendikten sonra:", date);

//   if (!date.isValid()) {
//     throw new Error("Invalid date format");
//   }

//   const day = date.date();
//   const month = monthNames[language] || monthNames["en"];
//   const shortMonth = month[date.month()];
//   console.log("Son durumda olusan tarih:", `${day} ${shortMonth}`);

//   return `${day} ${shortMonth}`;
// }


// export function formatToShortDate(dateString, language = "en") {

//   // gelen dateString turu: string olarak soyle gliyro: 20:02:2025
//   const monthNames = {
//     en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
//     tr: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haz", "Tem", "Ağu", "Eylül", "Ekim", "Kasım", "Ara"],
//     sv: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
//     de: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
//   };


//   // 📌 Kullanıcının cihaz saat dilimini al
//   const userTimezone = moment.tz.guess();

//   // 📌 UTC'yi önce gün başlangıcına çek, sonra kullanıcının saat dilimine çevir
//   const date = dateString
//   // const date = moment.tz(dateString, "UTC").startOf("day").tz(userTimezone);

//   // if (!date) {
//   //   throw new Error("❌ Geçersiz tarih formatı!");
//   // }
// console.log(dateString);
//   const day = date.splite{};
//   // const day = date.date();
//   const month = monthNames[language] || monthNames["en"];
//   const shortMonth = month[date.month()];


//   return `${day} ${shortMonth}`;
// }



export function formatToShortDate(dateString, language = "en") {
  const monthNames = {
    en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    tr: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haz", "Tem", "Ağu", "Eylül", "Ekim", "Kasım", "Ara"],
    sv: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
    de: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
  };

  // console.log("📌 Gelen dateString:", dateString);

  // console.log("gelen date bilgisi date-util icinde",dateString);
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

  // console.log("✅ Son durumda oluşan tarih:", `${day} ${formattedMonth}`);

  return `${day} ${formattedMonth}`;
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
