import * as Device from "expo-device";
import Constants from "expo-constants";

// expo-notifications is NOT available in Expo Go on Android (SDK 53+)
const isExpoGo = Constants.executionEnvironment === "storeClient";

export async function registerForPushNotificationsAsync() {
  if (isExpoGo) {
    console.warn("⚠️ Push notifications not available in Expo Go");
    return null;
  }

  let Notifications;
  try {
    Notifications = require("expo-notifications");
  } catch (error) {
    console.warn("⚠️ expo-notifications not available:", error.message);
    return null;
  }

  let token;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Push notifications permission is required!");
      return;
    }

    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    });

    console.log("Push Notification Token:", token.data);
  } else {
    alert("Must use a physical device for Push Notifications");
  }

  return token?.data;
}
