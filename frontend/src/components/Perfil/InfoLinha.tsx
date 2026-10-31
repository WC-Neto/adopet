import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { Text, View } from "react-native";

type Props = {
  icone: ComponentProps<typeof Ionicons>["name"];
  rotulo: string;
  valor: string;
};

export default function InfoLinha({ icone, rotulo, valor }: Props) {
  return (
    <View className="flex-row items-start gap-3 mb-3">
      <Ionicons name={icone} size={18} color="#F26B0F" />
      <View>
        <Text className="text-[12px] font-bold text-black">{rotulo}</Text>
        <Text className="text-[12px] text-[#6B6B6B] mt-0.5">{valor}</Text>
      </View>
    </View>
  );
}
