import React, { useState } from "react";
import { Modal, View, Text, TextInput, Button } from "react-native";

const CategoryModal = ({ isVisible, onClose, onAddCategory, setCategory, t }) => {
  const [newCategory, setNewCategory] = useState("");

const handleAdd = async () => {
  try {
    if (!newCategory.trim()) return;

    await onAddCategory(newCategory.trim(), setCategory);
    setNewCategory(""); // Giriş kutusunu sıfırla
    onClose(); // Modalı kapat
  } catch (error) {
    console.error("Error adding category:", error);
  }
};


  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, width: "80%" }}>
          <Text>{t("Enter_new_category")}</Text>
          <TextInput
            value={newCategory}
            onChangeText={setNewCategory}
            placeholder={t("Category_input_placeholder")}
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Button title={t("Cancel")} onPress={onClose} />
            <Button title={t("Create")} onPress={handleAdd} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CategoryModal;
