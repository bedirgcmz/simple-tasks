import React, { useEffect } from "react";
import { Animated, Text } from "react-native";
import { useTodoListContext } from "../context/todos-context";


const TodoDoneAnimation = () => {
    const { showCongrats, setShowCongrats } = useTodoListContext();
  const scaleAnim = new Animated.Value(0);

  useEffect(() => {
      if (showCongrats) {
            // Animasyonu başlat
            Animated.sequence([
              Animated.timing(scaleAnim, { toValue: 1, duration: 500, useNativeDriver: true }), // Görünürlük
              Animated.timing(scaleAnim, { toValue: 0, duration: 500, delay: 1000, useNativeDriver: true }), // Kaybolma
            ]).start(() => setShowCongrats(false)); // Animasyon bittiğinde sıfırla
    }
  }, [showCongrats]);

  if (!showCongrats) return null;

  return (
    <Animated.View
      className="absolute top-[50%] left-[21%] -translate-x-1/2 -translate-y-1/2 shadow-lg rounded-xl p-4 z-40"
      style={{
        transform: [{ scale: scaleAnim }],
        opacity: scaleAnim,
      }}
    >
      <Text className="text-xl font-bold text-green-500 text-center z-30">🎉 Congratulations!</Text>
    </Animated.View>
  );
};

export default TodoDoneAnimation;
