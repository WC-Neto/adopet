import "../global.css";
import { Stack } from "expo-router";
import { CadastroPetProvider } from "../context/CadastroPetContext";

export default function Layout() {
  return (
    <CadastroPetProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </CadastroPetProvider>
  );
}
