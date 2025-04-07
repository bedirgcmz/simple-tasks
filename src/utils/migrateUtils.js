
import AsyncStorage from "@react-native-async-storage/async-storage";

const MIGRATION_FLAG_KEY = "todos_migrated_once_simple_task";

export const migrateOldTodos = async (todos, setTodos, saveTodos) => {
  try {
    const alreadyMigrated = await AsyncStorage.getItem(MIGRATION_FLAG_KEY);
    if (alreadyMigrated === "true") {
      return; // ❌ Zaten yapılmış, çık.
    }

    const migrated = todos.map((todo) => ({
      ...todo,
      isRecurring: todo.isRecurring ?? false,
      repeatGroupId: todo.repeatGroupId ?? null,
      repeatDays: todo.repeatDays ?? [],
      notificationId: todo.notificationId ?? null,
    }));

    setTodos(migrated);
    await saveTodos(migrated);
    await AsyncStorage.setItem(MIGRATION_FLAG_KEY, "true"); // ✅ bir daha çalışmasın

    console.log("✅ Migration başarıyla tamamlandı. Eski todolar güncellendi.");
  } catch (error) {
    console.error("❌ Migration sırasında hata:", error);
  }
};
