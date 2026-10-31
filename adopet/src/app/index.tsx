import { Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Footer from "../components/Footers/Footer";
import Header from "../components/Headers/Header";
import { Stack } from "expo-router";
import AntDesign from "@expo/vector-icons/build/AntDesign";

export default function Index() {
  return (
    
    <View className="flex-1 bg-[#F09545]">
      <Stack.Screen options={{ headerShown: false }} />

      {/* TOP SAFE AREA */}
      <SafeAreaView edges={['top']} className="bg-[#FAFCFF] z-10">
        <Header 
          backgroundColor="#FAFCFF"
          leftContent={<AntDesign name="menu" size={26} color="black" />}
          centerContent={
            
            <Text className="text-lg font-bold text-[#6B0889]">
              ADOPET
            </Text>
          }
          rightContent={
            
            <View className="flex-row">
        
              <TouchableOpacity className="bg-[#080909] p-[10px] m-[5px] rounded-[5px] shadow-lg">
            
                <Text className="text-white font-bold">Adotar</Text>
              </TouchableOpacity>   
            </View>
          }
        />
      </SafeAreaView>
      
      {/* ORANGE CONTENT BODY */}
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