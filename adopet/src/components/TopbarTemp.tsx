import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface TopBarProps {
  onMenuPress?: () => void;
  onAdotarPress?: () => void;
}

export default function TopBar({ onMenuPress, onAdotarPress }: TopBarProps) {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-[#f0f0f0]">
      <TouchableOpacity
        onPress={onMenuPress}
        className="p-1"
        accessibilityRole="button"
        accessibilityLabel="Abrir menu"
      >
        <Ionicons name="menu" size={28} color="#333" />
      </TouchableOpacity>

      <Text className="text-xl font-extrabold text-[#7B2FBE] tracking-[1.5px]">
        ADOPET
      </Text>

      <TouchableOpacity
        onPress={onAdotarPress}
        className="bg-[#1a1a1a] px-[18px] py-2 rounded-lg"
      >
        <Text className="text-white font-bold text-sm">Adotar</Text>
      </TouchableOpacity>
    </View>
  );
}
