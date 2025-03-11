import React from "react";
import { Modal, View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { useTodoListContext } from "../context/todos-context";

const UserCategoriesModal = ({ isVisible, onClose, t }) => {
  const { userCategories, deleteUserCategory } = useTodoListContext();

  const handleDeleteCategory = (category) => {
    Alert.alert(
      t("Alert_First_Text"),
      `"${category}" ${t("Confirm_Delete_Category")}`,
      [
        { text: t("Cancel"), style: "cancel" },
        {
          text: t("Delete_button"),
          onPress: () => deleteUserCategory(category),
          style: "destructive",
        },
      ]
    );
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, width: "80%" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            {t("Personal_Categories")}
          </Text>

          {userCategories.length === 0 ? (
            <Text>{t("No_Categories_Found")}</Text>
          ) : (
            <FlatList
              data={userCategories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 }}>
                  <Text style={{ fontSize: 16 }}>{item}</Text>
                  <TouchableOpacity onPress={() => handleDeleteCategory(item)}>
                    <Text style={{ color: "red", fontSize: 16 }}>🗑</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}

          <TouchableOpacity onPress={onClose} style={{ marginTop: 20, alignSelf: "center" }}>
            <Text style={{ color: "blue", fontSize: 16 }}>{t("Close")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default UserCategoriesModal;
