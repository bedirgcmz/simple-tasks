import * as Notifications from "expo-notifications";
import moment from "moment-timezone"; // moment-timezone'ı kullandık
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "scheduledNotifications";

Notifications.addNotificationReceivedListener(async (notification) => {
  console.log("📩 Received Notification:", notification);
  
  const notificationId = notification.request.identifier;
  
  console.log(`❌ Canceling Notification: ${notificationId}`);
  
  // Bildirimi Expo'dan tamamen kaldır
  await Notifications.cancelScheduledNotificationAsync(notificationId);
});


export async function scheduleNotification(todo, t) {

  if (!todo || !todo.dueDate || !todo.dueTime || !todo.reminderTime) {
    console.log("❌ Invalid todo data:", todo);
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
    console.log("❌ Invalid reminder time:", todo.reminderTime);
    return;
  }

  // console.log("✅ Valid todo data, processing notification...");
  // console.log("Raw dueDate from todo:", todo.dueDate);
  // console.log("Raw dueTime from todo:", todo.dueTime);

  try {
    // console.log("🛠 Creating moment object...");
    const localTimeZone = moment.tz.guess();
    const todoDateTime = moment.tz(`${todo.dueDate} ${todo.dueTime}`, "YYYY-MM-DD HH:mm:ss", localTimeZone);
    const reminderTime = todoDateTime.subtract(reminderMinutes, "minutes");

    // console.log("🕒 Formatted Todo DateTime (Local):", todoDateTime.format("YYYY-MM-DD HH:mm:ss"));
    // console.log("🔔 Reminder Time (Local):", reminderTime.format("YYYY-MM-DD HH:mm:ss"));
    // console.log("⏳ Current Time (Local):", moment().format("YYYY-MM-DD HH:mm:ss"));

    const timeDiffSeconds = reminderTime.diff(moment(), "seconds");

    let notificationId;
    if (timeDiffSeconds <= 0) {
      // console.log("⚠️ Reminder time is in the past or now. Sending immediate notification.");
      notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: todo.title,
          body: `${t("Notification_1")} ${todo.dueDate.split("T")[0]} / ${todo.dueTime}`,
          sound: "default",
          data: { todoId: todo.id },
        },
        trigger: null, // Anında gönder
      });
    } else {
      // console.log(`🕒 Scheduling notification in ${timeDiffSeconds} seconds`);
      notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: todo.title,
          body: `${t("Notification_2")} ${todo.dueDate.split("T")[0]} / ${todo.dueTime}`,
          sound: "default",
          data: { todoId: todo.id },
        },
        trigger: {
          seconds: timeDiffSeconds,
          repeats: false,
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        },
      });
    }

    // console.log("🔹 Kaydedilecek Notification ID:", notificationId, "for todo:", todo.id);

    // 📌 **Bildirim ID’sini AsyncStorage içine kaydet**
    const storedNotifications = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY)) || {};
    storedNotifications[todo.id] = notificationId;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storedNotifications));

    // console.log("✅ AsyncStorage’e Kaydedilen Bildirimler:", await AsyncStorage.getItem(STORAGE_KEY));

    setTimeout(async () => {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      // console.log("📋 Currently Scheduled Notifications:", JSON.stringify(scheduledNotifications, null, 2));
    }, 5000);

  } catch (error) {
    console.log("❌ Error in scheduleNotification:", error);
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
