import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

const CategoryModal = ({ isVisible, onClose, onAddCategory, setCategory, t }) => {
  const [newCategory, setNewCategory] = useState("");

  const handleAdd = async () => {
    try {
      if (!newCategory.trim()) return;
      await onAddCategory(newCategory.trim(), setCategory);
      setNewCategory("");
      onClose();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleClose = () => {
    setNewCategory("");
    onClose();
  };

  return (
    <Modal visible={isVisible} transparent animationType="fade" onRequestClose={handleClose}>
      {/* Backdrop */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleClose}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'center', alignItems: 'center' }}
      >
        {/* Card — stop propagation */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ width: '82%' }}>
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
                <View style={{ alignItems: 'center', paddingTop: 28, paddingHorizontal: 20, paddingBottom: 20 }}>
                  {/* Icon glow ring */}
                  <View style={{
                    width: 56, height: 56, borderRadius: 28,
                    backgroundColor: 'rgba(167,139,250,0.14)',
                    borderWidth: 1.5, borderColor: 'rgba(167,139,250,0.40)',
                    alignItems: 'center', justifyContent: 'center',
                    marginBottom: 14,
                    shadowColor: '#a78bfa', shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 0 },
                  }}>
                    <Ionicons name="folder-open-outline" size={26} color="#c4b5fd" />
                  </View>

                  <Text style={{ color: 'white', fontSize: 16, fontWeight: '800', textAlign: 'center', marginBottom: 4 }}>
                    {t("Enter_new_category")}
                  </Text>
                </View>

                {/* Divider */}
                <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.07)', marginHorizontal: 16 }} />

                {/* Input */}
                <View style={{ paddingHorizontal: 16, paddingTop: 18, paddingBottom: 8 }}>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.15)',
                    borderRadius: 14,
                    paddingHorizontal: 12,
                    gap: 8,
                  }}>
                    <Ionicons name="pricetag-outline" size={15} color="rgba(255,255,255,0.35)" />
                    <TextInput
                      value={newCategory}
                      onChangeText={setNewCategory}
                      placeholder={t("Category_input_placeholder")}
                      placeholderTextColor="rgba(255,255,255,0.30)"
                      maxLength={18}
                      autoFocus
                      style={{ flex: 1, color: 'white', paddingVertical: 13, fontSize: 15 }}
                    />
                    {newCategory.length > 0 && (
                      <TouchableOpacity onPress={() => setNewCategory("")}>
                        <Ionicons name="close-circle" size={16} color="rgba(255,255,255,0.35)" />
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text style={{ color: 'rgba(255,255,255,0.28)', fontSize: 11, textAlign: 'right', marginTop: 4 }}>
                    {newCategory.length}/18
                  </Text>
                </View>

                {/* Buttons */}
                <View style={{ flexDirection: 'row', gap: 10, padding: 16, paddingTop: 8 }}>
                  {/* Cancel */}
                  <TouchableOpacity
                    onPress={handleClose}
                    style={{
                      flex: 1,
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)',
                      borderRadius: 14, paddingVertical: 13,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: 'rgba(255,255,255,0.70)', fontSize: 14, fontWeight: '600' }}>
                      {t("Cancel")}
                    </Text>
                  </TouchableOpacity>

                  {/* Create */}
                  <View style={{ flex: 1, borderRadius: 14, overflow: 'hidden' }}>
                    <LinearGradient
                      colors={['#fb923c', '#ea580c']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{ borderRadius: 14 }}
                    >
                      <TouchableOpacity
                        onPress={handleAdd}
                        style={{ paddingVertical: 13, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 }}
                      >
                        <Ionicons name="add" size={16} color="white" />
                        <Text style={{ color: 'white', fontSize: 14, fontWeight: '700' }}>
                          {t("Create")}
                        </Text>
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default CategoryModal;
