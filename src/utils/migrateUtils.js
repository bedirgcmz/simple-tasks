
import AsyncStorage from "@react-native-async-storage/async-storage";

const MIGRATION_FLAG_KEY = "todos_migrated_once_simple_task";
const KEYS_MIGRATED_FLAG = "storage_keys_migrated_v2";

export const migrateOldTodosSafely = async (todos) => {
  try {
    const alreadyMigrated = await AsyncStorage.getItem(MIGRATION_FLAG_KEY);
    if (alreadyMigrated === "true") {
      return todos; // aynı veriyi döndür
    }

    const migrated = todos.map((todo) => ({
      ...todo,
      isRecurring: todo.isRecurring ?? false,
      repeatGroupId: todo.repeatGroupId ?? null,
      repeatDays: todo.repeatDays ?? [],
      notificationId: todo.notificationId ?? null,
    }));

    await AsyncStorage.setItem(MIGRATION_FLAG_KEY, "true");
    console.log("✅ Migration başarıyla tamamlandı.");
    return migrated;

  } catch (error) {
    console.error("❌ Migration sırasında hata:", error);
    return todos; // hata varsa eski veriyi geri döndür
  }
};

// 📌 AsyncStorage keys standardization migration (v2.0.1+)
export const migrateStorageKeys = async () => {
  try {
    const alreadyMigrated = await AsyncStorage.getItem(KEYS_MIGRATED_FLAG);
    if (alreadyMigrated === "true") return;

    // Migrate old keys to new standardized format
    const oldKeyMappings = [
      { old: "user_language_simpletask", new: "user_language" },
      { old: "user_image_simpletask", new: "user_image" },
      { old: "reminder_time_for_today", new: "app_reminder_time_for_today" },
      { old: "last_checked_day", new: "app_last_checked_day" },
      { old: "todoGroups", new: "user_todo_groups" },
      { old: "scheduledNotifications", new: "app_scheduled_notifications" },
    ];

    for (const mapping of oldKeyMappings) {
      const oldData = await AsyncStorage.getItem(mapping.old);
      if (oldData) {
        await AsyncStorage.setItem(mapping.new, oldData);
        await AsyncStorage.removeItem(mapping.old);
        console.log(`✅ Migrated: ${mapping.old} → ${mapping.new}`);
      }
    }

    await AsyncStorage.setItem(KEYS_MIGRATED_FLAG, "true");
    console.log("✅ Storage keys migration completed");
  } catch (error) {
    console.error("❌ Storage keys migration error:", error);
  }
};

