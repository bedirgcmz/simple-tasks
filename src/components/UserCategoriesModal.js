import React from "react";
import { Modal, View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
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
    <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onClose}>
      {/* Backdrop */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'center', alignItems: 'center' }}
      >
        {/* Card — stop propagation */}
        <TouchableOpacity activeOpacity={1} onPress={() => {}} style={{ width: '82%' }}>
          <View style={{
            borderRadius: 20,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.14)',
            shadowColor: '#000',
            shadowOpacity: 0.6,
            shadowRadius: 24,
            shadowOffset: { width: 0, height: 10 },
            elevation: 16,
          }}>
            <LinearGradient
              colors={['#130b30', '#0b1a45']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={{ borderRadius: 20 }}
            >
              {/* Header */}
              <View style={{ alignItems: 'center', paddingTop: 28, paddingHorizontal: 20, paddingBottom: 16 }}>
                <View style={{
                  width: 56, height: 56, borderRadius: 28,
                  backgroundColor: 'rgba(96,165,250,0.14)',
                  borderWidth: 1.5, borderColor: 'rgba(96,165,250,0.40)',
                  alignItems: 'center', justifyContent: 'center',
                  marginBottom: 14,
                  shadowColor: '#60a5fa', shadowOpacity: 0.30, shadowRadius: 12, shadowOffset: { width: 0, height: 0 },
                }}>
                  <Ionicons name="folder-open-outline" size={26} color="#93c5fd" />
                </View>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '800', textAlign: 'center' }}>
                  {t("Personal_Categories")}
                </Text>
              </View>

              {/* Divider */}
              <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.07)', marginHorizontal: 16 }} />

              {/* List */}
              <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8, minHeight: 60, maxHeight: 260 }}>
                {userCategories.length === 0 ? (
                  <View style={{ alignItems: 'center', paddingVertical: 20, gap: 8 }}>
                    <Ionicons name="folder-outline" size={32} color="rgba(255,255,255,0.20)" />
                    <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
                      {t("No_Categories_Found")}
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    data={userCategories}
                    keyExtractor={(item) => item}
                    scrollEnabled={userCategories.length > 5}
                    renderItem={({ item, index }) => (
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.10)',
                        borderRadius: 12,
                        paddingHorizontal: 12,
                        paddingVertical: 11,
                        marginBottom: index === userCategories.length - 1 ? 0 : 8,
                      }}>
                        <Ionicons name="pricetag-outline" size={14} color="rgba(255,255,255,0.35)" style={{ marginRight: 10 }} />
                        <Text style={{ flex: 1, color: 'white', fontSize: 14, fontWeight: '500' }}>
                          {item}
                        </Text>
                        <TouchableOpacity
                          onPress={() => handleDeleteCategory(item)}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          style={{
                            backgroundColor: 'rgba(239,68,68,0.15)',
                            borderWidth: 1,
                            borderColor: 'rgba(239,68,68,0.30)',
                            borderRadius: 8,
                            padding: 5,
                          }}
                        >
                          <Ionicons name="trash-outline" size={14} color="#f87171" />
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                )}
              </View>

              {/* Close button */}
              <View style={{ padding: 16, paddingTop: 8 }}>
                <TouchableOpacity
                  onPress={onClose}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.18)',
                    borderRadius: 14,
                    paddingVertical: 13,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <Ionicons name="close" size={16} color="rgba(255,255,255,0.70)" />
                  <Text style={{ color: 'rgba(255,255,255,0.70)', fontSize: 14, fontWeight: '600' }}>
                    {t("Close")}
                  </Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default UserCategoriesModal;
