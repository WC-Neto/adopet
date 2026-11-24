import "../global.css";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "../context/AuthContext";

const ROTAS_PUBLICAS = new Set([
  "index",
  "login",
  "cadastro",
  "alterar-senha",
  "faq",
  "sobreNos",
  "sobre",
  "inicio",
  "pet-adocao",
  "pet-detalhes",
  "filtro",
]);

const ROTAS_APENAS_DESLOGADO = new Set(["index", "login", "cadastro"]);

function AuthGate() {
  const { usuario, carregandoSessao } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (carregandoSessao) return;

    const segmentoAtual = segments[0] ?? "index";
    const estaLogado = !!usuario?.id_usuario;

    if (estaLogado && ROTAS_APENAS_DESLOGADO.has(segmentoAtual)) {
      router.replace("/inicio");
      return;
    }

    if (!estaLogado && !ROTAS_PUBLICAS.has(segmentoAtual)) {
      router.replace("/login");
    }
  }, [usuario, carregandoSessao, segments, router]);

  if (carregandoSessao) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F2EFEF" }}>
        <ActivityIndicator size="large" color="#6B0889" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function Layout() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}
