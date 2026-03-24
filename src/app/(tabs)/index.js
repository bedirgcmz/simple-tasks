import { View, StatusBar, ScrollView } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../../components/Header";
import ChartSection from "../../components/ChartSection";
import CategoriesReport from "../../components/CategoriesReport";
import Calender from "../../components/Calender";

const HomeScreen = () => {
  return (
    <LinearGradient
      colors={["#07051a", "#130b30", "#0b1a45"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.4, y: 1 }}
      style={{ flex: 1, paddingTop: 40 }}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }}>
        <Header />
        <ChartSection />
        <CategoriesReport />
        <Calender />
      </ScrollView>
    </LinearGradient>
  );
};

export default HomeScreen;
