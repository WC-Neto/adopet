import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import Header from "../components/Headers/Header";
import Footer from "../components/Footers/Footer";

const SOMBRA = {
  textShadowColor: "rgba(0, 0, 0, 0.3)",
  textShadowOffset: { width: 0, height: 2 },
  textShadowRadius: 2,
};

export default function Sobre() {
  return (
    <View className="flex-1 bg-[#F09545]">
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView edges={["top"]} className="bg-[#FAFCFF] z-10">
        <Header
          backgroundColor="#FAFCFF"
          leftContent={<AntDesign name="menu" size={26} color="black" />}
          centerContent={
            <Text className="text-[18px] font-bold text-[#6B0889]">ADOPET</Text>
          }
        />
      </SafeAreaView>

      <View className="flex-1 overflow-hidden bg-[#F09545]">
        <Image 
            source={require("../../assets/images/menu-bg.png")}
            contentFit="cover"
            contentPosition="center"
            style={StyleSheet.absoluteFill}
        />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          <Text
            className="text-white text-[28px] font-bold self-start ml-[20px] my-[20px]"
            style={SOMBRA}
          >
            Sobre Nós
          </Text>

          <Text
            className="text-white text-[16px] text-center mx-[15px]"
            style={SOMBRA}
          >
            O Adopet é uma ideia que surgiu com a reflexão sobre causas sociais,
            a causa dos abrigos de adoção e a realidade presenciada no meio. Mais
            do que criar um sistema funcional, a proposta do grupo também está em
            criar uma ponte entre quem pode acolher e quem precisa ser acolhido.
            {"\n\n"}
            Durante a construção deste documento, nos deparamos com questões que
            vão muito além da tecnologia. Pensamos em responsabilidade, afeto
            abandono, confiança e impacto que um sistema pode ter quando é feito
            com um propósito.
            {"\n\n"}
            Cada funcionalidade aqui descrita foi pensada com base em situações
            reais, que pedem sensibilidade e rigor ao mesmo tempo: a verificação
            dos adotantes, o cuidado no pós‐adoção, o limite de animais por
            tutor, os relatórios detalhados. Tudo foi discutido com a consciência
            de que estamos lidando com vidas.
            {"\n\n"}
            Sabemos que um sistema, por si só, não resolve problemas complexos.
            Mas acreditamos que ele possa ser parte da solução ‐ organizando,
            conectando e facilitando processos que antes eram incertos ou
            manuais.
            {"\n\n"}
            O Adopet carrega em si um propósito: aproximar pessoas dispostas a
            cuidar de animais que só precisam de uma chance.
          </Text>
        </ScrollView>
      </View>

      <SafeAreaView edges={["bottom"]} className="bg-[#6B0889]">
        <View style={{ height: 110, justifyContent: "center", overflow: "hidden" }}>
          <Footer backgroundColor="#6B0889" />
        </View>
      </SafeAreaView>
    </View>
  );
}