import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
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

// Restaurando as constantes necessárias para o carrossel e o array PETS
const CARD_WIDTH = 160;
const CARD_MARGIN = 12;
const SNAP_INTERVAL = CARD_WIDTH + CARD_MARGIN;

const PETS: Pet[] = [
  {
    id: "1",
    name: "Rai",
    age: "8 anos",
    location: "Três Lagoas, MS",
    imageUri: require("../../assets/images/rai.png"),
  },
  {
    id: "2",
    name: "Sam",
    age: "3 meses",
    location: "Três Lagoas, MS",
    imageUri: require("../../assets/images/sam.png"),
  },
  {
    id: "3",
    name: "Felix",
    age: "5 anos",
    location: "Três Lagoas, MS",
    imageUri: require("../../assets/images/felix.jpg"),
  },
  {
    id: "4",
    name: "Luna",
    age: "1 ano",
    location: "Três Lagoas, MS",
    imageUri: require("../../assets/images/luna.png"),
  },
];

export default function HomeScreen() {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Restaurando a lógica original de rolagem do carrossel
  const scrollPrev = () => {
    const next = Math.max(0, currentIndex - 1);
    flatListRef.current?.scrollToIndex({ index: next, animated: true });
    setCurrentIndex(next);
  };

  const scrollNext = () => {
    const next = Math.min(PETS.length - 1, currentIndex + 1);
    flatListRef.current?.scrollToIndex({ index: next, animated: true });
    setCurrentIndex(next);
  };

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === PETS.length - 1;

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
        {/* ── Hero Banner ── */}
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

        {/* ── Tagline ── */}
        <View className="items-center py-6 bg-white">
          <Text className="text-xl font-extrabold text-[#1a1a1a]">
            Mude vidas!
          </Text>
          <Text className="text-lg font-semibold text-[#1a1a1a] mt-0.5">
            A sua e a deles
          </Text>
        </View>

        {/* ── Carrossel ── */}
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

          <FlatList
            ref={flatListRef}
            data={PETS}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PetCard pet={item} onPress={(pet) => router.push({pathname: "/pet-detalhes", params: { nome: pet.name },})}/>
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
              setCurrentIndex(index);
            }}
          />
        </View>

        {/* ── Seção Doação ── */}
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