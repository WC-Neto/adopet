import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import FotoPet from "./FotoPet";
import SexoIcone from "./SexoIcone";
import { PetPerfil } from "./types";

type Props = { pet: PetPerfil; onPress?: (pet: PetPerfil) => void };

export default function MeuPetCard({ pet, onPress }: Props) {
  const status = pet.status || "Disponível";
  const adotada = status === "Adotado(a)" || status === "Adotado";

  return (
    <View className="mr-3 w-[150px] rounded-2xl border border-[#EEEEEE] bg-white p-2 shadow-sm">
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() =>
          router.push({
            pathname: "/pet-detalhes",
            params: { id_animal: String(pet.id), nome: pet.nome },
          })
        }
      >
        <FotoPet foto={pet.foto} className="h-[118px] w-full rounded-xl" />

        <View className="mt-2 flex-row items-center justify-between">
          <Text numberOfLines={1} className="mr-1 flex-1 text-[13px] font-bold text-[#F26B0F]">
            {pet.nome}
          </Text>
          <SexoIcone sexo={pet.sexo} />
        </View>
        <Text numberOfLines={1} className="text-[11px] text-[#6B6B6B]">{pet.localizacao}</Text>
        <Text numberOfLines={1} className="text-[11px] font-bold text-black">{pet.idade}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onPress?.(pet)}
        disabled={adotada}
        className={`mt-2 items-center rounded-full py-2 ${
          adotada ? "bg-[#B9A0C4]" : "bg-[#6B0889]"
        }`}
      >
        <Text numberOfLines={1} className="px-2 text-[12px] font-bold text-white">{status}</Text>
      </TouchableOpacity>
    </View>
  );
}
