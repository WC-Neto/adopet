import { useEffect, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import { useRouter, type Href } from "expo-router";

type ItemMenu = { label: string; rota: string };

const FALLBACK: ItemMenu[] = [
  { label: "Início", rota: "/" },
  { label: "Adotar", rota: "/adotar" },
  { label: "Doar", rota: "/cadastro-pet" },
  { label: "Minha conta", rota: "/conta" },
  { label: "Sobre nós", rota: "/sobreNos" },
  { label: "FAQ", rota: "/faq" },
];

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000";
const MONO = Platform.select({ ios: "Menlo", default: "monospace" });
const DURACAO = 300;

// Proporção da imagem de fundo (937 x 1678)
const RATIO = 937 / 1678;

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SideMenu({ open, onClose }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  // Menu com a proporção da imagem, limitado a 90% da largura da tela
  const menuWidth = Math.min(height * RATIO, width * 0.9);

  const [items, setItems] = useState<ItemMenu[]>(FALLBACK);
  const [mounted, setMounted] = useState(open);
  const progress = useSharedValue(open ? 1 : 0);

  // Busca os itens no backend; se falhar, mantém o fallback
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_URL}/menu`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(setItems)
      .catch(() => {});
    return () => controller.abort();
  }, []);

  // Ao abrir, monta o Modal já neste render (sem setState dentro de efeito)
  if (open && !mounted) setMounted(true);

  // Anima abrir/fechar; só desmonta o Modal depois que a animação termina
  useEffect(() => {
    const config = { duration: DURACAO, easing: Easing.out(Easing.cubic) };
    progress.value = withTiming(open ? 1 : 0, config);
    if (open) return;
    const t = setTimeout(() => setMounted(false), DURACAO);
    return () => clearTimeout(t);
  }, [open, progress]);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const menuStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: (progress.value - 1) * menuWidth }],
  }));

  function navegar(rota: string) {
    onClose();
    router.push(rota as Href);
  }

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={StyleSheet.absoluteFill}>
        {/* Overlay: toque fora fecha o menu */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: "rgba(0,0,0,0.5)" },
            overlayStyle,
          ]}
        >
          <Pressable
            style={{ flex: 1 }}
            onPress={onClose}
            accessibilityLabel="Fechar menu"
          />
        </Animated.View>

        {/* Menu */}
        <Animated.View
          style={[
            {
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              width: menuWidth,
              backgroundColor: "#F4A460",
              overflow: "hidden",
            },
            menuStyle,
          ]}
        >
          {/* Imagem de fundo: camada absoluta que preenche o menu */}
          <Image
            source={require("../../../assets/images/menu-bg.png")}
            contentFit="cover"
            contentPosition="top"
            style={StyleSheet.absoluteFill}
          />

          {/* Conteúdo por cima da imagem */}
          <View style={{ paddingTop: insets.top + 16 }}>
            <View className="flex-row items-center justify-between px-5">
              <Text
                style={{ fontFamily: MONO }}
                className="text-xl font-bold tracking-widest text-white"
              >
                ADOPET
              </Text>
              <Pressable
                onPress={onClose}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Fechar menu"
                className="border border-white p-0.5"
              >
                <Feather name="x" size={28} color="#fff" />
              </Pressable>
            </View>

            <View className="mt-7 gap-4 px-5">
              {items.map((item) => (
                <Pressable
                  key={item.rota}
                  onPress={() => navegar(item.rota)}
                  accessibilityRole="link"
                >
                  <Text
                    style={{ fontFamily: MONO }}
                    className="text-lg tracking-wider text-white"
                  >
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}