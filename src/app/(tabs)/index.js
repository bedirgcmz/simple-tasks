import { View, Text, Pressable, Image, Button, ImageBackground, StatusBar } from "react-native";
import React, { useEffect } from "react";
import { Link, router } from "expo-router";
import Header from "../../components/Header";
import ChartSection from "../../components/ChartSection";
import CategoriesReport from "../../components/CategoriesReport";

const HomeScreen = () => {
 
  return (
    

    <ImageBackground source={require("../../../assets/images/home-bg-2.jpg")} resizeMode="cover" className="flex-1  pt-12">
      <View className="items-center justify-between h-52 ">
        <Header />
        <ChartSection />
        {/* <Link href="/tasks/1">Go Task Page 1</Link>
        <Pressable onPress={() => router.push("/tasks/2")}> 
        <Text>Go Task Page 2</Text>
      </Pressable> */}
      </View>
      <CategoriesReport />
      <StatusBar style="light"/>
    </ImageBackground>
  );
};

export default HomeScreen;
