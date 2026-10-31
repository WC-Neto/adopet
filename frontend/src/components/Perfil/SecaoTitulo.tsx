import { Text, View } from "react-native";

export default function SecaoTitulo({ titulo }: { titulo: string }) {
  return (
    <View className="mt-6 mb-3 border-b border-[#F26B0F] pb-1">
      <Text className="text-xl font-bold text-[#F26B0F]">{titulo}</Text>
    </View>
  );
}
