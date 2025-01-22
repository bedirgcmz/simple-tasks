import React, { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTodoListContext } from './../../context/todos-context';
import { View } from 'react-native';

const TabsLayout = () => {
  const { todos } = useTodoListContext(); // Context'ten todos alınıyor
  const [todayToDos, setTodayToDos] = useState([])

  const today = new Date().toISOString().split('T')[0]; // Bugünün tarihi
 

  useEffect(() => {
    const findTodayToDos = todos.filter(
      (todo) => todo.dueDate.split('T')[0] === today && todo.status === "pending"
    );
    setTodayToDos(findTodayToDos)
  }, [todos])

  console.log(todayToDos.length);

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "index") {
            iconName = focused ? "home" : "home-outline";
            return <Ionicons name={iconName} size={size} color={color} />
          } else if (route.name === "list") {
            iconName = focused ? "calendar-number" : "calendar-number-outline";
            return (
              <View className="relative">
                {/* Asıl İkon */}
                <Ionicons name={iconName} size={size} color={color} />
                {/* Kırmızı Nokta */}
                {todayToDos.length > 0 && (
                  <View
                    className="absolute top-0 right-0 h-2 w-2 bg-[#ff5400] rounded-full"
                    style={{ transform: [{ translateX: 6 }, { translateY: -6 }] }} // Noktayı daha iyi konumlandırma
                  />
                )}
              </View>
            )
            // iconName = focused ? "list-circle" : "list-circle-outline";
          } else if (route.name === "add") {
            iconName = focused ? "add-circle" : "add-circle-outline";
            return <Ionicons name={iconName} size={size} color={color} />
          } else if (route.name === "filter") {
            iconName = focused ? "filter-circle" : "filter-circle-outline";
            return <Ionicons name={iconName} size={size} color={color} />
          }

          // return <Ionicons name={iconName} size={size} color={color} />
        },
    
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#0d1b2a", // Tab bar arka plan rengi
          height: 45, // Tab bar yüksekliği
          position: "absolute",
          bottom: 20, // Tab barın alt kenarı
          borderWidth: 1,
          borderTopWidth: 0.5, // Tab barın üstündeki sınır
          borderTopColor: "#adb5bd", // Sınır rengi
          borderColor: "#495057", // Sınır rengi
          shadowColor: "#fff", // Gölge rengi
          shadowOpacity: 0.2, // Gölge opaklığı
          shadowRadius: 10, // Gölge yayılımı
          elevation: 5, // Android için gölge
          marginHorizontal: 90,
          paddingHorizontal: 10,
          paddingVertical: 8,
          borderRadius: 50, // Yuvarlak köşeler
        },
        tabBarLabelStyle: {
          fontSize: 12, // Tab etiketi font boyutu
          fontWeight: "600", // Font ağırlığı
          marginBottom: 5, // Tab ikonu ile metin arasındaki mesafe
        },
        tabBarIconStyle: {
          marginTop: 2, // İkonun yukarıdaki mesafesi
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          headerTitle: "Home",
          tabBarLabel: "Home",
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          headerShown: false,
          headerTitle: "List By Days Todo",
          tabBarLabel: "List",
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          headerShown: false,
          headerTitle: "Add New Todo",
          tabBarLabel: "Add",
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="dynamicid"
        options={{
          href: null,
          headerShown: false,
          headerTitle: "Dynamic Id PAge",
          tabBarLabel: "Dynamic Id",
          tabBarShowLabel: false,
          // tabBarStyle: { display: "none" },
          
        }}
      />
      <Tabs.Screen
        name="dynamicday"
        options={{
          href: null,
          headerShown: false,
          headerTitle: "Dynamic Id Day",
          tabBarLabel: "Dynamic Id",
          tabBarShowLabel: false,
          // tabBarStyle: { display: "none" },
          
        }}
      />
      <Tabs.Screen
        name="filter"
        options={{
          // href: null,
          headerShown: false,
          headerTitle: "Filter",
          tabBarLabel: "Filter",
          tabBarShowLabel: false,
          // tabBarStyle: { display: "none" },
          
        }}
      />
      <Tabs.Screen
        name="edit/[id]"
        options={{
          href: null,
          headerShown: false,
          headerTitle: "Filter",
          tabBarLabel: "Filter",
          tabBarShowLabel: false,
          // tabBarStyle: { display: "none" },
          
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
