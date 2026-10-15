import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import Header from "../components/Headers/Header"; 
import Footer from "../components/Footers/Footer";
import { AntDesign } from '@expo/vector-icons';

export default function Inicio() {
  return (
    <View className="flex-1 bg-[#F09545]">
      {/* TOP SAFE AREA */}
      <SafeAreaView edges={['top']} className="bg-[#FAFCFF] z-10">
        <Stack.Screen options={{ headerShown: false }} />
        <Header 
          backgroundColor="#FAFCFF"
          leftContent={<AntDesign name="menu" size={26} color="black" />}
          centerContent={<Text className="text-[18px] font-bold text-[#6B0889]">ADOPET</Text>}
        />
      </SafeAreaView>
      
      {/* CONTENT BLOCK */}
      <View className="flex-1 items-center justify-center bg-[#F09545]">
        <Text>Edit src/app/index.tsx to edit this screen.</Text>
      </View>  

      {/* BOTTOM SAFE AREA */}
      <SafeAreaView edges={['bottom']} className="bg-[#6B0889]">
        <Footer backgroundColor="#6B0889" />
      </SafeAreaView>
    </View>
  );
}