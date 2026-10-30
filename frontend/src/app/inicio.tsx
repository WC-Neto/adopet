import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Stack } from "expo-router";

import Footer from "../components/Footers/Footer";
import PetCard, { Pet } from "../components/PetCard";
import Header from "../components/Headers/Header";
import {
  calcularIdade,
  listarAnimais,
  urlDaFoto,
  type Animal,
} from "../services/animais";

const CARD_WIDTH = 160;
const CARD_MARGIN = 12;
const SNAP_INTERVAL = CARD_WIDTH + CARD_MARGIN;

function toPetCard(animal: Animal): Pet {
  return {
    id: String(animal.id_animal),
    name: animal.nome,
    age: calcularIdade(animal.dt_nascimento),
    location: [animal.cidade, animal.uf].filter(Boolean).join(", "),
    imageUri: urlDaFoto(animal.foto_url),
  };
}

export default function HomeScreen() {
  const flatListRef = useRef<FlatList<Pet>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tentativa, setTentativa] = useState(0);
  const [resultado, setResultado] = useState<{
    tentativa: number;
    pets: Pet[];
    erro: string;
  } | null>(null);

  useEffect(() => {
    let ativo = true;

    listarAnimais()
      .then((animais) => {
        if (ativo) {
          setResultado({
            tentativa,
            pets: animais
              .filter((animal) => animal.foto_url?.trim())
              .map(toPetCard),
            erro: "",
          });
        }
      })
      .catch((falha: unknown) => {
        if (ativo) {
          setResultado({
            tentativa,
            pets: [],
            erro:
              falha instanceof Error
                ? falha.message
                : "Não foi possível carregar os pets.",
          });
        }
      })

    return () => {
      ativo = false;
    };
  }, [tentativa]);

  const resultadoAtual = resultado?.tentativa === tentativa ? resultado : null;
  const carregando = resultadoAtual === null;
  const pets = resultadoAtual?.pets ?? [];
  const erro = resultadoAtual?.erro ?? "";
  const indiceAtual = Math.min(currentIndex, Math.max(0, pets.length - 1));

  const scrollPrev = () => {
    if (pets.length === 0) return;
    const next = Math.max(0, indiceAtual - 1);
    flatListRef.current?.scrollToIndex({ index: next, animated: true });
    setCurrentIndex(next);
  };

  const scrollNext = () => {
    if (pets.length === 0) return;
    const next = Math.min(pets.length - 1, indiceAtual + 1);
    flatListRef.current?.scrollToIndex({ index: next, animated: true });
    setCurrentIndex(next);
  };

  const isFirst = indiceAtual === 0;
  const isLast = pets.length === 0 || indiceAtual === pets.length - 1;

  return (
    <View className="flex-1 bg-[#f8f7f9]">
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView edges={["top"]} className="bg-white z-10">
        <Header backgroundColor="white" />
      </SafeAreaView>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="grow"
      >
        {/* Banner */}
        <ImageBackground
          source={require("../../assets/images/banner.jpeg")}
          className="min-h-[140px] flex-row items-center justify-between px-6 py-6 overflow-hidden"
          resizeMode="cover"
        >
          <View className="absolute -bottom-5 -left-5 w-[120px] h-[120px] rounded-full bg-black/[0.06]" />
          <View className="flex-row items-center gap-3 flex-1">
            <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center">
              <Ionicons name="paw" size={48} color="rgba(255,255,255,0.6)" />
            </View>
            <View className="flex-1">
              <Text className="text-[22px] font-extrabold text-white leading-7">
                Bem vindo à
              </Text>
              <Text className="text-[22px] font-extrabold text-white leading-7">
                Adopet
              </Text>
            </View>
          </View>
          <View className="items-end">
            <Ionicons name="paw" size={36} color="rgba(255,255,255,0.25)" />
            <Ionicons
              name="paw"
              size={24}
              color="rgba(255,255,255,0.2)"
              style={{ marginTop: 8, marginLeft: 16 }}
            />
          </View>
        </ImageBackground>

        {/* Mensagem de boas-vindas */}
        <View className="items-center py-6 bg-white">
          <Text className="text-xl font-extrabold text-[#1a1a1a]">
            Mude vidas!
          </Text>
          <Text className="text-lg font-semibold text-[#1a1a1a] mt-0.5">
            A sua e a deles
          </Text>
        </View>

        {/* Pets disponíveis */}
        <View className="pt-4 pb-6 bg-white border-t border-[#f0f0f0]">
          <View className="flex-row items-center justify-between px-4 mb-3">
            <Text className="text-[13px] text-[#444] font-medium flex-1 leading-[18px]">
              Amigos que estão precisando de você
            </Text>
            <View className="flex-row gap-1">
              <TouchableOpacity
                className={`p-1 ${isFirst ? "opacity-40" : ""}`}
                onPress={scrollPrev}
                disabled={isFirst}
              >
                <Ionicons
                  name="chevron-back-circle-outline"
                  size={28}
                  color={isFirst ? "#ccc" : "#555"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                className={`p-1 ${isLast ? "opacity-40" : ""}`}
                onPress={scrollNext}
                disabled={isLast}
              >
                <Ionicons
                  name="chevron-forward-circle-outline"
                  size={28}
                  color={isLast ? "#ccc" : "#555"}
                />
              </TouchableOpacity>
            </View>
          </View>

          {carregando ? (
            <View className="h-[180px] items-center justify-center">
              <ActivityIndicator color="#6B0889" />
              <Text className="mt-2 text-[13px] text-[#555]">
                Carregando pets...
              </Text>
            </View>
          ) : erro ? (
            <View className="min-h-[160px] items-center justify-center px-5">
              <Text className="text-center text-[13px] leading-5 text-[#555]">
                {erro}{"\n"}Confira se o PostgreSQL e o backend estão ativos.
              </Text>
              <TouchableOpacity
                className="mt-3 rounded-full bg-[#6B0889] px-5 py-2"
                onPress={() => setTentativa((valor) => valor + 1)}
              >
                <Text className="font-semibold text-white">Tentar novamente</Text>
              </TouchableOpacity>
            </View>
          ) : pets.length === 0 ? (
            <Text className="px-4 py-6 text-center text-[13px] text-[#444]">
              Nenhum pet disponível com foto.
            </Text>
          ) : (
            <FlatList
              ref={flatListRef}
              data={pets}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <PetCard
                  pet={item}
                  onPress={(pet) =>
                    router.push({
                      pathname: "/pet-detalhes",
                      params: { id_animal: pet.id, nome: pet.name },
                    })
                  }
                />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="px-4 pb-1"
              snapToInterval={SNAP_INTERVAL}
              decelerationRate="fast"
              snapToAlignment="start"
              onMomentumScrollEnd={(e) => {
                const index = Math.round(
                  e.nativeEvent.contentOffset.x / SNAP_INTERVAL
                );
                setCurrentIndex(Math.min(index, pets.length - 1));
              }}
            />
          )}
        </View>

        {/* Incentivo à adoção responsável */}
        <View className="items-center py-8 px-6 bg-[#f8f7f9] gap-5">
          <Text className="text-lg font-extrabold text-[#1a1a1a] text-center leading-[26px]">
            Valorize a adoção{"\n"}responsável
          </Text>

          <View className="w-40 h-40 rounded-2xl bg-[#e8e8e8] items-center justify-center">
            <Ionicons name="paw" size={56} color="#ccc" />
          </View>

          <TouchableOpacity
            className="bg-[#7B2FBE] px-10 py-3.5 rounded-[30px]"
            onPress={() => router.push('/doar')}
          >
            <Text className="text-white font-bold text-base">Doar pet</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <SafeAreaView edges={["bottom"]} className="bg-[#6B0889]">
        <Footer backgroundColor="#6B0889" />
      </SafeAreaView>
    </View>
  );
}
