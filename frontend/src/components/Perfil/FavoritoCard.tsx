import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import FotoPet from "./FotoPet";
import SexoIcone from "./SexoIcone";
import { PetPerfil } from "./types";

export default function FavoritoCard({ pet }: { pet: PetPerfil }) {
  return (
    <View className="flex-1 rounded-xl border border-[#EEEEEE] bg-white p-1.5 shadow-sm">
      <View>
        <FotoPet foto={pet.foto} className="w-full h-[80px] rounded-lg overflow-hidden" />
        <View className="absolute bottom-1 right-1">
          <Ionicons name="heart" size={14} color="#6B0889" />
        </View>
      </View>

      <View className="mt-1.5 flex-row items-center justify-between">
        <Text className="text-[12px] font-bold text-[#F26B0F]">{pet.nome}</Text>
        <SexoIcone sexo={pet.sexo} size={13} />
      </View>
      <Text className="text-[8px] text-[#6B6B6B]">{pet.localizacao}</Text>
      <Text className="text-[9px] font-bold text-black">{pet.idade}</Text>
    </View>
  );
}
