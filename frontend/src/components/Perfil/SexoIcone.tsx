import { Ionicons } from "@expo/vector-icons";
import { PetPerfil } from "./types";

export default function SexoIcone({ sexo, size = 16 }: { sexo: PetPerfil["sexo"]; size?: number }) {
  return sexo === "F" ? (
    <Ionicons name="female" size={size} color="#E84393" />
  ) : (
    <Ionicons name="male" size={size} color="#1E9BE9" />
  );
}
