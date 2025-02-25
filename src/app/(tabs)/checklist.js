import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CheckBox } from "react-native-elements";
import { Trash2, Edit, Plus } from "lucide-react-native";
import { showConfirmAlert } from "../../utils/alerts";
import { useTodoListContext } from "../../context/todos-context";
import {Alert} from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { Platform } from "react-native";

const TodoApp = () => {
  const [groups, setGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState("Liste 1");
  const [todoText, setTodoText] = useState("");
  const [groupName, setGroupName] = useState("");
  const { t, language } = useTodoListContext();


  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const storedData = await AsyncStorage.getItem("todoGroups");
    if (storedData) {
      setGroups(JSON.parse(storedData));
    } else {
      setGroups([{ name: "Liste 1", todos: [] }]);
    }
  };

  const saveData = async (newGroups) => {
    await AsyncStorage.setItem("todoGroups", JSON.stringify(newGroups));
  };

  const addTodo = () => {
    if (todoText.trim() === "") return;
    const newTodo = { id: Date.now(), text: todoText, completed: false };
    const updatedGroups = groups.map((group) =>
      group.name === currentGroup ? { ...group, todos: [...group.todos, newTodo] } : group
    );
    setGroups(updatedGroups);
    saveData(updatedGroups);
    setTodoText("");
  };

  const toggleTodo = (groupName, todoId) => {
    const updatedGroups = groups.map((group) => {
      if (group.name === groupName) {
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

  const deleteTodo = (groupName, todoId) => {
    Alert.alert(
        "Silmek istedin", 
        "Silelim mi", 
        [
            {text: t("Alert_Confirm_Delete"), onPress:() => {
                const updatedGroups = groups.map((group) => {
                    if (group.name === groupName) {
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

  const addGroup = () => {
    const newGroupName = `Liste ${groups.length + 1}`;
    const updatedGroups = [...groups, { name: newGroupName, todos: [] }];
    setGroups(updatedGroups);
    setCurrentGroup(newGroupName);
    saveData(updatedGroups);
  };

  const deleteList = (groupName) => () => {
      Alert.alert(
          "Silmek istedin", 
          "Silelim mi", 
          [
              {text: t("Alert_Confirm_Delete"), onPress:() => {
                const updatedGroups = groups.filter((group) => group.name !== groupName);
                setGroups(updatedGroups);
                saveData(updatedGroups);
                if (updatedGroups.length > 0) {
                  setCurrentGroup(updatedGroups[0].name);
                }
                else {
                  setCurrentGroup("");
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
        <View className="p-4 pt-20 pb-[260px]">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex flex-row mb-4">
            {groups.map((group) => (
            <TouchableOpacity
                key={group.name}
                onPress={() => setCurrentGroup(group.name)}
                className={`px-4 mr-1 rounded-lg border-r-2 border-b-2 border-[#8a817c] flex items-center justify-center h-8 mb-3 ${
                currentGroup === group.name ? "bg-[#7f5539] " : "bg-[#d6ccc2]"
                }`}
            >
                <Text className={`${ currentGroup === group.name ? "text-white " : "text-gray-600" }`}>{group.name}</Text>
            </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={addGroup} className="flex flex-row items-center justify-center p-2 bg-[#ff5400] rounded-lg h-8 flex items-center justify-center">
            <Text className="text-white mt-[-3px]">{groups.length <= 0 &&  "Create List" }</Text>
            <Plus color="white" />
            </TouchableOpacity>
        </ScrollView>
        {
            groups.length <= 0 && (
            <View className="flex items-center justify-center h-12">
                <Text className="text-2xl text-[#d6ccc2] text-center">Create a list to get started</Text>
            </View>
            )
        }
        <FlatList
            data={groups.find((g) => g.name === currentGroup)?.todos || []}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
            <View className="flex-row items-center justify-between py-2 border-b border-gray-300">
                <CheckBox
                checked={item.completed}
                onPress={() => toggleTodo(currentGroup, item.id)}
                checkedColor="tomato"
                containerStyle={{ padding: 0, margin: 0 }}
                    // style={{ flex: 0 }} // Flex sıfırlanıyor
                />
                <Text className={`flex-1 mr-2 mx-2 min-w-0 text-[#d6ccc2] ${item.completed ? "line-through text-gray-500" : ""}`} style={{ flex: 1, flexWrap: "wrap", minWidth: 0 }}>{item.text}</Text>
                <TouchableOpacity onPress={() => deleteTodo(currentGroup, item.id)}>
                <Trash2 color="#ff5400" size={20}/>
                </TouchableOpacity>
            </View>
            )}
        />

            {
                groups.length > 0 && (
                    <View>
                        <TouchableOpacity className="flex-row items-center justify-center mt-4 w-auto mx-auto bg-red-500 rounded-lg px-2 py-1 mt-6 " 
                        onPress={deleteList(currentGroup) }> 
                            <Text className="text-white mr-2 px-2">Bu listeyi sil</Text>
                            <Trash2 color="white" size={16} />
                        </TouchableOpacity>
                        <View className="flex-row items-center rounded-lg px-2 bg-white mt-2"
                          style={{ paddingVertical: Platform.OS === "ios" ? 5 : 1 }} // iOS: 3px, Android: 5px
                        >
                            <TextInput
                            value={todoText}
                            onChangeText={setTodoText}
                            placeholder="Add a todo..."
                            className="flex-1"
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
