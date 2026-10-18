import { FontAwesome } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface FooterProps {
  onFacebookPress?: () => void;
  onInstagramPress?: () => void;
  onYoutubePress?: () => void;
}

export default function Footer({
  onFacebookPress,
  onInstagramPress,
  onYoutubePress,
}: FooterProps) {
  const socialIcon =
    "w-11 h-11 rounded-full bg-white/15 items-center justify-center";

  return (
    <View className="bg-[#7B2FBE] pt-9 pb-8 px-6 items-center gap-4">
      <Text className="text-white text-[26px] font-extrabold tracking-[2px]">
        ADOPET
      </Text>

      <Text className="text-white/75 text-[13px] text-center leading-5">
        Conectando pets a famílias com amor e responsabilidade.
      </Text>

      <View className="w-12 h-0.5 bg-white/30 rounded-sm" />

      <View className="flex-row gap-7 mt-2">
        <TouchableOpacity onPress={onFacebookPress} className={socialIcon}>
          <FontAwesome name="facebook" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={onInstagramPress} className={socialIcon}>
          <FontAwesome name="instagram" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={onYoutubePress} className={socialIcon}>
          <FontAwesome name="youtube-play" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text className="text-white/50 text-[11px] mt-2">
        © 2025 Adopet — Três Lagoas, MS
      </Text>
    </View>
  );
}
