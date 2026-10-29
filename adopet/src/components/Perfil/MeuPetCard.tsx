import { Text, TouchableOpacity, View } from "react-native";
import FotoPet from "./FotoPet";
import SexoIcone from "./SexoIcone";
import { PetPerfil } from "./types";

type Props = { pet: PetPerfil; onPress?: (pet: PetPerfil) => void };

export default function MeuPetCard({ pet, onPress }: Props) {
  const adotada = pet.status === "Adotada";

  return (
    <View className="flex-1 rounded-xl border border-[#EEEEEE] bg-white p-2 shadow-sm">
      <FotoPet foto={pet.foto} className="w-full h-[110px] rounded-2xl overflow-hidden" />

      <View className="mt-2 flex-row items-center justify-between">
        <Text className="text-[13px] font-bold text-[#F26B0F]">{pet.nome}</Text>
        <SexoIcone sexo={pet.sexo} />
      </View>
      <Text className="text-[10px] text-[#6B6B6B]">{pet.localizacao}</Text>
      <Text className="text-[10px] font-bold text-black">{pet.idade}</Text>

      <TouchableOpacity
        onPress={() => onPress?.(pet)}
        disabled={adotada}
        className={`mt-2 items-center rounded-full py-1.5 ${
          adotada ? "bg-[#B9A0C4]" : "bg-[#6B0889]"
        }`}
      >
        <Text className="text-[12px] font-bold text-white">{pet.status}</Text>
      </TouchableOpacity>
    </View>
  );
}
