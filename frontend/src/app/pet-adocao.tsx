import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Footer from "../components/Footers/Footer";
import Header from "../components/Headers/Header";
import {
  calcularIdade,
  listarAnimais,
  urlDaFoto,
  type Animal,
} from "../services/animais";

export default function PetAdocaoScreen() {
  const { width } = useWindowDimensions();
  const larguraCard = Math.min(220, Math.max(80, (width - 24) / 2));
  const larguraFoto = larguraCard - 16;
  const [tentativa, setTentativa] = useState(0);
  const [resultado, setResultado] = useState<{
    tentativa: number;
    animais: Animal[];
    erro: string;
  } | null>(null);

  useEffect(() => {
    let ativo = true;

    listarAnimais()
      .then((animais) => {
        if (ativo) {
          setResultado({
            tentativa,
            animais: animais.filter((animal) => animal.foto_url?.trim()),
            erro: "",
          });
        }
      })
      .catch((falha: unknown) => {
        if (ativo) {
          setResultado({
            tentativa,
            animais: [],
            erro:
              falha instanceof Error
                ? falha.message
                : "Não foi possível carregar os pets.",
          });
        }
      });

    return () => {
      ativo = false;
    };
  }, [tentativa]);

  const resultadoAtual =
    resultado?.tentativa === tentativa ? resultado : null;
  const carregando = resultadoAtual === null;
  const erro = resultadoAtual?.erro ?? "";
  const animais = resultadoAtual?.animais ?? [];

  function abrirDetalhes(animal: Animal) {
    router.push({
      pathname: "/pet-detalhes",
      params: { id_animal: String(animal.id_animal), nome: animal.nome },
    });
  }

  return (
    <View className="flex-1 bg-[#F8F7F9]">
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView edges={["top"]} className="z-10 bg-white">
        <Header backgroundColor="white" showAdotarButton={false} />
      </SafeAreaView>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 12 }}
      >
        <View className="relative h-[92px] justify-center overflow-hidden bg-[#F09545] px-5">
          <Ionicons
            name="paw"
            size={82}
            color="rgba(220, 91, 35, 0.24)"
            style={{
              position: "absolute",
              right: 18,
              top: -22,
              transform: [{ rotate: "-24deg" }],
            }}
          />
          <Text className="text-center text-[14px] font-semibold text-white">
            Pets disponíveis para amar e adotar
          </Text>
        </View>

        <View className="mx-3 -mt-5 rounded-[10px] border border-[#E0E0E0] bg-white px-3 py-3 shadow-sm">
          <TouchableOpacity
            onPress={() => router.push("/filtro")}
            activeOpacity={0.8}
            className="mx-auto h-[36px] w-[62%] flex-row items-center justify-center rounded-full border border-[#D3D3D3]"
          >
            <Ionicons name="filter-outline" size={15} color="#333" />
            <Text className="ml-2 text-[13px] tracking-[1px] text-[#222]">
              Filtros
            </Text>
          </TouchableOpacity>
        </View>

        <View className="px-2 pb-3 pt-3">
          {carregando ? (
            <View className="h-48 items-center justify-center">
              <ActivityIndicator color="#6B0889" />
              <Text className="mt-2 text-[13px] text-[#555]">
                Carregando pets disponíveis...
              </Text>
            </View>
          ) : erro ? (
            <View className="min-h-44 items-center justify-center px-4">
              <Text className="text-center text-[13px] leading-5 text-[#555]">
                {erro}{"\n"}Confira se o backend e o PostgreSQL estão ativos.
              </Text>
              <TouchableOpacity
                onPress={() => setTentativa((atual) => atual + 1)}
                className="mt-3 rounded-full bg-[#6B0889] px-5 py-2"
              >
                <Text className="font-semibold text-white">Tentar novamente</Text>
              </TouchableOpacity>
            </View>
          ) : animais.length === 0 ? (
            <View className="min-h-44 items-center justify-center px-4">
              <Text className="text-center text-[14px] text-[#555]">
                Nenhum pet disponível com foto.
              </Text>
            </View>
          ) : (
            <>
              <View className="flex-row flex-wrap justify-between">
                {animais.map((animal) => (
                  <View
                    key={animal.id_animal}
                    style={{ width: larguraCard }}
                    className="mb-2 overflow-hidden rounded-[10px] border border-[#D8D8D8] bg-white p-2"
                  >
                    <TouchableOpacity
                      onPress={() => abrirDetalhes(animal)}
                      activeOpacity={0.86}
                      accessibilityRole="button"
                      accessibilityLabel={`Ver detalhes de ${animal.nome}`}
                    >
                      <Image
                        source={{ uri: urlDaFoto(animal.foto_url) }}
                        style={{ width: larguraFoto, height: larguraFoto }}
                        className="self-center rounded-[10px] bg-[#E5E5E5]"
                        resizeMode="cover"
                        accessibilityLabel={`Foto de ${animal.nome}`}
                      />
                      <View className="mt-1 px-1">
                        <View className="flex-row items-center justify-between">
                          <Text
                            numberOfLines={1}
                            className="flex-1 font-mono text-[14px] tracking-[1px] text-[#E04A32]"
                          >
                            {animal.nome}
                          </Text>
                          <Ionicons
                            name={animal.sexo.toUpperCase() === "M" ? "male" : "female"}
                            size={22}
                            color={animal.sexo.toUpperCase() === "M" ? "#1695E8" : "#FF3D8D"}
                          />
                        </View>
                        <Text className="text-[11px] leading-[13px] text-[#222]">
                          {calcularIdade(animal.dt_nascimento)}
                        </Text>
                        <Text
                          numberOfLines={1}
                          className="font-mono text-[9px] leading-[12px] text-[#666]"
                        >
                          {[animal.cidade, animal.uf].filter(Boolean).join(", ")}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <View className="mt-1 items-center rounded-full bg-[#8800B6] py-[3px]">
                      <Text className="font-mono text-[11px] text-white">
                        Me adote
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              <View className="mx-auto mt-1 rounded-[3px] bg-[#8800B6] px-4 py-1.5">
                <Text className="font-mono text-[12px] text-white">
                  Carregar mais
                </Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <SafeAreaView edges={["bottom"]} className="bg-[#6B0889]">
        <Footer backgroundColor="#6B0889" />
      </SafeAreaView>
    </View>
  );
}
