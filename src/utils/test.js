// utils/debugUtils.js
import * as Notifications from "expo-notifications";

export const testNotificationLog = async (todos) => {
  try {
    console.log("🧪 testNotificationLog başladı...");

    const activeNotificationCount = todos.filter(todo => todo.notificationId).length;
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();

    const expoNotificationCount = scheduled.length;

    console.log("📦 TODOS lenght:", todos.length);
    console.log("📦 TODOS içinde bildirimi olan:", activeNotificationCount);
    console.log("📱 Expo'da planlanmış bildirim:", expoNotificationCount);

    // 🧾 Planlı bildirim ID'lerini detaylı logla
    if (scheduled.length > 0) {
      console.log("📋 Expo Planlı Bildirim ID'leri:");
      scheduled.forEach((notif, index) => {
        console.log(`  ${index + 1}. ID: ${notif.identifier}`);
      });
    }

    if (activeNotificationCount !== expoNotificationCount) {
      console.warn("⚠️ Bildirim sayılarında uyuşmazlık var!");
    } else {
      console.log("✅ Bildirim sayıları eşleşiyor.");
    }

  } catch (error) {
    console.error("❌ testNotificationLog içinde hata:", error);
  }
};
