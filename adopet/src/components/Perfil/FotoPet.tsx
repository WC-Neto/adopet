import { Ionicons } from "@expo/vector-icons";
import { Image, View } from "react-native";
import { FOTOS } from "./fotos";

type Props = { foto: string; className?: string };

export default function FotoPet({ foto, className = "" }: Props) {
  const source = FOTOS[foto];

  if (!source) {
    return (
      <View className={`items-center justify-center bg-[#E3E3E3] ${className}`}>
        <Ionicons name="paw" size={32} color="#BDBDBD" />
      </View>
    );
  }

  return <Image source={source} className={className} resizeMode="cover" />;
}
