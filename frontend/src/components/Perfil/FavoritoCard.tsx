import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import FotoPet from "./FotoPet";
import SexoIcone from "./SexoIcone";
import { PetPerfil } from "./types";

export default function FavoritoCard({ pet }: { pet: PetPerfil }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: "/pet-detalhes",
          params: { id_animal: String(pet.id), nome: pet.nome },
        })
      }
      className="w-[105px] mr-2.5 rounded-xl border border-[#EEEEEE] bg-white p-1.5 shadow-sm"
    >
      <View>
        <FotoPet foto={pet.foto} className="w-full h-[80px] rounded-lg overflow-hidden" />
        <View className="absolute bottom-1 right-1">
          <Ionicons name="heart" size={14} color="#6B0889" />
        </View>
      </View>

      <View className="mt-1.5 flex-row items-center justify-between">
        <Text numberOfLines={1} className="text-[12px] font-bold text-[#F26B0F] flex-1 mr-1">
          {pet.nome}
        </Text>
        <SexoIcone sexo={pet.sexo} size={13} />
      </View>
      <Text numberOfLines={1} className="text-[8px] text-[#6B6B6B]">{pet.localizacao}</Text>
      <Text className="text-[9px] font-bold text-black">{pet.idade}</Text>
    </TouchableOpacity>
  );
}
