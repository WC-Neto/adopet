import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, router } from "expo-router";
import Constants from "expo-constants";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Header from "../components/Headers/Header";
import Footer from "../components/Footers/Footer";
import { useAuth } from "../context/AuthContext";

// endereco da api
const debuggerHost = Constants.expoConfig?.hostUri?.split(":")[0];
const API_URL =
  Platform.OS === "web"
    ? "http://127.0.0.1:8000"
    : debuggerHost
      ? `http://${debuggerHost}:8000`
      : "http://192.168.1.179:8000";

// opcoes dos selects
const especies = ["Cachorro", "Gato", "Outro"];
const portes = ["Pequeno", "Médio", "Grande"];
const sexos = ["Macho", "Fêmea"];

export default function CadastroPet() {
  const { usuario } = useAuth();
  // dados do formulario
  const [nome, setNome] = useState("");
  const [apelido, setApelido] = useState("");
  const [especie, setEspecie] = useState("");
  const [porte, setPorte] = useState("");
  const [sexo, setSexo] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [idadeDesconhecida, setIdadeDesconhecida] = useState(false);
  const [foto, setFoto] = useState<string | null>(null);

  // pra abrir/fechar os selects
  const [abrirEspecie, setAbrirEspecie] = useState(false);
  const [abrirPorte, setAbrirPorte] = useState(false);
  const [abrirSexo, setAbrirSexo] = useState(false);

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  // escolhe foto da galeria
  const escolherFoto = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissao.granted) {
      Alert.alert("Permissão", "Precisa liberar o acesso às fotos.");
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!resultado.canceled) {
      setFoto(resultado.assets[0].uri);
    }
  };

  // salva o pet na api
  const handleContinuar = async () => {
    setErro("");

    if (!nome.trim() || !especie || !porte || !sexo) {
      setErro("Preencha nome, espécie, porte e sexo.");
      return;
    }

    if (!foto) {
      setErro("Escolha uma foto do pet.");
      return;
    }

    if (!idadeDesconhecida && !dataNascimento.trim()) {
      setErro("Informe a data ou marque que não sabe a idade.");
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      setCarregando(true);

      const response = await fetch(`${API_URL}/animais`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          nome: nome.trim(),
          apelido: apelido.trim() || null,
          foto_url: foto,
          especie,
          porte,
          sexo,
          dt_nascimento: idadeDesconhecida ? null : dataNascimento.trim(),
          id_responsavel: usuario?.id_usuario ?? 1,
        }),
      });

      clearTimeout(timeoutId);
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const detalhe = data?.detail;
        setErro(
          typeof detalhe === "string"
            ? detalhe
            : "Erro ao cadastrar o pet."
        );
        return;
      }

      // cadastrou, vai pra inicio
      router.push("/inicio");
    } catch (e: any) {
      clearTimeout(timeoutId);
      // se demorar muito provavelmente e o banco
      if (e?.name === "AbortError") {
        setErro(
          "A API demorou demais. Confira se o PostgreSQL está ligado e a senha no backend/.env."
        );
      } else {
        setErro(
          "Não foi possível conectar ao servidor FastAPI (127.0.0.1:8000). Verifique se o uvicorn está rodando."
        );
      }
    } finally {
      setCarregando(false);
    }
  };

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

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
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

        {/* formulario */}
        <View className="mx-[16px] mt-[-40px] bg-white rounded-[16px] p-[20px] shadow-lg">
          <Text className="text-[#6B0889] text-[20px] font-bold mb-[16px]">
            Informações básicas do pet
          </Text>

          {/* nome */}
          <Text className="text-[#333] text-[14px] mb-[6px]">Nome</Text>
          <TextInput
            className="bg-[#F3F0F0] rounded-[20px] px-[16px] py-[12px] mb-[14px] text-[#333]"
            placeholder="Digite o nome do pet"
            placeholderTextColor="#9A9A9A"
            value={nome}
            onChangeText={setNome}
          />

          {/* area pra escolher foto */}
          <Text className="text-[#333] text-[14px] mb-[6px]">Fotos/ vídeos</Text>
          <TouchableOpacity
            className="bg-[#D9D9D9] rounded-[12px] h-[160px] mb-[14px] items-center justify-center overflow-hidden"
            onPress={escolherFoto}
          >
            {foto ? (
              <Image
                source={{ uri: foto }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <Image
                source={require("../../assets/images/logo2.png")}
                className="w-[64px] h-[64px] opacity-50"
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>

          {/* apelido */}
          <Text className="text-[#333] text-[14px] mb-[6px]">Apelido</Text>
          <TextInput
            className="bg-[#F3F0F0] rounded-[20px] px-[16px] py-[12px] mb-[14px] text-[#333]"
            placeholder="Digite o apelido do pet"
            placeholderTextColor="#9A9A9A"
            value={apelido}
            onChangeText={setApelido}
          />

          {/* especie */}
          <Text className="text-[#333] text-[14px] mb-[6px]">Espécie</Text>
          <TouchableOpacity
            className="bg-[#F3F0F0] rounded-[20px] px-[16px] py-[12px] mb-[6px] flex-row items-center justify-between"
            onPress={() => {
              setAbrirEspecie(!abrirEspecie);
              setAbrirPorte(false);
              setAbrirSexo(false);
            }}
          >
            <Text style={{ color: especie ? "#333333" : "#9A9A9A" }}>
              {especie || "Selecione a espécie"}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#666" />
          </TouchableOpacity>
          {abrirEspecie && (
            <View className="bg-[#F3F0F0] rounded-[12px] mb-[14px] overflow-hidden">
              {especies.map((item) => (
                <TouchableOpacity
                  key={item}
                  className="px-[16px] py-[10px] border-b border-[#E0E0E0]"
                  onPress={() => {
                    setEspecie(item);
                    setAbrirEspecie(false);
                  }}
                >
                  <Text className="text-[#333]">{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {!abrirEspecie && <View className="mb-[8px]" />}

          {/* porte */}
          <Text className="text-[#333] text-[14px] mb-[6px]">Porte</Text>
          <TouchableOpacity
            className="bg-[#F3F0F0] rounded-[20px] px-[16px] py-[12px] mb-[6px] flex-row items-center justify-between"
            onPress={() => {
              setAbrirPorte(!abrirPorte);
              setAbrirEspecie(false);
              setAbrirSexo(false);
            }}
          >
            <Text style={{ color: porte ? "#333333" : "#9A9A9A" }}>
              {porte || "Selecione o porte"}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#666" />
          </TouchableOpacity>
          {abrirPorte && (
            <View className="bg-[#F3F0F0] rounded-[12px] mb-[14px] overflow-hidden">
              {portes.map((item) => (
                <TouchableOpacity
                  key={item}
                  className="px-[16px] py-[10px] border-b border-[#E0E0E0]"
                  onPress={() => {
                    setPorte(item);
                    setAbrirPorte(false);
                  }}
                >
                  <Text className="text-[#333]">{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {!abrirPorte && <View className="mb-[8px]" />}

          {/* sexo */}
          <Text className="text-[#333] text-[14px] mb-[6px]">Sexo</Text>
          <TouchableOpacity
            className="bg-[#F3F0F0] rounded-[20px] px-[16px] py-[12px] mb-[6px] flex-row items-center justify-between"
            onPress={() => {
              setAbrirSexo(!abrirSexo);
              setAbrirEspecie(false);
              setAbrirPorte(false);
            }}
          >
            <Text style={{ color: sexo ? "#333333" : "#9A9A9A" }}>
              {sexo || "Selecione o sexo"}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#666" />
          </TouchableOpacity>
          {abrirSexo && (
            <View className="bg-[#F3F0F0] rounded-[12px] mb-[14px] overflow-hidden">
              {sexos.map((item) => (
                <TouchableOpacity
                  key={item}
                  className="px-[16px] py-[10px] border-b border-[#E0E0E0]"
                  onPress={() => {
                    setSexo(item);
                    setAbrirSexo(false);
                  }}
                >
                  <Text className="text-[#333]">{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {!abrirSexo && <View className="mb-[8px]" />}

          {/* data de nascimento */}
          <Text className="text-[#333] text-[14px] mb-[6px]">Data de Nascimento</Text>
          <TextInput
            className="bg-[#F3F0F0] rounded-[20px] px-[16px] py-[12px] mb-[10px] text-[#333]"
            placeholder="DD/MM/AAAA"
            placeholderTextColor="#9A9A9A"
            value={dataNascimento}
            onChangeText={setDataNascimento}
            keyboardType="numeric"
          />

          {/* se nao souber a idade marca aqui */}
          <TouchableOpacity
            className="flex-row items-start mb-[20px]"
            onPress={() => setIdadeDesconhecida(!idadeDesconhecida)}
            activeOpacity={0.7}
          >
            <Text className="flex-1 text-[12px] text-[#555] pr-[10px] leading-[16px]">
              Marque essa caixinha caso não saiba a idade do animal, e informe a
              data em que abrigou o mesmo.
            </Text>
            <View
              className="w-[22px] h-[22px] rounded-[4px] border-2 items-center justify-center"
              style={{
                backgroundColor: idadeDesconhecida ? "#6B0889" : "#FFFFFF",
                borderColor: idadeDesconhecida ? "#6B0889" : "#999999",
              }}
            >
              {idadeDesconhecida && (
                <AntDesign name="check" size={14} color="white" />
              )}
            </View>
          </TouchableOpacity>

          {erro ? (
            <Text className="text-[13px] font-semibold text-[#D92D20] text-center mb-[14px]">
              {erro}
            </Text>
          ) : null}

          {/* botao continuar */}
          <TouchableOpacity
            className="bg-[#2C2C2C] rounded-[24px] py-[14px] items-center"
            activeOpacity={0.8}
            onPress={handleContinuar}
            disabled={carregando}
          >
            <Text className="text-white text-[16px] font-bold">
              {carregando ? "Salvando..." : "Continuar →"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* footer */}
      <SafeAreaView edges={["bottom"]} className="bg-[#6B0889]">
        <Footer backgroundColor="#6B0889" />
      </SafeAreaView>
    </View>
  );
}
