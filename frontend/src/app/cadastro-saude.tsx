import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, router, useLocalSearchParams } from "expo-router";
import Constants from "expo-constants";
import { AntDesign, Ionicons } from "@expo/vector-icons";

import Header from "../components/Headers/Header";
import Footer from "../components/Footers/Footer";
// endereco da api
const debuggerHost = Constants.expoConfig?.hostUri?.split(":")[0];
const API_URL =
  Platform.OS === "web"
    ? "http://127.0.0.1:8000"
    : debuggerHost
      ? `http://${debuggerHost}:8000`
      : "http://192.168.1.179:8000";

// opções de vacinação
const opcoesVacinas = [
  "V8",
  "V10",
  "Antirrábica",
  "Gripe",
  "Giárdia",
  "Leishmaniose",
  "Outra",
];

const opcoesSimNao = ["Sim", "Não"];

export default function CadastroSaude() {
  // id recebido
  const { id_animal } = useLocalSearchParams<{
    id_animal: string;
  }>();

    // estados do formulário
  const [castrado, setCastrado] = useState("");
  const [vacinasSelecionadas, setVacinasSelecionadas] =
    useState<string[]>([]);
  const [outraVacina, setOutraVacina] = useState("");

  const [vermifugado, setVermifugado] = useState("");
  const [condicaoEspecial, setCondicaoEspecial] = useState("");
  const [doenca, setDoenca] = useState("");
  const [medicamento, setMedicamento] = useState("");
  const [historico, setHistorico] = useState("");
  const [microchip, setMicrochip] = useState("");

  const [aberto, setAberto] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  // campo de seleção sim/não
  function CampoSelecao({
    titulo,
    valor,
    campo,
    alterar,
  }: {
    titulo: string;
    valor: string;
    campo: string;
    alterar: (valor: string) => void;
  }) {
    return (
      <View className="mb-[12px]">
        <Text className="text-[#222] text-[14px] mb-[4px]">
          {titulo}
        </Text>

        <TouchableOpacity
          className="bg-[#F3F0F0] rounded-[20px] border border-[#D0C8C8] px-[12px] py-[9px] flex-row items-center justify-between"
          onPress={() =>
            setAberto(aberto === campo ? "" : campo)
          }
          activeOpacity={0.8}
        >
          <Text
            className="text-[12px]"
            style={{ color: valor ? "#333" : "#999" }}
          >
            {valor || "Selecione uma opção"}
          </Text>

          <Ionicons
            name="chevron-down"
            size={16}
            color="#888"
          />
        </TouchableOpacity>

        {aberto === campo && (
          <View className="bg-[#F3F0F0] rounded-[10px] mt-[4px] overflow-hidden">
            {opcoesSimNao.map((item) => (
              <TouchableOpacity
                key={item}
                className="px-[12px] py-[10px] border-b border-[#DDD]"
                onPress={() => {
                  alterar(item);
                  setAberto("");
                }}
              >
                <Text className="text-[#333] text-[13px]">
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  }

  // converte as vacinas selecionadas em texto para o banco
  const vacinasTexto = [
    ...vacinasSelecionadas.filter(
      (vacina) => vacina !== "Outra"
    ),
    ...(vacinasSelecionadas.includes("Outra") &&
    outraVacina.trim()
      ? [outraVacina.trim()]
      : []),
  ].join(", ");

  // salvar dados de saúde na API
  const handleContinuar = async () => {
    setErro("");

    if (!id_animal || Array.isArray(id_animal)) {
      setErro(
        "ID do animal não encontrado. Volte ao cadastro do pet."
      );
      return;
    }

    if (
      !castrado ||
      vacinasSelecionadas.length === 0 ||
      !vermifugado ||
      !condicaoEspecial ||
      !medicamento ||
      !microchip
    ) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    if (
      vacinasSelecionadas.includes("Outra") &&
      !outraVacina.trim()
    ) {
      setErro("Informe qual é a outra vacina.");
      return;
    }

    if (vacinasTexto.length > 200) {
      setErro(
        "As vacinas informadas ultrapassam 200 caracteres."
      );
      return;
    }

    try {
      setCarregando(true);

      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        8000
      );

      let response: Response;

      try {
        response = await fetch(
          `${API_URL}/animais/${id_animal}/saude`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            signal: controller.signal,
            body: JSON.stringify({
              castrado,
              vacinas: vacinasTexto,
              vermifugado,
              condicao_especial: condicaoEspecial,
              descricao_condicao: doenca.trim() || null,
              medicamento_continuo: medicamento,
              historico_saude: historico.trim() || null,
              microchipado: microchip,
            }),
          }
        );
      } finally {
        clearTimeout(timeoutId);
      }

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setErro(
          typeof data?.detail === "string"
            ? data.detail
            : "Não foi possível salvar os dados de saúde."
        );
        return;
      }

      // altere para a rota real da próxima etapa
      // saude ok, segue pra comportamento (tela do pedro)
      router.push({
        pathname: "/cadastro-pet-comportamento",
        params: { id_animal: String(id_animal) },
      });
    } catch (e: any) {
      if (e?.name === "AbortError") {
        setErro("A API demorou demais para responder.");
      } else {
        setErro(
          "Não foi possível conectar à API. Verifique se o servidor está rodando."
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
      <SafeAreaView
        edges={["top"]}
        className="bg-[#FAFCFF] z-10"
      >
        <Header
          backgroundColor="#FAFCFF"
          leftContent={
            <AntDesign
              name="menu"
              size={26}
              color="black"
            />
          }
          centerContent={
            <Text className="text-lg font-bold text-[#6B0889]">
              ADOPET
            </Text>
          }
          rightContent={
            <TouchableOpacity className="bg-[#080909] p-[10px] m-[5px] rounded-[5px]">
              <Text className="text-white font-bold">
                Adotar
              </Text>
            </TouchableOpacity>
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

          <Text className="text-white text-[20px] font-bold text-center z-10">
            Cadastre seu pet para doação
          </Text>
        </View>

        {/* formulário */}
        <View className="mx-[16px] mt-[-40px] bg-white rounded-[16px] p-[20px] shadow-lg">
          <Text className="text-[#6B0889] text-[18px] font-bold mb-[14px] text-center">
            Saúde e bem-estar do pet
          </Text>

          <CampoSelecao
            titulo="Foi castrado(a)?"
            valor={castrado}
            campo="castrado"
            alterar={setCastrado}
          />

          {/* seleção múltipla de vacinas */}
          <View className="mb-[12px]">
            <Text className="text-[#222] text-[14px] mb-[4px]">
              Foi vacinado(a)?
            </Text>

            <Text className="text-[#777] text-[12px] mb-[8px]">
              Selecione todas as vacinas aplicadas.
            </Text>

            {opcoesVacinas.map((vacina) => {
              const selecionada =
                vacinasSelecionadas.includes(vacina);

              return (
                <TouchableOpacity
                  key={vacina}
                  onPress={() => {
                    setVacinasSelecionadas((atuais) =>
                      selecionada
                        ? atuais.filter(
                            (item) => item !== vacina
                          )
                        : [...atuais, vacina]
                    );
                  }}
                  className="flex-row items-center mb-[8px]"
                  activeOpacity={0.7}
                >
                  <View
                    className={`w-[20px] h-[20px] rounded-[4px] border items-center justify-center mr-[10px] ${
                      selecionada
                        ? "bg-[#6B0889] border-[#6B0889]"
                        : "bg-white border-[#AAA]"
                    }`}
                  >
                    {selecionada && (
                      <Ionicons
                        name="checkmark"
                        size={15}
                        color="#FFFFFF"
                      />
                    )}
                  </View>

                  <Text className="text-[13px] text-[#333]">
                    {vacina}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {vacinasSelecionadas.includes("Outra") && (
              <TextInput
                className="bg-[#F3F0F0] border border-[#D0C8C8] rounded-[6px] px-[10px] py-[10px] mt-[4px] text-[12px] text-[#333]"
                placeholder="Informe outra vacina"
                placeholderTextColor="#999"
                value={outraVacina}
                onChangeText={setOutraVacina}
                maxLength={100}
              />
            )}
          </View>

          <CampoSelecao
            titulo="Vermifugado(a)?"
            valor={vermifugado}
            campo="vermifugado"
            alterar={setVermifugado}
          />

          <CampoSelecao
            titulo="Possui alguma doença crônica ou condição especial?"
            valor={condicaoEspecial}
            campo="condicao"
            alterar={setCondicaoEspecial}
          />

          <TextInput
            className="bg-[#F3F0F0] border border-[#D0C8C8] rounded-[4px] px-[8px] py-[8px] mb-[12px] text-[12px] text-[#333] min-h-[64px]"
            placeholder="Discorra sobre"
            placeholderTextColor="#999"
            value={doenca}
            onChangeText={setDoenca}
            multiline
            textAlignVertical="top"
          />

          <CampoSelecao
            titulo="Usa algum medicamento contínuo?"
            valor={medicamento}
            campo="medicamento"
            alterar={setMedicamento}
          />

          <Text className="text-[#222] text-[14px] mb-[4px]">
            Histórico de saúde:
          </Text>

          <TextInput
            className="bg-[#F3F0F0] border border-[#D0C8C8] rounded-[4px] px-[8px] py-[8px] mb-[12px] text-[12px] text-[#333] min-h-[64px]"
            placeholder="Discorra sobre"
            placeholderTextColor="#999"
            value={historico}
            onChangeText={setHistorico}
            multiline
            textAlignVertical="top"
          />

          <CampoSelecao
            titulo="Microchipado(a)?"
            valor={microchip}
            campo="microchip"
            alterar={setMicrochip}
          />

          {/* botão Continuar */}
          <TouchableOpacity
            className={`rounded-[20px] py-[13px] px-[24px] self-center mt-[8px] ${
              carregando ? "bg-[#666]" : "bg-[#2C2C2C]"
            }`}
            activeOpacity={0.8}
            onPress={handleContinuar}
            disabled={carregando}
          >
            <Text className="text-white text-[15px] font-bold">
              {carregando ? "Salvando..." : "Continuar →"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* footer */}
      <SafeAreaView
        edges={["bottom"]}
        className="bg-[#6B0889]"
      >
        <Footer backgroundColor="#6B0889" />
      </SafeAreaView>
    </View>
  );
}
