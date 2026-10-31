import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";

import Footer from "../components/Footers/Footer";
import Header from "../components/Headers/Header";
import {
  buscarAnimal,
  calcularIdade,
  formatarSexo,
  type Animal,
  urlDaFoto,
} from "../services/animais";

function getParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function display(value?: string | null) {
  return value?.trim() || "Não informado";
}

function displayBoolean(value?: boolean | null) {
  if (value === undefined || value === null) return "Não informado";
  return value ? "Sim" : "Não";
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <Text className="mb-2 text-[14px] leading-[19px] text-[#171717]">
      <Text className="font-bold">{label}: </Text>
      {value}
    </Text>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <Text className="mb-2 text-[16px] font-bold text-[#D97836]">
      {children}
    </Text>
  );
}

export default function PetDetailsScreen() {
  const params = useLocalSearchParams<{
    id?: string | string[];
    id_animal?: string | string[];
    nome?: string | string[];
    name?: string | string[];
  }>();
  const animalId = getParam(params.id_animal ?? params.id);
  const animalName = getParam(params.nome ?? params.name);
  const [tentativa, setTentativa] = useState(0);
  const [resultado, setResultado] = useState<{
    id: string;
    tentativa: number;
    animal: Animal | null;
    erro: string;
  } | null>(null);
  const idValido = Boolean(animalId && /^\d+$/.test(animalId));
  const resultadoAtual =
    resultado !== null &&
    resultado.id === animalId &&
    resultado.tentativa === tentativa
      ? resultado
      : null;
  const animal = resultadoAtual?.animal ?? null;
  const carregando = idValido && resultadoAtual === null;
  const erro = idValido
    ? resultadoAtual?.erro ?? ""
    : "O ID do pet é inválido. Volte e selecione um card.";

  useEffect(() => {
    let ativo = true;

    if (!animalId || !/^\d+$/.test(animalId)) return;

    buscarAnimal(animalId)
      .then((dados) => {
        if (ativo) {
          setResultado({ id: animalId, tentativa, animal: dados, erro: "" });
        }
      })
      .catch((falha: unknown) => {
        if (ativo) {
          setResultado({
            id: animalId,
            tentativa,
            animal: null,
            erro:
              falha instanceof Error
                ? falha.message
                : "Não foi possível carregar os dados deste pet.",
          });
        }
      });

    return () => {
      ativo = false;
    };
  }, [animalId, tentativa]);

  return (
    <View className="flex-1 bg-[#F09545]">
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView edges={["top"]} className="z-10 bg-[#FAFCFF]">
        <Header backgroundColor="#FAFCFF" />
      </SafeAreaView>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 8 }}
      >
        <View className="relative overflow-hidden px-5 pb-3 pt-2">
          <Ionicons
            name="paw"
            size={86}
            color="rgba(220, 91, 35, 0.22)"
            style={{
              position: "absolute",
              right: 70,
              top: -12,
              transform: [{ rotate: "-25deg" }],
            }}
          />
          <View className="flex-row items-center justify-between">
            <Text className="text-[34px] font-extrabold leading-[42px] text-white">
              {animal?.nome ?? animalName ?? "Pet"}
            </Text>
            <TouchableOpacity
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
              className="rounded-full bg-white px-5 py-2"
            >
              <Text className="text-[15px] font-semibold text-[#444]">Voltar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mx-3 overflow-hidden rounded-[12px] border border-[#D8D8D8] bg-[#FAFAFA]">
          {carregando ? (
            <View className="min-h-[280px] items-center justify-center">
              <ActivityIndicator color="#6B0889" />
              <Text className="mt-2 text-[13px] text-[#555]">
                Carregando dados do pet...
              </Text>
            </View>
          ) : erro || !animal ? (
            <View className="min-h-[280px] items-center justify-center px-6">
              <Text className="text-center text-[14px] leading-5 text-[#333]">
                {erro || "Pet não encontrado."}
              </Text>
              <Text className="mt-2 text-center text-[13px] text-[#666]">
                Confira se o backend e o PostgreSQL estão ativos.
              </Text>
              {idValido && (
                <TouchableOpacity
                  onPress={() => setTentativa((atual) => atual + 1)}
                  accessibilityRole="button"
                  className="mt-4 rounded-full bg-[#6B0889] px-5 py-2"
                >
                  <Text className="text-[14px] font-semibold text-white">
                    Tentar novamente
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <>
              <View className="flex-row items-center border-b border-[#BEBEBE] p-2">
                <Image
                  source={{ uri: urlDaFoto(animal.foto_url) }}
                  className="h-[120px] w-[128px] rounded-[12px] bg-[#E5E5E5]"
                  resizeMode="cover"
                  accessibilityLabel={`Foto de ${animal.nome}`}
                />
                <View className="ml-3 flex-1">
                  <DetailLine label="Espécie" value={display(animal.especie)} />
                  <DetailLine label="Porte" value={display(animal.porte)} />
                  <DetailLine label="Sexo" value={formatarSexo(animal.sexo)} />
                  <DetailLine
                    label="Idade"
                    value={calcularIdade(animal.dt_nascimento)}
                  />
                </View>
              </View>

              <View className="border-b border-[#BEBEBE] px-1 pb-1 pt-2">
                <SectionTitle>Saúde e bem-estar do pet</SectionTitle>
                <DetailLine label="Castrado?" value={displayBoolean(animal.castrado)} />
                <DetailLine label="Vacinas" value={display(animal.vacinas)} />
                <DetailLine
                  label="Vermifugado?"
                  value={displayBoolean(animal.vermifugado)}
                />
                <DetailLine
                  label="Doença crônica ou condição especial?"
                  value={displayBoolean(animal.condicao_especial)}
                />
                <DetailLine
                  label="Usa medicamento contínuo?"
                  value={displayBoolean(animal.medicamento_continuo)}
                />
                <DetailLine
                  label="Histórico de saúde"
                  value={display(animal.historico_saude)}
                />
                <DetailLine
                  label="Microchipado?"
                  value={displayBoolean(animal.microchipado)}
                />
              </View>

              <View className="px-1 pb-2 pt-2">
                <SectionTitle>História e comportamento</SectionTitle>
                <DetailLine label="História" value={display(animal.historia)} />
                <DetailLine
                  label="Motivo da doação"
                  value={display(animal.motivo_doacao)}
                />
                <DetailLine
                  label="Personalidade"
                  value={display(animal.personalidade)}
                />
              </View>

              <View className="items-center border-t border-[#BEBEBE] py-3">
                <TouchableOpacity
                  onPress={() => router.push("/doar")}
                  accessibilityRole="button"
                  className="rounded-full border border-[#E7B5E8] bg-[#F6D7F5] px-6 py-2"
                >
                  <Text className="text-[14px] font-semibold text-[#6B0889]">
                    Adote-me
                  </Text>
                </TouchableOpacity>
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
