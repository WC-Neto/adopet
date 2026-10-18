import "../global.css";
import { Image } from "react-native";
import { cssInterop } from "nativewind";
import { Stack } from "expo-router";

// faz o Image do react-native entender className em todas as telas
cssInterop(Image, { className: "style" });

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}