import { ReactNode } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import Header from "./Headers/Header";
import Footer from "./Footers/Footer";

// estrutura comum das telas do cadastro: header, faixa laranja, cartao branco e footer
export default function FormLayout({
  tituloCartao,
  children,
}: {
  tituloCartao: string;
  children: ReactNode;
}) {
  return (
    <View className="flex-1 bg-[#E8E8E8]">
      <Stack.Screen options={{ headerShown: false }} />

      {/* header */}
      <SafeAreaView edges={["top"]} className="bg-[#FAFCFF] z-10">
        <Header
          backgroundColor="#FAFCFF"
          leftContent={<AntDesign name="menu" size={26} color="black" />}
          centerContent={
            <Text className="text-lg font-bold text-[#6B0889]">ADOPET</Text>
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

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* parte laranja de cima */}
        <View className="bg-[#F09545] px-[20px] pt-[24px] pb-[60px] items-center justify-center relative overflow-hidden">
          <Image
            source={require("../../assets/images/logoLaranja.png")}
            className="absolute left-[-10px] top-[10px] w-[90px] h-[90px] opacity-30"
            resizeMode="contain"
          />
          <Image
            source={require("../../assets/images/logo2.png")}
            className="absolute right-[10px] top-[20px] w-[70px] h-[70px] opacity-20"
            resizeMode="contain"
          />
          <Text className="text-white text-[22px] font-bold text-center z-10">
            Cadastre seu pet para doação
          </Text>
        </View>

        {/* cartao do formulario */}
        <View className="mx-[16px] mt-[-40px] bg-white rounded-[16px] p-[20px] shadow-lg">
          <Text className="text-[#6B0889] text-[20px] font-bold mb-[16px]">
            {tituloCartao}
          </Text>
          {children}
        </View>
      </ScrollView>

      {/* footer */}
      <SafeAreaView edges={["bottom"]} className="bg-[#6B0889]">
        <Footer backgroundColor="#6B0889" />
      </SafeAreaView>
    </View>
  );
}
