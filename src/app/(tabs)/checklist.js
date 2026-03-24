import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CheckBox } from "react-native-elements";
import { Trash2, Edit, Plus } from "lucide-react-native";
import { useTodoListContext } from "../../context/todos-context";
import { LinearGradient } from "expo-linear-gradient";

const STORAGE_KEY = "user_todo_groups";

const TodoApp = () => {
  const { t, language } = useTodoListContext();
  const [groups, setGroups] = useState([]);
  const [currentGroupId, setCurrentGroupId] = useState("");
  const [todoText, setTodoText] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => { loadData(); }, []);

  const LIST_TRANSLATIONS = { en: "List", tr: "Liste", sv: "Lista", de: "Liste" };

  const updateGroupNamesOnLanguageChange = async (newLanguage, setGroups) => {
    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (!storedData || storedData === "[]" || storedData.trim() === "") return;
      let groups = JSON.parse(storedData);
      const updatedGroups = groups.map((group) => ({
        ...group,
        name: LIST_TRANSLATIONS[newLanguage] || LIST_TRANSLATIONS.en,
      }));
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedGroups));
      setGroups(updatedGroups);
      setCurrentGroupId(updatedGroups[0].id);
    } catch (error) {
      console.error("❌ Error updating group names:", error);
    }
  };

  useEffect(() => {
    updateGroupNamesOnLanguageChange(language, setGroups);
  }, [language]);

  const loadData = async () => {
    const storedData = await AsyncStorage.getItem(STORAGE_KEY);
    if (storedData) {
      setGroups(JSON.parse(storedData));
    } else {
      setGroups([{ name: t("List_1"), todos: [], id: Date.now() }]);
    }
  };

  const saveData = async (newGroups) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newGroups));
  };

  const addTodo = () => {
    if (todoText.trim() === "") return;
    let updatedGroups;
    if (editingTodo) {
      updatedGroups = groups.map((group) =>
        group.id === currentGroupId
          ? { ...group, todos: group.todos.map((todo) => todo.id === editingTodo ? { ...todo, text: todoText } : todo) }
          : group
      );
      setEditingTodo(null);
    } else {
      const newTodo = { id: Date.now(), text: todoText, completed: false };
      updatedGroups = groups.map((group) =>
        group.id === currentGroupId
          ? { ...group, todos: [...group.todos, newTodo] }
          : group
      );
    }
    setGroups(updatedGroups);
    saveData(updatedGroups);
    setTodoText("");
  };

  const toggleTodo = (groupId, todoId) => {
    const updatedGroups = groups.map((group) =>
      group.id === groupId
        ? { ...group, todos: group.todos.map((todo) => todo.id === todoId ? { ...todo, completed: !todo.completed } : todo) }
        : group
    );
    setGroups(updatedGroups);
    saveData(updatedGroups);
  };

  const deleteTodo = (groupId, todoId) => {
    Alert.alert(t("Alert_First_Text"), t("Alert_Title"), [
      { text: t("Alert_Confirm_Delete"), onPress: () => {
        const updatedGroups = groups.map((group) =>
          group.id === groupId
            ? { ...group, todos: group.todos.filter((todo) => todo.id !== todoId) }
            : group
        );
        setGroups(updatedGroups);
        saveData(updatedGroups);
      }},
      { text: t("Alert_Cancel") },
    ]);
  };

  const editTodo = (groupId, todoId) => {
    const group = groups.find((g) => g.id === groupId);
    const toEditTodo = group?.todos.find((todo) => todo.id === todoId);
    if (toEditTodo) {
      setTodoText(toEditTodo.text);
      setEditingTodo(todoId);
    }
  };

  const addGroup = () => {
    const updatedGroups = [...groups, { name: t("List"), todos: [], id: Date.now() }];
    setGroups(updatedGroups);
    const lastGroup = updatedGroups.at(-1);
    if (lastGroup) setCurrentGroupId(lastGroup.id);
    saveData(updatedGroups);
  };

  const deleteList = (groupId) => () => {
    Alert.alert(t("Alert_First_Text"), t("Alert_Title"), [
      { text: t("Alert_Confirm_Delete"), onPress: () => {
        const updatedGroups = groups.filter((group) => group.id !== groupId);
        setGroups(updatedGroups);
        saveData(updatedGroups);
        setCurrentGroupId(updatedGroups.length > 0 ? updatedGroups[0].id : "");
      }},
      { text: t("Alert_Cancel") },
    ]);
  };

  return (
    <LinearGradient
      colors={["#02043d", "#370979", "#009dff"]}
      style={{ flex: 1, padding: 7, justifyContent: "flex-start" }}
    >
      <View style={{ padding: 16, paddingTop: 48, paddingBottom: 260 }}>

        {/* ── Page Title ── */}
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800', textAlign: 'center', marginBottom: 16 }}>
          {t("Check_List")}
        </Text>

        {/* ── List Tabs ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            {groups.map((group, index) => {
              const isActive = currentGroupId === group.id;
              return (
                <TouchableOpacity
                  key={group.id}
                  onPress={() => setCurrentGroupId(group.id)}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 6,
                    borderRadius: 20,
                    backgroundColor: isActive ? 'rgba(96,165,250,0.28)' : 'rgba(255,255,255,0.10)',
                    borderWidth: 1,
                    borderColor: isActive ? 'rgba(96,165,250,0.55)' : 'rgba(255,255,255,0.18)',
                  }}
                >
                  <Text style={{
                    color: isActive ? '#93c5fd' : 'rgba(255,255,255,0.60)',
                    fontWeight: isActive ? '700' : '500',
                    fontSize: 13,
                  }}>
                    {group.name} {index + 1}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {/* Add list button */}
            <TouchableOpacity
              onPress={addGroup}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
                backgroundColor: 'rgba(167,139,250,0.20)',
                borderWidth: 1,
                borderColor: 'rgba(167,139,250,0.40)',
              }}
            >
              {groups.length <= 0 && (
                <Text style={{ color: '#c4b5fd', fontSize: 12, fontWeight: '600' }}>
                  {t("Create_List")}
                </Text>
              )}
              <Plus color="#c4b5fd" size={16} />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* ── Empty state ── */}
        {groups.length <= 0 && (
          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 24 }}>
            <Text style={{ color: 'rgba(255,255,255,0.50)', fontSize: 18, textAlign: 'center' }}>
              {t("Create_a_list_to_get")}
            </Text>
          </View>
        )}

        {/* ── Todo items ── */}
        <FlatList
          data={groups.find((g) => g.id === currentGroupId)?.todos || []}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 10,
              paddingHorizontal: 4,
              borderBottomWidth: 1,
              borderBottomColor: 'rgba(255,255,255,0.08)',
            }}>
              <CheckBox
                checked={item.completed}
                onPress={() => toggleTodo(currentGroupId, item.id)}
                checkedColor="#60a5fa"
                uncheckedColor="rgba(255,255,255,0.35)"
                containerStyle={{
                  padding: 0,
                  margin: 0,
                  marginRight: 8,
                  backgroundColor: 'transparent',
                  borderWidth: 0,
                  alignSelf: 'center',
                }}
                size={20}
              />
              <Text style={{
                flex: 1,
                color: item.completed ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.90)',
                textDecorationLine: item.completed ? 'line-through' : 'none',
                fontSize: 15,
                flexWrap: 'wrap',
                minWidth: 0,
                marginRight: 8,
              }}>
                {item.text}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <TouchableOpacity onPress={() => deleteTodo(currentGroupId, item.id)}>
                  <Trash2 color="rgba(248,113,113,0.70)" size={16} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => editTodo(currentGroupId, item.id)}>
                  <Edit color="rgba(147,197,253,0.70)" size={15} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        {/* ── Bottom actions (visible only when a list exists) ── */}
        {groups.length > 0 && currentGroupId && (
          <View style={{ marginTop: 12, gap: 10 }}>

            {/* Delete list button */}
            <TouchableOpacity
              onPress={deleteList(currentGroupId)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                gap: 6,
                paddingHorizontal: 16,
                paddingVertical: 7,
                borderRadius: 20,
                backgroundColor: 'rgba(248,113,113,0.15)',
                borderWidth: 1,
                borderColor: 'rgba(248,113,113,0.35)',
              }}
            >
              <Text style={{ color: '#fca5a5', fontWeight: '600', fontSize: 13 }}>
                {t("Delete_this_list")}
              </Text>
              <Trash2 color="#fca5a5" size={14} />
            </TouchableOpacity>

            {/* Add item input row */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              backgroundColor: 'rgba(255,255,255,0.08)',
              borderWidth: 1,
              borderColor: editingTodo
                ? 'rgba(251,191,36,0.40)'
                : 'rgba(255,255,255,0.18)',
              borderRadius: 14,
              paddingHorizontal: 12,
              paddingVertical: 2,
            }}>
              <TextInput
                value={todoText}
                onChangeText={setTodoText}
                placeholder={t("Add_an_item")}
                placeholderTextColor="rgba(255,255,255,0.30)"
                style={{
                  flex: 1,
                  color: 'white',
                  fontSize: 15,
                  paddingVertical: 11,
                }}
              />
              <TouchableOpacity
                onPress={addTodo}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  backgroundColor: editingTodo
                    ? 'rgba(251,191,36,0.25)'
                    : 'rgba(251,146,60,0.30)',
                  borderWidth: 1,
                  borderColor: editingTodo
                    ? 'rgba(251,191,36,0.50)'
                    : 'rgba(251,146,60,0.55)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Plus color={editingTodo ? '#fde68a' : '#fb923c'} size={18} />
              </TouchableOpacity>
            </View>

          </View>
        )}
      </View>
    </LinearGradient>
  );
};

export default TodoApp;
