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
        // type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        // date: new Date(Date.now() + timeDiffSeconds * 1000), // 📌 Mutlak tarih belirtiyoruz
      },
    });

    console.log(`✅ Bildirim planlandı: ${todo.title}, Bildirim ID: ${notificationId}, Planlanan Zaman (UTC): ${reminderTimeUtc.format("YYYY-MM-DD HH:mm:ss")}`);

    // 📌 Bildirim ID'sini AsyncStorage'e kaydet
    const storedNotifications = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY)) || {};
    storedNotifications[todo.id] = notificationId;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storedNotifications));

  } catch (error) {
    console.log("❌ scheduleNotification fonksiyonunda hata:", error);
  }
}


export async function cancelNotification(todoId) {
  try {
    // console.log(`🗑 Cancelling notification for todo: ${todoId}`);

    // 📌 Tüm planlanmış bildirimleri al
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    // console.log("📋 All Scheduled Notifications BEFORE DELETE:", JSON.stringify(scheduledNotifications, null, 2));

    // 📌 Bildirim ID'lerini AsyncStorage’den al
    const storedNotifications = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY)) || {};

    // console.log("Storage de bulunan tum bildirimler:", storedNotifications);
    // **İlk olarak, ilgili bildirimi iptal et**
    if (storedNotifications[todoId]) {
      // console.log(`🔻 Found notification in storage, cancelling: ${storedNotifications[todoId]}`);
      await Notifications.cancelScheduledNotificationAsync(storedNotifications[todoId]);
      delete storedNotifications[todoId];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storedNotifications));
    } else {
      // console.log(`❌ No matching notification found in storage for: ${todoId}`);
    }

    // 📌 **Tüm planlanmış bildirimleri kontrol et ve ID'yi karşılaştırarak sil**
    for (const notification of scheduledNotifications) {
      if (notification.content.title.includes(todoId)) {
        // console.log(`🔻 Removing scheduled notification: ${notification.identifier}`);
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }

    // 📋 Güncellenmiş bildirimi listele
    const updatedNotifications = await Notifications.getAllScheduledNotificationsAsync();
    // console.log("📋 Currently Scheduled Notifications AFTER DELETE:", JSON.stringify(updatedNotifications, null, 2));

  } catch (error) {
    console.log("❌ Error in cancelNotification:", error);
  }
}
