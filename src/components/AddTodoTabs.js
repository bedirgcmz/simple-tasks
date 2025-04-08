import { View, TouchableOpacity, Text, Animated, Dimensions } from "react-native";
import { useEffect, useRef } from "react";
import { usePathname, router } from "expo-router";
import { useTodoListContext } from '../context/todos-context';

const { width } = Dimensions.get("window");

const AddTodoTabs = () => {
  const { t } = useTodoListContext();
  const pathname = usePathname();
  const isAdd = pathname === "/add";

  // Simple animation using React Native Animated API
  const translateX = useRef(new Animated.Value(isAdd ? 0 : (width * 0.9) / 2)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isAdd ? 0 : (width * 0.9) / 2,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [pathname]);

  const handleTabPress = (route) => {
    router.push(route);
  };

  return (
    <View className="mt-10 items-center">
      <View
        style={{
          width: width * 0.9,
          height: 33,
          borderRadius: 20,
          backgroundColor: "#d1d5db", // Tailwind gray-300
          overflow: "hidden",
          flexDirection: "row",
        }}
      >
        {/* Moving Indicator */}
        <Animated.View
          style={{
            position: "absolute",
            width: (width * 0.9) / 2,
            height: 33,
            borderRadius: 20,
            backgroundColor: isAdd ? "#360ca3" : "#4b5563", // blue-800 or gray-700
            transform: [{ translateX }],
          }}
        />

        {/* Tek Seferlik */}
        <TouchableOpacity
          onPress={() => handleTabPress("/add")}
          style={{ width: (width * 0.9) / 2, height: 33 }}
          className=" flex justify-center items-center"
        >
          <Text className={`font-bold ${isAdd ? "text-white" : "text-gray-800"}`}>
          {t("One_time")}
          </Text>
        </TouchableOpacity>

        {/* Tekrarlı */}
        <TouchableOpacity
          onPress={() => handleTabPress("/add/add-recurring")}
          style={{ width: (width * 0.9) / 2, height: 33 }}
          className="justify-center items-center"
        >
          <Text className={`font-bold ${!isAdd ? "text-white" : "text-gray-800"}`}>
          {t("Recurring")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddTodoTabs;
