import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, View } from "react-native";
import { FOTOS } from "./fotos";
import { urlDaFoto } from "../../services/animais";

type Props = { foto: string; className?: string };

export default function FotoPet({ foto, className = "" }: Props) {
  const [erro, setErro] = useState(false);
  const staticSource = FOTOS[foto];

  if (staticSource) {
    return <Image source={staticSource} className={className} resizeMode="cover" />;
  }

  if (
    foto &&
    !erro &&
    (foto.startsWith("/") ||
      foto.startsWith("http") ||
      foto.startsWith("fotos/") ||
      foto.startsWith("data:"))
  ) {
    return (
      <Image
        source={{ uri: urlDaFoto(foto) }}
        className={className}
        resizeMode="cover"
        onError={() => setErro(true)}
      />
    );
  }

  return (
    <View className={`items-center justify-center bg-[#E3E3E3] ${className}`}>
      <Ionicons name="paw" size={32} color="#BDBDBD" />
    </View>
  );
}
