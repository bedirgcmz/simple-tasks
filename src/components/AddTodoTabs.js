import { View, TouchableOpacity, Text, Animated, Dimensions } from "react-native";
import { useEffect, useRef } from "react";
import { usePathname, router } from "expo-router";
import { useTodoListContext } from '../context/todos-context';

const { width } = Dimensions.get("window");

const AddTodoTabs = () => {
  const { t } = useTodoListContext();
  const pathname = usePathname();
  const isAdd = pathname === "/add";

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
    <View style={{ marginTop: 40, alignItems: 'center' }}>
      <View
        style={{
          width: width * 0.9,
          height: 40,
          borderRadius: 24,
          backgroundColor: 'rgba(255,255,255,0.10)',
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.15)',
          overflow: 'hidden',
          flexDirection: 'row',
        }}
      >
        {/* Sliding indicator */}
        <Animated.View
          style={{
            position: 'absolute',
            width: (width * 0.9) / 2,
            height: 40,
            borderRadius: 24,
            backgroundColor: isAdd ? 'rgba(96,165,250,0.32)' : 'rgba(167,139,250,0.32)',
            borderWidth: 1,
            borderColor: isAdd ? 'rgba(96,165,250,0.50)' : 'rgba(167,139,250,0.50)',
            transform: [{ translateX }],
          }}
        />

        {/* One-time tab */}
        <TouchableOpacity
          onPress={() => handleTabPress("/add")}
          style={{ width: (width * 0.9) / 2, height: 40, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={{
            fontWeight: '700',
            fontSize: 13,
            color: isAdd ? '#93c5fd' : 'rgba(255,255,255,0.45)',
            letterSpacing: 0.3,
          }}>
            {t("One_time")}
          </Text>
        </TouchableOpacity>

        {/* Recurring tab */}
        <TouchableOpacity
          onPress={() => handleTabPress("/add/add-recurring")}
          style={{ width: (width * 0.9) / 2, height: 40, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={{
            fontWeight: '700',
            fontSize: 13,
            color: !isAdd ? '#c4b5fd' : 'rgba(255,255,255,0.45)',
            letterSpacing: 0.3,
          }}>
            {t("Recurring")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddTodoTabs;
