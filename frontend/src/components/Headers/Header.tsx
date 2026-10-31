import { View, Text, TouchableOpacity } from 'react-native';
import { ReactNode, useState } from 'react';
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from 'expo-router'; // 1. Importar o router do Expo
import SideMenu from '../SideMenu/SideMenu'; // 2. Importar o SideMenu para dentro do Header
import { useAuth } from '../../context/AuthContext';

type HeaderProps = {
  backgroundColor?: string;
  leftContent?: ReactNode;
  centerContent?: ReactNode;
  rightContent?: ReactNode;
  

  showMenu?: boolean;
  showAdotarButton?: boolean;
};

export default function Header({ 
  backgroundColor = '#FAFCFF',
  leftContent, 
  centerContent, 
  rightContent,
  showMenu = true, 
  showAdotarButton = true 
}: HeaderProps) {

    // 3. O estado do Menu agora vive DENTRO do Header
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();
    const { usuario } = useAuth();

    return (
        <>
            <View 
                className="flex-row items-center justify-between p-[10px] z-10 shadow-lg border-b border-[#f0f0f0]" 
                style={{ backgroundColor }}
            >
                <View className="flex-1 items-start">
                    {showMenu ? (
                        <TouchableOpacity
                            onPress={() => setMenuOpen(true)} 
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
                    {showAdotarButton ? (
                        <TouchableOpacity
                            onPress={() => router.push('/inicio')} 
                            className="bg-[#1a1a1a] px-[18px] py-2 rounded-lg"
                        >
                            <Text className="text-white font-bold text-sm">Adotar</Text>
                        </TouchableOpacity>
                    ) : (
                        rightContent
                    )}
                </View>
            </View>

            {/* 5. O SideMenu é renderizado aqui mesmo no Header! */}
            <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
        </>
    );
}