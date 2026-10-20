import { Image, Text, TouchableOpacity, View } from "react-native";

export interface Pet {
  id: string;
  name: string;
  age: string;
  location: string;
  imageUri: string | number;
}

interface PetCardProps {
  pet: Pet;
  onPress?: (pet: Pet) => void;
}

export default function PetCard({ pet, onPress }: PetCardProps) {
  return (
    <TouchableOpacity
      className="w-40 mr-3 rounded-lg overflow-hidden bg-white"
      onPress={() => onPress?.(pet)}
      activeOpacity={0.85}
    >
      <Image
        source={
          typeof pet.imageUri === "string" ? { uri: pet.imageUri } : pet.imageUri
        }
        className="w-40 h-[140px] bg-[#e0e0e0]"
        resizeMode="cover"
      />
      <View className="pt-1.5 px-0.5">
        <Text className="text-[15px] font-bold text-[#E07B00]">{pet.name}</Text>
        <Text className="text-[13px] font-semibold text-[#333]">{pet.age}</Text>
        <Text className="text-xs text-[#666] mt-px">{pet.location}</Text>
      </View>
    </TouchableOpacity>
  );
}