import * as Notifications from "expo-notifications";
import moment from "moment-timezone"; // moment-timezone'ı kullandık
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatToShortDate } from "./date-utils";
import { useEffect } from "react";

const STORAGE_KEY = "scheduledNotifications";

// AsyncStorage'dan tüm bildirimleri silmek için
Notifications.addNotificationReceivedListener(async (notification) => {
  console.log("📩 Received Notification:", notification);

  const notificationId = notification.request.identifier;

  // Bildirimi Expo'dan tamamen kaldır
  await Notifications.cancelScheduledNotificationAsync(notificationId);

  // Bildirim ID'sini AsyncStorage'dan sil
  const storedNotifications = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY)) || {};
  delete storedNotifications[notificationId]; // İlgili bildirimi sil
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storedNotifications)); // Güncellenmiş veriyi kaydet
});

export async function scheduleNotification(todo, t, language) {
  if (!todo || !todo.dueDate || !todo.dueTime || !todo.reminderTime) {
    console.log("❌ Geçersiz todo verisi:", todo);
    return;
  }

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
    return;
  }

  function getReminderMessage(pTodo) {
    const timeValue = reminderMap[pTodo.reminderTime];
  
    if (timeValue < 60) {
      return `${t("Notification_2")}  ${timeValue} ${t("Notification_Min")}`;
    } else if (timeValue < 1440) {
      return `${t("Notification_2")}  ${timeValue / 60} ${t("Notification_Huor")}`;
    } else {
      return `${t("Notification_2")}  ${timeValue / 1440} ${t("Notification_Day")}`;
    }
  }

  try {
    // 📌 Kullanıcının saat dilimini bul
    const userTimeZone = moment.tz.guess(); // Örneğin: "Europe/Stockholm"

    // 📌 dueDate ve dueTime'ı kullanarak yerel tarih- saat oluştur
    const localDateTime = moment.tz(`${todo.dueDate} ${todo.dueTime}`, "YYYY-MM-DD HH:mm:ss", userTimeZone);

    // 📌 UTC'ye çevir
    const utcDateTime = localDateTime.utc();

    // 📌 Hatırlatma zamanını UTC bazında hesapla
    const reminderTimeUtc = utcDateTime.subtract(reminderMinutes, "minutes");

    // 📌 Şu anki UTC zamanını al
    const nowUtc = moment.utc();

    // 📌 Bildirim zamanına kaç saniye kaldığını hesapla
    const timeDiffSeconds = reminderTimeUtc.diff(nowUtc, "seconds");

    if (timeDiffSeconds <= 0) {
      console.log("⚠️ Hatırlatma zamanı geçmişte. Bildirim planlanmadı.");
      return;
    }
    
    // 📌 Bildirimi planla // ${localDateTime.format("YYYY-MM-DD HH:mm")} burasi hatirlatma zamanini veriyor
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: todo.title,
        body: `${getReminderMessage(todo)}`,
        sound: "default",
        data: { todoId: todo.id }, 
      },
      trigger: {
        
        seconds: timeDiffSeconds, // 📌 UTC bazında doğru zamanlama
        repeats: false,
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        // date: new Date(Date.now() + timeDiffSeconds * 1000), // 📌 Mutlak tarih belirtiyoruz
      },
    });

    console.log(`✅ Bildirim planlandı: ${todo.title}, Bildirim ID: ${notificationId}, Planlanan Zaman (UTC): ${reminderTimeUtc.format("YYYY-MM-DD HH:mm:ss")}`);

    // 📌 Bildirim ID'sini AsyncStorage'e kaydet
    const storedNotifications = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY)) || {};
    storedNotifications[todo.id] = notificationId;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storedNotifications));
    return notificationId;

  } catch (error) {
    console.log("❌ scheduleNotification fonksiyonunda hata:", error);
  }
}


// Yeni: doğrudan notificationId ile çalışır
export const cancelNotification = async (notificationId) => {
  try {
    if (!notificationId) {
      console.warn("⚠️ Bildirim iptali için geçersiz notificationId");
      return;
    }

    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log("🗑 Bildirim iptal edildi:", notificationId);
  } catch (error) {
    console.error("❌ Bildirim iptal hatası:", error);
  }
};

// Tüm bildirimleri temizle
export const clearAllScheduledNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log("🧹 Tüm planlanmış bildirimler temizlendi.");
  } catch (error) {
    console.error("❌ Bildirim temizleme hatası:", error);
  }
};