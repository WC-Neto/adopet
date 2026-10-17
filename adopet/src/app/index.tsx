import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Footer from "../components/Footers/Footer";
import Header from "../components/Headers/Header";
import Input from "../components/Inputs/Input";
import Button from "../components/Buttons/Button";
import { Stack, router } from "expo-router";
import AntDesign from "@expo/vector-icons/build/AntDesign";
import { FontAwesome5 } from "@expo/vector-icons";

export default function Index() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [sexo, setSexo] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

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
      
      {/* CONTENT BODY */}
      <ScrollView
        className="flex-1 bg-[#F2EFEF]"
        contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full items-center">
          {/* ORANGE BANNER */}
          <View className="w-full h-[195px] bg-[#F09545] items-center justify-center relative overflow-hidden">
            {/* Top-left Paw */}
            <View
              className="absolute top-[8px] left-[4px]"
              style={{ transform: [{ rotate: "-18deg" }] }}
            >
              <Image
                source={require("../../assets/images/logoLaranja.png")}
                className="w-[62px] h-[62px]"
                style={{ width: 62, height: 62 }}
                resizeMode="contain"
              />
            </View>

            {/* Bottom-left Paw */}
            <View
              className="absolute top-[92px] left-[16px]"
              style={{ transform: [{ rotate: "-12deg" }] }}
            >
              <Image
                source={require("../../assets/images/logoLaranja.png")}
                className="w-[62px] h-[62px]"
                style={{ width: 62, height: 62 }}
                resizeMode="contain"
              />
            </View>

            {/* Background Cat Silhouette */}
            <View className="absolute items-center justify-center top-[18px]">
              <FontAwesome5 name="cat" size={115} color="#E86F00" />
            </View>

            {/* Banner Title */}
            <Text
              className="text-white text-[22px] font-semibold z-10 mb-[24px]"
              style={{
                textShadowColor: "rgba(0, 0, 0, 0.35)",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 3,
              }}
            >
              Cadastre-se na Adopet
            </Text>
          </View>

          {/* FORM CARD */}
          <View className="w-[84%] max-w-[380px] bg-white rounded-[28px] mt-[-45px] mb-[32px] px-[26px] py-[26px] shadow-md border border-[#E2DDDD] border-b-[3px] border-b-[#C8C2C2]">
            <Input
              label="Nome completo"
              placeholder="Digite seu nome"
              value={nome}
              onChangeText={setNome}
            />

            <Input
              label="CPF"
              placeholder="Digite seu CPF"
              value={cpf}
              onChangeText={setCpf}
              keyboardType="numeric"
            />

            <Input
              label="Email"
              placeholder="Digite seu e-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <Input
              label="Telefone"
              placeholder="Digite seu telefone com DDD"
              value={telefone}
              onChangeText={setTelefone}
              keyboardType="phone-pad"
            />

            <Input
              label="Sexo"
              placeholder="Selecione seu sexo"
              value={sexo}
              onChangeText={setSexo}
              options={[
                "Masculino",
                "Feminino",
                "Outro",
                "Prefiro não informar",
              ]}
              rightIcon={<AntDesign name="down" size={14} color="#7A7070" />}
            />

            <Input
              label="Data de Nascimento"
              placeholder="DD/MM/AAAA"
              value={dataNascimento}
              onChangeText={setDataNascimento}
              isDate
            />

            <Input
              label="Senha"
              placeholder="Defina uma senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />

            <Input
              label="Confirmar senha"
              placeholder="Confirme sua senha"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry
            />

            <Text className="text-[12px] font-bold text-[#1A1A1A] text-center mt-[6px] mb-[20px] leading-[18px]">
              A senha deve ter no mínimo 8{"\n"}caracteres
            </Text>

            <View className="items-center">
              <Button
                title="Cadastrar"
                backgroundColor="#262626"
                textColor="#FFFFFF"
                onPress={() => router.push("/inicio")}
              />
            </View>
          </View>
        </View>

        {/* BOTTOM SAFE AREA */}
        <SafeAreaView edges={['bottom']} className="bg-[#6B0889]">
          <Footer backgroundColor="#6B0889" />
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}