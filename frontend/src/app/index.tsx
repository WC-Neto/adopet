import { useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Footer from "../components/Footers/Footer";
import Header from "../components/Headers/Header";
import Input from "../components/Inputs/Input";
import Button from "../components/Buttons/Button";
import { Stack, router } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../services/api";

export default function Login() {
  const { setUsuario } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async () => {
    setErro("");

    if (!email.trim() || !senha) {
      setErro("Informe o seu e-mail e a senha.");
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      setCarregando(true);
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          email: email.trim(),
          senha,
        }),
      });

      clearTimeout(timeoutId);
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setErro(data?.detail || "E-mail ou senha incorretos.");
        return;
      }

      setUsuario(data);
      router.replace("/inicio");
    } catch {
      clearTimeout(timeoutId);
      setErro(
        "Não foi possível conectar ao servidor FastAPI (127.0.0.1:8000). Verifique se o uvicorn está rodando."
      );
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View
      className="flex-1 h-full min-h-0 overflow-hidden bg-[#F09545]"
      style={{ flex: 1, height: "100%" }}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Área superior */}
      <SafeAreaView edges={["top"]} className="bg-[#FAFCFF] z-10">
        <Header
          backgroundColor="#FAFCFF"
          centerContent={
            <Text className="text-lg font-bold text-[#6B0889]">ADOPET</Text>
          }
        />
      </SafeAreaView>

      {/* Conteúdo */}
      <ScrollView
        className="flex-1 basis-0 min-h-0 overflow-y-auto bg-[#F2EFEF]"
        style={{ flex: 1, flexBasis: 0 }}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full items-center">
          {/* Faixa laranja */}
          <View className="w-full h-[195px] bg-[#F09545] items-center justify-center relative overflow-hidden">
            {/* Pata superior esquerda */}
            <View
              className="absolute top-[6px] left-[45px]"
              style={{ transform: [{ rotate: "-22deg" }] }}
            >
              <Image
                source={require("../../assets/images/logoLaranja.png")}
                className="w-[72px] h-[72px]"
                style={{ width: 72, height: 72 }}
                resizeMode="contain"
              />
            </View>

            {/* Pata inferior esquerda 1 */}
            <View
              className="absolute top-[98px] left-[-10px]"
              style={{ transform: [{ rotate: "-18deg" }] }}
            >
              <Image
                source={require("../../assets/images/logoLaranja.png")}
                className="w-[62px] h-[62px]"
                style={{ width: 62, height: 62 }}
                resizeMode="contain"
              />
            </View>

            {/* Pata inferior esquerda 2 */}
            <View
              className="absolute top-[92px] left-[68px]"
              style={{ transform: [{ rotate: "-12deg" }] }}
            >
              <Image
                source={require("../../assets/images/logoLaranja.png")}
                className="w-[62px] h-[62px]"
                style={{ width: 62, height: 62 }}
                resizeMode="contain"
              />
            </View>

            {/* Pata superior direita 1 */}
            <View
              className="absolute top-[-4px] right-[55px]"
              style={{ transform: [{ rotate: "-25deg" }] }}
            >
              <Image
                source={require("../../assets/images/logoLaranja.png")}
                className="w-[70px] h-[70px]"
                style={{ width: 70, height: 70 }}
                resizeMode="contain"
              />
            </View>

            {/* Pata superior direita 2 */}
            <View
              className="absolute top-[12px] right-[-18px]"
              style={{ transform: [{ rotate: "-20deg" }] }}
            >
              <Image
                source={require("../../assets/images/logoLaranja.png")}
                className="w-[64px] h-[64px]"
                style={{ width: 64, height: 64 }}
                resizeMode="contain"
              />
            </View>

            {/* Pata inferior direita */}
            <View
              className="absolute top-[86px] right-[32px]"
              style={{ transform: [{ rotate: "160deg" }] }}
            >
              <Image
                source={require("../../assets/images/logoLaranja.png")}
                className="w-[66px] h-[66px]"
                style={{ width: 66, height: 66 }}
                resizeMode="contain"
              />
            </View>

            {/* Título */}
            <Text
              className="text-white text-[22px] font-semibold z-10 mb-[24px]"
              style={{
                textShadowColor: "rgba(0, 0, 0, 0.45)",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 3,
              }}
            >
              Faça login
            </Text>
          </View>

          {/* Formulário */}
          <View className="w-[84%] max-w-[380px] bg-white rounded-[28px] mt-[-45px] mb-[32px] px-[34px] py-[32px] shadow-md border border-[#E2DDDD] border-b-[3px] border-b-[#C8C2C2]">
            <Input
              label="Email"
              placeholder="Digite seu e-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <Input
              label="Senha"
              placeholder="Digite sua senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/alterar-senha")}
              className="mt-[-4px] mb-[26px]"
            >
              <Text className="text-[11px] font-bold text-[#1A1A1A] underline">
                Esqueceu a senha?
              </Text>
            </TouchableOpacity>

            {erro ? (
              <Text className="text-[13px] font-semibold text-[#D92D20] text-center mb-[14px]">
                {erro}
              </Text>
            ) : null}

            <View className="items-center mb-[28px]">
              <Button
                title={carregando ? "Entrando..." : "Entrar"}
                backgroundColor="#262626"
                textColor="#FFFFFF"
                onPress={handleLogin}
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/cadastro")}
              className="items-center"
            >
              <Text className="text-[11px] font-bold text-[#1A1A1A] text-center underline leading-[18px]">
                Não tem uma conta?{"\n"}Cadastre-se agora clicando aqui
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Área inferior */}
        <SafeAreaView edges={["bottom"]} className="bg-[#6B0889]">
          <Footer backgroundColor="#6B0889" />
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}
