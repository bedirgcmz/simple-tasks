import { Audio } from "expo-av";

export const playSuccessSound = async () => {
  try {
    const { sound } = await Audio.Sound.createAsync(require("../../assets/sounds/success.mp3"));
    await sound.playAsync();
  } catch (error) {
    console.error("Ses çalınırken bir hata oluştu:", error);
  }
};



export const playCorrectSound = async () => {
  try {
    const { sound } = await Audio.Sound.createAsync(require("../../assets/sounds/correct.mp3"));
    await sound.playAsync();
  } catch (error) {
    console.error("Ses çalınırken bir hata oluştu:", error);
  }
};


