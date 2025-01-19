import { View, ImageBackground, StatusBar, ScrollView } from "react-native";
import React from "react";
import Header from "../../components/Header";
import ChartSection from "../../components/ChartSection";
import CategoriesReport from "../../components/CategoriesReport";
import Calender from "../../components/Calender";

const HomeScreen = () => {
 
  return (
    

    <ImageBackground source={require("../../../assets/images/home-bg-2.jpg")} resizeMode="cover" className="flex-1  pt-12 pb-20">
      <ScrollView className="flex-1">
        <View className="items-center justify-start h-[320px]">
          <Header />
          <ChartSection />
          <View className="items-start justify-start w-full h-[190px]">
            <CategoriesReport />
          </View>
            
        </View>
        <Calender />
      </ScrollView>
      <StatusBar style="light"
       backgroundColor="transparent"
       translucent={true}
      />
    </ImageBackground>
  );
};

export default HomeScreen;
