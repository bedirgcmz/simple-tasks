import { router, usePathname } from "expo-router";
import { View, TouchableOpacity, Text } from "react-native";

const AddTodoTabs = () => {
  const pathname = usePathname();

  return (
    <View className="flex-row justify-center mt-10">
      <TouchableOpacity
        onPress={() => router.push("/add")} 
        className={`px-4 py-2 rounded-l-md w-[50%] ${
          pathname === "/add" ? "bg-blue-500" : "bg-gray-700"
        }`}
      >
        <Text className="text-white font-bold text-center text-[12px]">Tek Seferlik</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/add/add-recurring")}
        className={`px-4 py-2 rounded-r-md w-[50%] ${
          pathname === "/add/add-recurring" ? "bg-blue-500" : "bg-gray-700"
        }`}
      >
        <Text className="text-white font-bold text-center text-[12px]">Tekrarlı</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddTodoTabs
