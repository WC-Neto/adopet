import { useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import Footer from "../components/Footers/Footer";
import Header from "../components/Headers/Header";
import Input from "../components/Inputs/Input";
import Button from "../components/Buttons/Button";
import { Stack, router } from "expo-router";

const debuggerHost = Constants.expoConfig?.hostUri?.split(":")[0];
const API_URL =
  Platform.OS === "web"
    ? "http://127.0.0.1:8000"
    : debuggerHost
    ? `http://${debuggerHost}:8000`
    : "http://192.168.1.179:8000";

export default function AlterarSenha() {
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleAlterarSenha = async () => {
    setErro("");
    setSucesso("");

    if (!email.trim() || !cpf.trim() || !novaSenha || !confirmarSenha) {
      setErro("Preencha todos os campos.");
      return;
    }

    const cpfNumeros = cpf.replace(/\D/g, "");
    if (cpfNumeros.length !== 11) {
      setErro("O CPF deve conter 11 dígitos numéricos.");
      return;
    }

    if (novaSenha.length < 8) {
      setErro("A nova senha deve ter no mínimo 8 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      setCarregando(true);
      const response = await fetch(`${API_URL}/usuarios/senha`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          email: email.trim(),
          cpf: cpfNumeros,
          nova_senha: novaSenha,
        }),
      });

      clearTimeout(timeoutId);
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setErro(data?.detail || "Não foi possível alterar a senha.");
        return;
      }

      setSucesso("Senha alterada com sucesso!");
      setTimeout(() => {
        router.replace("/");
      }, 1200);
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

      {/* TOP SAFE AREA */}
      <SafeAreaView edges={["top"]} className="bg-[#FAFCFF] z-10">
        <Header
          backgroundColor="#FAFCFF"
          centerContent={
            <Text className="text-lg font-bold text-[#6B0889]">ADOPET</Text>
          }
        />
      </SafeAreaView>

      {/* CONTENT BODY */}
      <ScrollView
        className="flex-1 basis-0 min-h-0 overflow-y-auto bg-[#F2EFEF]"
        style={{ flex: 1, flexBasis: 0 }}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full items-center">
          {/* ORANGE BANNER */}
          <View className="w-full h-[195px] bg-[#F09545] items-center justify-center relative overflow-hidden">
            {/* Top-left Paw */}
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

            {/* Bottom-left Paw 1 */}
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

            {/* Bottom-left Paw 2 */}
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

            {/* Top-right Paw 1 */}
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

            {/* Top-right Paw 2 */}
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

            {/* Bottom-right Paw */}
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

            {/* Banner Title */}
            <Text
              className="text-white text-[22px] font-semibold z-10 mb-[24px]"
              style={{
                textShadowColor: "rgba(0, 0, 0, 0.45)",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 3,
              }}
            >
              Alterar senha
            </Text>
          </View>

          {/* FORM CARD */}
          <View className="w-[84%] max-w-[380px] bg-white rounded-[28px] mt-[-45px] mb-[32px] px-[34px] py-[32px] shadow-md border border-[#E2DDDD] border-b-[3px] border-b-[#C8C2C2]">
            <Input
              label="Email"
              placeholder="Digite seu e-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <Input
              label="CPF"
              placeholder="Confirme seu CPF"
              value={cpf}
              onChangeText={setCpf}
              keyboardType="numeric"
            />

            <Input
              label="Nova senha"
              placeholder="Digite a nova senha"
              value={novaSenha}
              onChangeText={setNovaSenha}
              secureTextEntry
            />

            <Input
              label="Confirmar nova senha"
              placeholder="Confirme a nova senha"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry
            />

            <Text className="text-[12px] font-bold text-[#1A1A1A] text-center mt-[4px] mb-[20px] leading-[18px]">
              A senha deve ter no mínimo 8{"\n"}caracteres
            </Text>

            {erro ? (
              <Text className="text-[13px] font-semibold text-[#D92D20] text-center mb-[14px]">
                {erro}
              </Text>
            ) : null}

            {sucesso ? (
              <Text className="text-[13px] font-semibold text-[#12B76A] text-center mb-[14px]">
                {sucesso}
              </Text>
            ) : null}

            <View className="items-center mb-[24px]">
              <Button
                title={carregando ? "Salvando..." : "Redefinir"}
                backgroundColor="#262626"
                textColor="#FFFFFF"
                onPress={handleAlterarSenha}
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/")}
              className="items-center"
            >
              <Text className="text-[11px] font-bold text-[#1A1A1A] text-center underline leading-[18px]">
                Lembrou a senha?{"\n"}Voltar para o login
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* BOTTOM SAFE AREA */}
        <SafeAreaView edges={["bottom"]} className="bg-[#6B0889]">
          <Footer backgroundColor="#6B0889" />
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}
