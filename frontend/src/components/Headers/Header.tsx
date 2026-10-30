import { Ionicons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import { useState, type ReactNode } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import SideMenu from "../SideMenu/SideMenu";

type HeaderProps = {
  backgroundColor?: string;
  centerContent?: ReactNode;
  showAdotarButton?: boolean;
};

export default function Header({
  backgroundColor = "#FAFCFF",
  centerContent,
  showAdotarButton = true,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <View
        className="flex-row items-center justify-between p-[10px] z-10 shadow-lg border-b border-[#f0f0f0]"
        style={{ backgroundColor }}
      >
        <View className="flex-1 items-start">
          <TouchableOpacity
            onPress={() => setMenuOpen(true)}
            className="p-1"
            accessibilityRole="button"
            accessibilityLabel="Abrir menu"
          >
            <Ionicons name="menu" size={28} color="#333" />
          </TouchableOpacity>
        </View>

        <View className="flex-1 items-center">
          {centerContent ?? (
            <Text className="text-xl font-extrabold text-[#7B2FBE] tracking-[1.5px]">
              ADOPET
            </Text>
          )}
        </View>

        <View className="flex-1 items-end">
          {showAdotarButton ? (
            <TouchableOpacity
              onPress={() => router.push("/pet-adocao" as Href)}
              className="rounded-lg bg-[#1A1A1A] px-[18px] py-2"
              accessibilityRole="button"
              accessibilityLabel="Adotar um pet"
            >
              <Text className="text-sm font-bold text-white">Adotar</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
