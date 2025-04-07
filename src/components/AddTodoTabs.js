// import { router, usePathname } from "expo-router";
// import { View, TouchableOpacity, Text } from "react-native";

// const AddTodoTabs = () => {
//   const pathname = usePathname();

//   return (
//     <View className="flex-row justify-center mt-10">
//       <TouchableOpacity
//         onPress={() => router.push("/add")} 
//         className="px-4 py-2 rounded-l-md w-[50%] bg-blue-800">
//         <Text className={`font-bold text-center text-[12px] ${
//           pathname === "/add" ? "text-white" : "text-gray-800"
//         }`}>Tek Seferlik</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         onPress={() => router.push("/add/add-recurring")}
//         className="px-4 py-2 rounded-r-md w-[50%] bg-gray-700">
//         <Text className={`font-bold text-center text-[12px] ${
//           pathname === "/add/add-recurring" ? "text-white" : "text-gray-900"
//         }`}>Tekrarlı</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default AddTodoTabs

import { View, TouchableOpacity, Text, Animated, Dimensions } from "react-native";
import { useEffect, useRef } from "react";
import { usePathname, router } from "expo-router";

const { width } = Dimensions.get("window");

const AddTodoTabs = () => {
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
          borderRadius: 25,
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
            borderRadius: 999,
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
            Tek Seferlik
          </Text>
        </TouchableOpacity>

        {/* Tekrarlı */}
        <TouchableOpacity
          onPress={() => handleTabPress("/add/add-recurring")}
          style={{ width: (width * 0.9) / 2, height: 33 }}
          className="justify-center items-center"
        >
          <Text className={`font-bold ${!isAdd ? "text-white" : "text-gray-800"}`}>
            Tekrarlı
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddTodoTabs;
