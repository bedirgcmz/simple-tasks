import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Modal, View, Text, TextInput, Button, Touchable } from "react-native";

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
            maxLength={18}
          />
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <TouchableOpacity  onPress={onClose} >
            <Text className="bg-gray-400 text-white px-3 py-1 rounded-md">{t("Cancel")}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAdd} >
            <Text className="bg-red-400 text-white px-3 py-1 rounded-md">{t("Create")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CategoryModal;
