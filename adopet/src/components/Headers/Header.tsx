import { View, Text, TouchableOpacity } from 'react-native';
import { ReactNode } from 'react';
import { Ionicons } from "@expo/vector-icons";

type HeaderProps = {
  backgroundColor?: string;
  leftContent?: ReactNode;
  centerContent?: ReactNode;
  rightContent?: ReactNode;
 
  onMenuPress?: () => void;
  onAdotarPress?: () => void;
};

export default function Header({ 
  backgroundColor = '#FAFCFF',
  leftContent, 
  centerContent, 
  rightContent,
  onMenuPress,
  onAdotarPress
}: HeaderProps) {
    return (
        <View 
            className="flex-row items-center justify-between p-[10px] z-10 shadow-lg border-b border-[#f0f0f0]" 
            style={{ backgroundColor }}
        >
            
            <View className="flex-1 items-start">
                {onMenuPress ? (
                    <TouchableOpacity
                        onPress={onMenuPress}
                        className="p-1"
                        accessibilityRole="button"
                        accessibilityLabel="Abrir menu"
                    >
                        <Ionicons name="menu" size={28} color="#333" />
                    </TouchableOpacity>
                ) : (
                    leftContent
                )}
            </View>

            
            <View className="flex-1 items-center">
                {centerContent ? centerContent : (
                    <Text className="text-xl font-extrabold text-[#7B2FBE] tracking-[1.5px]">
                        ADOPET
                    </Text>
                )}
            </View>
            
            
            <View className="flex-1 items-end">
                {onAdotarPress ? (
                    <TouchableOpacity
                        onPress={onAdotarPress}
                        className="bg-[#1a1a1a] px-[18px] py-2 rounded-lg"
                    >
                        <Text className="text-white font-bold text-sm">Adotar</Text>
                    </TouchableOpacity>
                ) : (
                    rightContent
                )}
            </View>
        </View>
    );
}