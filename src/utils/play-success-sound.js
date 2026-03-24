import * as Haptics from "expo-haptics";

// Haptics feedback instead of audio (expo-av causes native crash on SDK 55)
export const playSuccessSound = async () => {
  try {
    // Success pattern: medium + success haptic
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch (error) {
    console.warn("Haptics error:", error);
  }
};

export const playCorrectSound = async () => {
  try {
    // Correct pattern: light + light haptic
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Light);
  } catch (error) {
    console.warn("Haptics error:", error);
  }
};