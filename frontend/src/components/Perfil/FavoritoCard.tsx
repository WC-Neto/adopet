import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import FotoPet from "./FotoPet";
import SexoIcone from "./SexoIcone";
import { PetPerfil } from "./types";

export default function FavoritoCard({ pet }: { pet: PetPerfil }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() =>
        router.push({
          pathname: "/pet-detalhes",
          params: { id_animal: String(pet.id), nome: pet.nome },
        })
      }
      className="mr-3 w-[132px] rounded-2xl border border-[#EEEEEE] bg-white p-2 shadow-sm"
    >
      <View className="relative">
        <FotoPet foto={pet.foto} className="h-[96px] w-full rounded-xl" />
        <View className="absolute bottom-1.5 right-1.5 h-6 w-6 items-center justify-center rounded-full bg-white/90">
          <Ionicons name="heart" size={14} color="#6B0889" />
        </View>
      </View>

      <View className="mt-2 flex-row items-center justify-between">
        <Text numberOfLines={1} className="mr-1 flex-1 text-[12px] font-bold text-[#F26B0F]">
          {pet.nome}
        </Text>
        <SexoIcone sexo={pet.sexo} size={13} />
      </View>
      <Text numberOfLines={1} className="text-[10px] text-[#6B6B6B]">{pet.localizacao}</Text>
      <Text numberOfLines={1} className="text-[10px] font-bold text-black">{pet.idade}</Text>
    </TouchableOpacity>
  );
}
