import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CheckBox } from "react-native-elements";
import { Trash2, Edit, Plus } from "lucide-react-native";
import { useTodoListContext } from "../../context/todos-context";
import {Alert} from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { Platform } from "react-native";

const TodoApp = () => {
  const { t, language } = useTodoListContext();
  const [groups, setGroups] = useState([]);
  const [currentGroupId, setCurrentGroupId] = useState("");
  const [todoText, setTodoText] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

// 📌 Liste kelimesinin dillerdeki karşılıkları
const LIST_TRANSLATIONS = {
  en: "List",
  tr: "Liste",
  sv: "Lista",
  de: "Liste",
};

const updateGroupNamesOnLanguageChange = async (newLanguage, setGroups) => {
  try {
    const storedData = await AsyncStorage.getItem("todoGroups");
    
    if (!storedData || storedData === "[]" || storedData.trim() === "") return;

    let groups = JSON.parse(storedData);

    // 📌 Güncellenmiş grup isimlerini oluştur
    const updatedGroups = groups.map((group) => {
      return { ...group, name: LIST_TRANSLATIONS[newLanguage] || LIST_TRANSLATIONS.en };
    });

    // 📌 Güncellenmiş listeyi AsyncStorage'a kaydet
    await AsyncStorage.setItem("todoGroups", JSON.stringify(updatedGroups));

    // 📌 State güncelle 
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
    const storedData = await AsyncStorage.getItem("todoGroups");
    if (storedData) {
      setGroups(JSON.parse(storedData));
    } else {
      setGroups([{ name: t("List_1"), todos: [], id: Date.now() }]);
    }
  };

  const saveData = async (newGroups) => {
    await AsyncStorage.setItem("todoGroups", JSON.stringify(newGroups));
  };

  const addTodo = () => {
    if (todoText.trim() === "") return;
  
    let updatedGroups;
    if (editingTodo) {
      // Eğer düzenleme yapılıyorsa mevcut todo'yu güncelle
      updatedGroups = groups.map((group) =>
        group.id === currentGroupId
          ? {
              ...group,
              todos: group.todos.map((todo) =>
                todo.id === editingTodo ? { ...todo, text: todoText } : todo
              ),
            }
          : group
      );
      setEditingTodo(null); // Düzenleme tamamlandı, sıfırla
    } else {
      // Yeni todo ekleme
      const newTodo = { id: Date.now(), text: todoText, completed: false };
      updatedGroups = groups.map((group) =>
        group.id === currentGroupId
          ? { ...group, todos: [...group.todos, newTodo] }
          : group
      );
    }
  
    setGroups(updatedGroups);
    saveData(updatedGroups);
    setTodoText(""); // Input'u temizle
  };
  


  const toggleTodo = (groupId, todoId) => {
    const updatedGroups = groups.map((group) => {
      if (group.id === groupId) {
        return {
          ...group,
          todos: group.todos.map((todo) =>
            todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
          ),
        };
      }
      return group;
    });
    setGroups(updatedGroups);
    saveData(updatedGroups);
  };

  const deleteTodo = (groupId, todoId) => {
    Alert.alert(
        t("Alert_First_Text"), 
        t("Alert_Title"), 
        [
            {text: t("Alert_Confirm_Delete"), onPress:() => {
                const updatedGroups = groups.map((group) => {
                    if (group.id === groupId) {
                      return {
                        ...group,
                        todos: group.todos.filter((todo) => todo.id !== todoId),
                      };
                    }
                    return group;
                  });
                  setGroups(updatedGroups);
                  saveData(updatedGroups);
          }},
          {text: t("Alert_Cancel"), onPress:() => console.log("Didn't deleted")},
      ]
      );
  };

  const editTodo = (groupId, todoId) => {
    const group = groups.find((g) => g.id === groupId);
    const toEditTodo = group?.todos.find((todo) => todo.id === todoId);
    
    if (toEditTodo) {
      setTodoText(toEditTodo.text); // Todo metnini inputa taşı
      setEditingTodo(todoId); // Düzenlenen todo'nun ID'sini sakla
    }
  };
  

  const addGroup = () => {
    const newGroupName = t("List");
    const updatedGroups = [...groups, { name: newGroupName, todos: [], id: Date.now() }];
    setGroups(updatedGroups);
    const lastGroup = updatedGroups.at(-1); // Son elemanı al (ES2022+)
    if (lastGroup) {
        setCurrentGroupId(lastGroup.id);
    }
    saveData(updatedGroups);
  };

  const deleteList = (groupId) => () => {
      Alert.alert(
        t("Alert_First_Text"), 
        t("Alert_Title"),  
          [
              {text: t("Alert_Confirm_Delete"), onPress:() => {
                const updatedGroups = groups.filter((group) => group.id !== groupId);
                setGroups(updatedGroups);
                saveData(updatedGroups);
                if (updatedGroups.length > 0) {
                  setCurrentGroupId(updatedGroups[0].id);
                }
                else {
                  setCurrentGroupId("");
                }
            }},
            {text: t("Alert_Cancel"), onPress:() => console.log("Didn't deleted")},
        ]
        );
  };

  return (
    <LinearGradient
    colors={["#02043d", "#370979", "#009dff"]}
      style={{ flex: 1, padding: 7, justifyContent: "start" }}
    >
        <View className="p-4 pt-12 pb-[260px]">
            <Text  className="text-[#ffe5ec] text-2xl font-bold text-center mb-2">{t("Check_List")}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex flex-row mb-4">
            {groups.map((group, index) => (
            <TouchableOpacity
                key={index}
                onPress={() => setCurrentGroupId(group.id)}
                className={`px-4 mr-1 rounded-md flex items-center justify-center h-[28px] mb-3 ${
                currentGroupId === group.id ? "bg-[#3a86ff] " : "bg-[#ef476f]"
                }`}
            >
                <Text className={`${ currentGroupId === group.id ? "text-white " : "text-[#f7e1d7]" }`}>{group.name} {index + 1}</Text>
            </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={addGroup} className="flex flex-row items-center justify-center px-2 bg-[#ef476f] rounded-md h-[28px] flex items-center justify-center">
            {groups.length <= 0 && <Text className="text-white text-[13px]">{t("Create_List")}</Text>}
            <Plus color="white" size={20}/>
            </TouchableOpacity>
        </ScrollView>
        {
            groups.length <= 0 && (
            <View className="flex items-center justify-center mt-6 min-h-12">
                <Text className="text-2xl text-[#d6ccc2] text-center">{t("Create_a_list_to_get")}</Text>
            </View>
            )
        }
        <FlatList
            data={groups.find((g) => g.id === currentGroupId)?.todos || []}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
            <View className="flex-row items-center justify-between py-2 border-b border-gray-700">
                <CheckBox
                checked={item.completed}
                onPress={() => toggleTodo(currentGroupId, item.id)}
                checkedColor="tomato"
                containerStyle={{ padding: 0, margin: 0 }}
                size={18}
                
                />
                <Text className={`flex-1 ml-[-7px] pr-1 min-w-0 text-[#d6ccc2] ${item.completed ? "line-through text-gray-500" : ""}`} style={{ flex: 1, flexWrap: "wrap", minWidth: 0 }}>{item.text}</Text>
                <View className="flex flex-row items-center justify-center">
                    <TouchableOpacity className="mr-1" onPress={() => deleteTodo(currentGroupId, item.id)}>
                    <Trash2 color="#6c757d" size={16}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => editTodo(currentGroupId, item.id)}>
                    <Edit color="#6c757d" size={15} />
                    </TouchableOpacity>
                </View>
            </View>
            )}
        />

            {
                groups.length > 0 && currentGroupId && (
                    <View>
                        <TouchableOpacity className="flex-row items-center justify-center mt-2 w-auto mx-auto bg-red-500 rounded-lg px-2 py-1" 
                        onPress={deleteList(currentGroupId) }> 
                            <Text className="text-white mr-2 px-2">{t("Delete_this_list")}</Text>
                            <Trash2 color="white" size={16} />
                        </TouchableOpacity>
                        <View className="flex-row items-center justify-between rounded-lg px-2 bg-[#ffe5ec] mt-2"
                        >
                            <TextInput
                            value={todoText}
                            onChangeText={setTodoText}
                            placeholder={t("Add_an_item")}
                            className="py-3"
                            />
                            <TouchableOpacity onPress={addTodo} className="ml-2 h-6 w-6 bg-[#ff5400] rounded-full">
                            <Plus color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }
        </View>
    </LinearGradient>
  );
};

export default TodoApp;
