import React from "react";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "index") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "list") {
            iconName = focused ? "list-circle" : "list-circle-outline";
          } else if (route.name === "add") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "filter") {
            iconName = focused ? "filter-circle" : "filter-circle-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />},
    
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
          marginHorizontal: 100,
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
    </Tabs>
  );
};

export default TabsLayout;
