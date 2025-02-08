import * as Notifications from "expo-notifications";
import moment from "moment-timezone"; // moment-timezone'ı kullandık
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatToShortDate } from "./date-utils";
import { useEffect } from "react";

const STORAGE_KEY = "scheduledNotifications";

// AsyncStorage'dan tüm bildirimleri silmek için
Notifications.addNotificationReceivedListener(async (notification) => {
  // console.log("📩 Received Notification:", notification);

  const notificationId = notification.request.identifier;

  // Bildirimi Expo'dan tamamen kaldır
  await Notifications.cancelScheduledNotificationAsync(notificationId);

  // Bildirim ID'sini AsyncStorage'dan sil
  const storedNotifications = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY)) || {};
  delete storedNotifications[notificationId]; // İlgili bildirimi sil
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storedNotifications)); // Güncellenmiş veriyi kaydet
});

// // Bu fonksiyon uygulama acildiginda, expo da olan bildirimlere, asyncStorage olanlari yeniden senkronize eder
// const clearExpiredNotifications = async () => {
//   try {
//     const storedNotifications = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY)) || {};
//     const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();

//     for (const todoId in storedNotifications) {
//       if (!scheduledNotifications.some(n => n.identifier === storedNotifications[todoId])) {
//         console.log(`🗑 Removing stale notification from storage: ${todoId}`);
//         delete storedNotifications[todoId];
//       }
//     }

//     await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storedNotifications));
//   } catch (error) {
//     console.log("❌ Error clearing expired notifications:", error);
//   }
// };

// // Uygulama açıldığında veya arka plandan öne alındığında çalıştır
// useEffect(() => {
//   clearExpiredNotifications();
// }, []);


// export async function scheduleNotification(todo, t, language) {
//   if (!todo || !todo.dueDate || !todo.dueTime || !todo.reminderTime) {
//     console.log("❌ Invalid todo data:", todo);
//     return;
//   }

//   const reminderMap = {
//     "5 minutes before": 5,
//     "10 minutes before": 10,
//     "30 minutes before": 30,
//     "1 hour before": 60,
//     "2 hours before": 120,
//     "6 hours before": 360,
//     "1 day before": 1440,
//     "1 week before": 10080,
//   };

//   const reminderMinutes = reminderMap[todo.reminderTime];
//   if (!reminderMinutes) {
//     console.log("❌ Invalid reminder time:", todo.reminderTime);
//     return;
//   }

//   try {
//     const localTimeZone = moment.tz.guess();
//     console.log("Tododan gelen dueDate bilgisi:", todo.dueDate);
//     console.log("Tododan gelen dueTime bilgisi:", todo.dueTime);
//     const todoDateTime = moment.tz(
//       `${todo.dueDate} ${todo.dueTime}`,
//       "YYYY-MM-DD HH:mm:ss",
//       localTimeZone
//       );
//     console.log("fornatlamadan sonra elde edilen todoDateTime bilgisi:", todoDateTime);

//     const reminderTime = todoDateTime.subtract(reminderMinutes, "minutes");
//     console.log("📆 Bildirimin calisacagi reminderTiem:", reminderTime);

//     // Eğer reminderTime geçmişse, bildirimi tetikleme
//     if (reminderTime.isBefore(moment())) {
//       console.log("⚠️ Reminder time is in the past. Skipping notification.", reminderTime);
//       return;
//     }


//     const notificationId = await Notifications.scheduleNotificationAsync({
//       content: {
//         title: todo.title,
//         body: `${t("Notification_2")}  ${formatToShortDate(todo.dueDate, language)} / ${todo.dueTime.substring(0, 5)}`,
//         sound: "default",
//         data: { todoId: todo.id },
//       },
//       trigger: {
//         date: reminderTime.toDate(),
//       },
//     });

//     // 📌 **Bildirim ID’sini AsyncStorage içine kaydet**
//     const storedNotifications = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY)) || {};
//     storedNotifications[todo.id] = notificationId;
//     await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storedNotifications));

//   } catch (error) {
//     console.log("❌ Error in scheduleNotification:", error);
//   }
// }


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

  try {
    // dueDate ve dueTime'ı birleştirerek bir Date nesnesi oluşturun
    const [year, month, day] = todo.dueDate.split('-').map(Number);
    const [hour, minute, second] = todo.dueTime.split(':').map(Number);
    const dueDateTime = new Date(year, month - 1, day, hour, minute, second);

    // Hatırlatma zamanını hesaplayın
    const reminderTime = new Date(dueDateTime.getTime() - reminderMinutes * 60000);

    // Eğer reminderTime geçmişteyse, bildirimi tetiklemeyin
    const now = new Date();
    if (reminderTime <= now) {
      console.log("⚠️ Hatırlatma zamanı geçmişte. Bildirim planlanmadı.");
      return;
    }

    // Bildirimi planlayın
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: todo.title,
        body: `${t("Notification_2")} ${new Intl.DateTimeFormat(language, { dateStyle: 'short', timeStyle: 'short' }).format(dueDateTime)}`,
        sound: "default",
        data: { todoId: todo.id },
      },
      trigger: reminderTime,
    });

    // Bildirim ID'sini AsyncStorage'e kaydedin
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



// await Notifications.cancelAllScheduledNotificationsAsync();
