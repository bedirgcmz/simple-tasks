import React from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { useTodoListContext } from "../context/todos-context";

const LanguageModal = ({ visible, onClose }) => {
  const { setLanguage, t } = useTodoListContext();

  const changeLanguage = (lang) => {
    setLanguage(lang);
    onClose(); // Modalı kapat
  };

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{t("change_language")}</Text>

          {["en", "tr", "sv", "de"].map((lang) => (
            <TouchableOpacity key={lang} onPress={() => changeLanguage(lang)} style={styles.button}>
              <Text style={styles.buttonText}>{lang.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginVertical: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LanguageModal;
