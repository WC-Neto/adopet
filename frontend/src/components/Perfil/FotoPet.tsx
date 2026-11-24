import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, View } from "react-native";
import { FOTOS } from "./fotos";
import { urlDaFoto } from "../../services/animais";

type Props = { foto?: string | null; className?: string };

export default function FotoPet({ foto, className = "" }: Props) {
  const [erro, setErro] = useState(false);
  const valor = (foto || "").trim();
  const staticSource = valor ? FOTOS[valor] : undefined;

  if (staticSource) {
    return (
      <View className={`overflow-hidden bg-[#E3E3E3] ${className}`}>
        <Image source={staticSource} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
      </View>
    );
  }

  const ehRemota =
    !!valor &&
    !erro &&
    (valor.startsWith("/") ||
      valor.startsWith("http") ||
      valor.startsWith("fotos/") ||
      valor.startsWith("data:"));

  if (ehRemota) {
    return (
      <View className={`overflow-hidden bg-[#E3E3E3] ${className}`}>
        <Image
          source={{ uri: urlDaFoto(valor) }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
          onError={() => setErro(true)}
        />
      </View>
    );
  }

  return (
    <View className={`items-center justify-center overflow-hidden bg-[#E3E3E3] ${className}`}>
      <Ionicons name="paw" size={32} color="#BDBDBD" />
    </View>
  );
}
