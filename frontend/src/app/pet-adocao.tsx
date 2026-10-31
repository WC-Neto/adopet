import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
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
  obterFaixaEtaria,
  urlDaFoto,
  type Animal,
  type FiltrosAnimais,
} from "../services/animais";

function normalizar(texto?: string | null): string {
  if (!texto) return "";
  return texto
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function labelDoFiltro(chave: string): string {
  const map: Record<string, string> = {
    estado: "UF",
    cidade: "Cidade",
    especie: "Espécie",
    idade: "Idade",
    sexo: "Sexo",
    porte: "Porte",
  };
  return map[chave] ?? chave;
}

function FotoCardPet({
  fotoUrl,
  nome,
  size,
}: {
  fotoUrl: string;
  nome: string;
  size: number;
}) {
  const [erro, setErro] = useState(false);

  if (erro) {
    return (
      <View
        style={{ width: size, height: size }}
        className="self-center items-center justify-center rounded-[10px] bg-[#E5E5E5]"
      >
        <Ionicons name="paw" size={32} color="#A0A0A0" />
      </View>
    );
  }

  return (
    <Image
      source={{ uri: urlDaFoto(fotoUrl) }}
      style={{ width: size, height: size }}
      className="self-center rounded-[10px] bg-[#E5E5E5]"
      resizeMode="cover"
      accessibilityLabel={`Foto de ${nome}`}
      onError={() => setErro(true)}
    />
  );
}

export default function PetAdocaoScreen() {
  const { width } = useWindowDimensions();
  const larguraCard = Math.min(220, Math.max(80, (width - 24) / 2));
  const larguraFoto = larguraCard - 16;

  const params = useLocalSearchParams<{
    estado?: string;
    uf?: string;
    cidade?: string;
    especie?: string;
    idade?: string;
    sexo?: string;
    porte?: string;
  }>();

  const [tentativa, setTentativa] = useState(0);
  const [resultado, setResultado] = useState<{
    tentativa: number;
    animais: Animal[];
    erro: string;
  } | null>(null);

  // Lista de filtros preenchidos
  const filtrosAtivos = useMemo(() => {
    return Object.entries(params).filter(
      ([, valor]) => typeof valor === "string" && valor.trim().length > 0
    ) as [string, string][];
  }, [params]);

  useEffect(() => {
    let ativo = true;

    listarAnimais({
      especie: params.especie,
      porte: params.porte,
      sexo: params.sexo,
      cidade: params.cidade,
      uf: params.estado || params.uf,
    })
      .then((dados) => {
        if (ativo) {
          setResultado({
            tentativa,
            animais: dados.filter((animal) => animal.foto_url?.trim()),
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
  }, [
    tentativa,
    params.estado,
    params.uf,
    params.cidade,
    params.especie,
    params.idade,
    params.sexo,
    params.porte,
  ]);

  const resultadoAtual =
    resultado?.tentativa === tentativa ? resultado : null;
  const carregando = resultadoAtual === null;
  const erro = resultadoAtual?.erro ?? "";
  const animais = resultadoAtual?.animais ?? [];

  // Filtro refinado no cliente
  const animaisFiltrados = useMemo(() => {
    return animais.filter((animal) => {
      const filtroEstado = params.estado || params.uf;
      if (filtroEstado && normalizar(animal.uf) !== normalizar(filtroEstado)) {
        return false;
      }
      if (params.cidade && normalizar(animal.cidade) !== normalizar(params.cidade)) {
        return false;
      }
      if (params.especie) {
        const ea = normalizar(animal.especie);
        const ef = normalizar(params.especie);
        if (ef === "outro") {
          if (ea === "cachorro" || ea === "gato") return false;
        } else if (ea !== ef) {
          return false;
        }
      }
      if (params.porte && normalizar(animal.porte) !== normalizar(params.porte)) {
        return false;
      }
      if (params.sexo) {
        const sa = normalizar(animal.sexo);
        const sf = normalizar(params.sexo);
        const isM = sa === "m" || sa === "macho";
        const isF = sa === "f" || sa === "femea";
        const querM = sf === "m" || sf === "macho";
        const querF = sf === "f" || sf === "femea";
        if (querM && !isM) return false;
        if (querF && !isF) return false;
      }
      if (params.idade) {
        const faixa = obterFaixaEtaria(animal.dt_nascimento);
        if (faixa !== params.idade) return false;
      }
      return true;
    });
  }, [animais, params]);

  function abrirDetalhes(animal: Animal) {
    router.push({
      pathname: "/pet-detalhes",
      params: { id_animal: String(animal.id_animal), nome: animal.nome },
    });
  }

  function removerFiltro(chave: string) {
    const novosParams = { ...params } as Record<string, string | undefined>;
    delete novosParams[chave];
    router.replace({ pathname: "/pet-adocao", params: novosParams });
  }

  function limparFiltros() {
    router.replace("/pet-adocao");
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
            onPress={() => router.push({ pathname: "/filtro", params })}
            activeOpacity={0.8}
            className="mx-auto h-[36px] w-[62%] flex-row items-center justify-center rounded-full border border-[#D3D3D3]"
          >
            <Ionicons name="filter-outline" size={15} color="#333" />
            <Text className="ml-2 text-[13px] tracking-[1px] text-[#222]">
              Filtros{filtrosAtivos.length > 0 ? ` (${filtrosAtivos.length})` : ""}
            </Text>
          </TouchableOpacity>

          {filtrosAtivos.length > 0 && (
            <View className="mt-2.5 pt-2 border-t border-[#F0F0F0]">
              <View className="flex-row flex-wrap items-center gap-1.5">
                {filtrosAtivos.map(([chave, valor]) => (
                  <View
                    key={chave}
                    className="flex-row items-center bg-[#F3E8FF] border border-[#D8B4FE] rounded-full px-2.5 py-1"
                  >
                    <Text className="text-[11px] text-[#6B0889] font-medium mr-1">
                      {labelDoFiltro(chave)}: {valor}
                    </Text>
                    <TouchableOpacity
                      hitSlop={6}
                      onPress={() => removerFiltro(chave)}
                      accessibilityRole="button"
                      accessibilityLabel={`Remover filtro ${labelDoFiltro(chave)}`}
                    >
                      <Ionicons name="close-circle" size={14} color="#6B0889" />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity
                  onPress={limparFiltros}
                  className="px-2 py-1"
                  accessibilityRole="button"
                  accessibilityLabel="Limpar todos os filtros"
                >
                  <Text className="text-[11px] font-semibold text-[#E04A32]">
                    Limpar tudo
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
                {erro}
                {"\n"}Confira se o backend e o PostgreSQL estão ativos.
              </Text>
              <TouchableOpacity
                onPress={() => setTentativa((atual) => atual + 1)}
                className="mt-3 rounded-full bg-[#6B0889] px-5 py-2"
              >
                <Text className="font-semibold text-white">Tentar novamente</Text>
              </TouchableOpacity>
            </View>
          ) : animaisFiltrados.length === 0 ? (
            <View className="min-h-44 items-center justify-center px-4">
              <Ionicons name="search-outline" size={40} color="#888" />
              <Text className="mt-2 text-center text-[14px] font-semibold text-[#333]">
                {filtrosAtivos.length > 0
                  ? "Nenhum pet encontrado com os filtros selecionados."
                  : "Nenhum pet disponível no momento."}
              </Text>
              {filtrosAtivos.length > 0 && (
                <TouchableOpacity
                  onPress={limparFiltros}
                  className="mt-3 rounded-full bg-[#6B0889] px-5 py-2"
                >
                  <Text className="font-semibold text-white text-[13px]">
                    Limpar filtros
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <>
              <View className="flex-row flex-wrap justify-between">
                {animaisFiltrados.map((animal) => (
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
                      <FotoCardPet
                        fotoUrl={animal.foto_url}
                        nome={animal.nome}
                        size={larguraFoto}
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
                            name={
                              animal.sexo.toUpperCase() === "M"
                                ? "male"
                                : "female"
                            }
                            size={22}
                            color={
                              animal.sexo.toUpperCase() === "M"
                                ? "#1695E8"
                                : "#FF3D8D"
                            }
                          />
                        </View>
                        <Text className="text-[11px] leading-[13px] text-[#222]">
                          {calcularIdade(animal.dt_nascimento)}
                        </Text>
                        <Text
                          numberOfLines={1}
                          className="font-mono text-[9px] leading-[12px] text-[#666]"
                        >
                          {[animal.cidade, animal.uf]
                            .filter(Boolean)
                            .join(", ")}
                        </Text>
                      </View>
                      <View className="mt-1 items-center rounded-full bg-[#8800B6] py-[3px]">
                        <Text className="font-mono text-[11px] text-white">
                          Me adote
                        </Text>
                      </View>
                    </TouchableOpacity>
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
