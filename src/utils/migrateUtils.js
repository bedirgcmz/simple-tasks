
import AsyncStorage from "@react-native-async-storage/async-storage";

const MIGRATION_FLAG_KEY = "todos_migrated_once_simple_task";

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
