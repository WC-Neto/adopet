import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import FotoPet from "./FotoPet";
import SexoIcone from "./SexoIcone";
import { PetPerfil } from "./types";

type Props = { pet: PetPerfil; onPress?: (pet: PetPerfil) => void };

export default function MeuPetCard({ pet, onPress }: Props) {
  const adotada = pet.status === "Adotado(a)";

  return (
    <View className="w-[140px] mr-3 rounded-xl border border-[#EEEEEE] bg-white p-2 shadow-sm">
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          router.push({
            pathname: "/pet-detalhes",
            params: { id_animal: String(pet.id), nome: pet.nome },
          })
        }
      >
        <FotoPet foto={pet.foto} className="w-full h-[110px] rounded-2xl overflow-hidden" />

        <View className="mt-2 flex-row items-center justify-between">
          <Text numberOfLines={1} className="text-[13px] font-bold text-[#F26B0F] flex-1 mr-1">
            {pet.nome}
          </Text>
          <SexoIcone sexo={pet.sexo} />
        </View>
        <Text numberOfLines={1} className="text-[10px] text-[#6B6B6B]">{pet.localizacao}</Text>
        <Text className="text-[10px] font-bold text-black">{pet.idade}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onPress?.(pet)}
        disabled={adotada}
        className={`mt-2 items-center rounded-full py-1.5 ${
          adotada ? "bg-[#B9A0C4]" : "bg-[#6B0889]"
        }`}
      >
        <Text className="text-[12px] font-bold text-white">{pet.status || "Disponível"}</Text>
      </TouchableOpacity>
    </View>
  );
}
