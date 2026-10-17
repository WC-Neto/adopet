import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { AntDesign, Feather } from "@expo/vector-icons";
import Header from "../components/Headers/Header";

// opcoes dos selects
const estados = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
  "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];
const especies = ["Cachorro", "Gato", "Outro"];
const idades = ["Filhote", "Adulto", "Idoso"];
const sexos = ["Macho", "Fêmea"];
const portes = ["Pequeno", "Médio", "Grande"];

export default function Filtro() {
  const router = useRouter();

  // se a tela abrir com filtros ja aplicados, eles chegam aqui
  const params = useLocalSearchParams<{
    estado?: string;
    cidade?: string;
    especie?: string;
    idade?: string;
    sexo?: string;
    porte?: string;
  }>();

  // campos do filtro
  const [estado, setEstado] = useState(params.estado ?? "");
  const [cidade, setCidade] = useState(params.cidade ?? "");
  const [especie, setEspecie] = useState(params.especie ?? "");
  const [idade, setIdade] = useState(params.idade ?? "");
  const [sexo, setSexo] = useState(params.sexo ?? "");
  const [porte, setPorte] = useState(params.porte ?? "");

  // lista de cidades do estado escolhido
  const [cidades, setCidades] = useState<string[]>([]);

  // controla qual select ta aberto ("" = nenhum)
  const [aberto, setAberto] = useState("");

  // busca as cidades quando o estado muda (api do ibge)
  useEffect(() => {
    if (!estado) {
      setCidades([]);
      return;
    }

    fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`
    )
      .then((res) => res.json())
      .then((data: { nome: string }[]) => setCidades(data.map((c) => c.nome)))
      .catch(() => setCidades([]));
  }, [estado]);

  // abre/fecha um select
  const alternar = (nome: string) => {
    setAberto(aberto === nome ? "" : nome);
  };

  // limpa todos os filtros
  const limparFiltro = () => {
    setEstado("");
    setCidade("");
    setEspecie("");
    setIdade("");
    setSexo("");
    setPorte("");
    setAberto("");
  };

  // volta pra tela inicial mandando so os filtros preenchidos
  const aplicarFiltro = () => {
    const filtros = { estado, cidade, especie, idade, sexo, porte };
    const aplicados = Object.fromEntries(
      Object.entries(filtros).filter(([, valor]) => valor !== "")
    );
    router.replace({ pathname: "/", params: aplicados });
  };

  // cada linha do filtro
  const campos = [
    {
      nome: "Estado",
      valor: estado,
      opcoes: estados,
      escolher: (item: string) => {
        setEstado(item);
        setCidade(""); // trocou o estado, a cidade antiga nao vale mais
        setAberto("");
      },
    },
    {
      nome: "Cidade",
      valor: cidade,
      opcoes: cidades,
      escolher: (item: string) => {
        setCidade(item);
        setAberto("");
      },
    },
    {
      nome: "Espécie",
      valor: especie,
      opcoes: especies,
      escolher: (item: string) => {
        setEspecie(item);
        setAberto("");
      },
    },
    {
      nome: "Idade",
      valor: idade,
      opcoes: idades,
      escolher: (item: string) => {
        setIdade(item);
        setAberto("");
      },
    },
    {
      nome: "Sexo",
      valor: sexo,
      opcoes: sexos,
      escolher: (item: string) => {
        setSexo(item);
        setAberto("");
      },
    },
    {
      nome: "Porte",
      valor: porte,
      opcoes: portes,
      escolher: (item: string) => {
        setPorte(item);
        setAberto("");
      },
    },
  ];

  return (
    <View className="flex-1 bg-[#F09545]">
      <Stack.Screen options={{ headerShown: false }} />

      {/* TOP SAFE AREA */}
      <SafeAreaView edges={["top"]} className="bg-[#FAFCFF] z-10">
        <Header
          backgroundColor="#FAFCFF"
          leftContent={<Feather name="menu" size={34} color="#222" />}
          centerContent={
            <Text className="text-[22px] font-bold text-[#6B0889]">ADOPET</Text>
          }
        />
      </SafeAreaView>

      {/* CONTENT BLOCK */}
      <View className="flex-1 overflow-hidden">
        {/* patinhas grandes do fundo, ficam atras do card */}
        <Image
          source={require("../../assets/images/logoLaranja.png")}
          className="absolute right-[-30px] top-[-30px] w-[170px] h-[170px]"
          style={{ tintColor: "#E8892F" }}
          resizeMode="contain"
        />
        <Image
          source={require("../../assets/images/logoLaranja.png")}
          className="absolute right-[90px] top-[-20px] w-[90px] h-[90px]"
          style={{ tintColor: "#E8892F" }}
          resizeMode="contain"
        />

        {/* card branco dos filtros */}
        <View className="flex-1 mx-[20px] mt-[12px] mb-[16px] bg-white rounded-[16px] overflow-hidden">
          {/* titulo e botao de fechar */}
          <View className="items-center justify-center h-[60px]">
            <Text className="text-[18px] text-[#222]">Filtros</Text>
            <TouchableOpacity
              className="absolute right-[16px]"
              onPress={() => router.back()}
              hitSlop={10}
            >
              <AntDesign name="close" size={22} color="#222" />
            </TouchableOpacity>
          </View>

          {/* lista de filtros */}
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {campos.map((campo, indice) => (
              <View
                key={campo.nome}
                className={`border-t border-x border-[#4A4A4A] ${
                  indice === campos.length - 1 ? "border-b border-b-[#CFCFCF]" : ""
                }`}
              >
                <TouchableOpacity
                  className="flex-row items-center justify-between px-[16px] h-[52px]"
                  onPress={() => alternar(campo.nome)}
                  activeOpacity={0.7}
                >
                  <Text className="text-[16px] font-medium text-[#222]">
                    {campo.valor || campo.nome}
                  </Text>
                  <Feather
                    name={aberto === campo.nome ? "chevron-up" : "chevron-down"}
                    size={18}
                    color="#222"
                  />
                </TouchableOpacity>

                {/* opcoes do select aberto */}
                {aberto === campo.nome && (
                  <View className="bg-[#F7F7F7] border-t border-[#DDD]">
                    {campo.opcoes.length === 0 ? (
                      <Text className="px-[24px] py-[12px] text-[#9A9A9A]">
                        {campo.nome === "Cidade"
                          ? "Escolha um estado primeiro"
                          : "Nenhuma opção"}
                      </Text>
                    ) : (
                      campo.opcoes.map((item) => (
                        <TouchableOpacity
                          key={item}
                          className="flex-row items-center justify-between px-[24px] py-[12px]"
                          onPress={() => campo.escolher(item)}
                        >
                          <Text
                            style={{
                              color: item === campo.valor ? "#6B0889" : "#333333",
                            }}
                          >
                            {item}
                          </Text>
                          {item === campo.valor && (
                            <AntDesign name="check" size={16} color="#6B0889" />
                          )}
                        </TouchableOpacity>
                      ))
                    )}
                  </View>
                )}
              </View>
            ))}
          </ScrollView>

          {/* botoes de baixo */}
          <View className="flex-row gap-[12px] p-[12px]">
            <TouchableOpacity
              className="flex-1 h-[40px] items-center justify-center rounded-[8px] border border-[#BBB] bg-white"
              onPress={limparFiltro}
              activeOpacity={0.8}
            >
              <Text className="text-[15px] font-medium text-[#222]">
                Limpar filtro
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 h-[40px] items-center justify-center rounded-[8px] bg-[#6B0889]"
              onPress={aplicarFiltro}
              activeOpacity={0.8}
            >
              <Text className="text-[15px] font-medium text-white">
                Aplicar filtro
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* so respeita a area segura de baixo, sem footer (o Figma nao tem) */}
      <SafeAreaView edges={["bottom"]} className="bg-[#F09545]" />
    </View>
  );
}