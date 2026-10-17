import { ReactNode } from "react";
import { View } from "react-native";

type HeaderProps = {
  backgroundColor?: string;
  leftContent?: ReactNode;
  centerContent?: ReactNode;
  rightContent?: ReactNode;
};

export default function Header({
  backgroundColor = "#4897eb",
  leftContent,
  centerContent,
  rightContent,
}: HeaderProps) {
  return (
    <View
      className="flex-row items-center justify-between p-[10px] z-10 shadow-lg"
      style={{ backgroundColor }}
    >
      {/* Left Slot */}
      <View className="flex-1 items-start">{leftContent}</View>

      {/* Center Slot */}
      <View className="flex-1 items-center">{centerContent}</View>

      {/* Right Slot */}
      <View className="flex-1 items-end">{rightContent}</View>
    </View>
  );
}
