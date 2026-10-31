import { Ionicons } from "@expo/vector-icons";
import { Stack, router, type Href } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Footer from "../components/Footers/Footer";
import Header from "../components/Headers/Header";
import FavoritoCard from "../components/Perfil/FavoritoCard";
import InfoLinha from "../components/Perfil/InfoLinha";
import MeuPetCard from "../components/Perfil/MeuPetCard";
import SecaoTitulo from "../components/Perfil/SecaoTitulo";
import { USUARIO_PADRAO } from "../components/Perfil/dadosPadrao";
import { Usuario } from "../components/Perfil/types";
import SideMenu from "../components/SideMenu/SideMenu";
import { API_URL } from "../services/api";
import { useAuth } from "../context/AuthContext";

// "Usuario_Silva" -> "US"
function iniciais(nome: string) {
  if (!nome) return "US";
  return nome
    .split(/[_\s]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0].toUpperCase())
    .join("");
}

export default function Conta() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { usuario: usuarioAuth, logout } = useAuth();
  const [usuario, setUsuario] = useState<Usuario>(USUARIO_PADRAO);

  // Busca o perfil dinâmico no backend baseado no usuário logado
  useEffect(() => {
    const controller = new AbortController();
    const url = usuarioAuth?.id_usuario
      ? `${API_URL}/usuarios/${usuarioAuth.id_usuario}/perfil`
      : `${API_URL}/usuarios/me`;

    fetch(url, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((dados) => {
        if (dados) setUsuario(dados);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [usuarioAuth?.id_usuario]);

  return (
    <View className="flex-1 bg-[#F2EFEF]">
      <Stack.Screen options={{ headerShown: false }} />

      {/* TOP SAFE AREA */}
      <SafeAreaView edges={["top"]} className="bg-[#FAFCFF] z-10">
        <Header
          backgroundColor="#FAFCFF"
          leftContent={
            <Pressable
              onPress={() => setMenuOpen(true)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Abrir menu"
            >
              <Ionicons name="menu" size={28} color="black" />
            </Pressable>
          }
          centerContent={
            <Text className="text-lg font-bold text-[#6B0889]">ADOPET</Text>
          }
        />
      </SafeAreaView>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <Image
          source={require("../../assets/images/banner.jpeg")}
          className="w-full h-[170px]"
          resizeMode="cover"
        />

        {/* Card do perfil */}
        <View className="mx-2 -mt-6 mb-8 rounded-[28px] bg-white px-5 pb-8 shadow-md">
          {/* Avatar */}
          <View className="items-center -mt-[70px]">
            <View className="h-[140px] w-[140px] items-center justify-center rounded-full border-[5px] border-[#F09545] bg-[#6B0889]">
              <Text className="text-[56px] font-medium text-white">
                {iniciais(usuario.nome_usuario)}
              </Text>
              <TouchableOpacity
                onPress={() => console.log("Editar foto")}
                accessibilityLabel="Editar perfil"
                className="absolute bottom-0 right-1 h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#F09545]"
              >
                <Ionicons name="pencil" size={16} color="white" />
              </TouchableOpacity>
            </View>

            <Text className="mt-3 text-xl font-bold text-[#F26B0F]">
              {usuario.nome_usuario}
            </Text>
          </View>

          {/* Informações pessoais */}
          <SecaoTitulo titulo="Informações Pessoais" />
          <InfoLinha icone="mail" rotulo="Email" valor={usuario.email} />
          <InfoLinha icone="call" rotulo="Telefone" valor={usuario.telefone} />
          <InfoLinha icone="location" rotulo="Cidade" valor={usuario.cidade} />
          <InfoLinha
            icone="calendar"
            rotulo="Data de Nascimento"
            valor={usuario.data_nascimento}
          />

          {/* Meus pets */}
          <SecaoTitulo titulo="Meus Pets para Adoção" />
          {usuario.meus_pets && usuario.meus_pets.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-1">
              {Array.from(
                new Map(usuario.meus_pets.map((pet) => [pet.id, pet])).values()
              ).map((pet, index) => (
                <MeuPetCard
                  key={`${pet.id}-${index}`}
                  pet={pet}
                  onPress={(p) =>
                    router.push({
                      pathname: "/pet-detalhes",
                      params: { id_animal: String(p.id), nome: p.nome },
                    })
                  }
                />
              ))}
            </ScrollView>
          ) : (
            <Text className="text-[13px] text-[#888] italic py-2">
              Nenhum pet cadastrado ou em processo de adoção.
            </Text>
          )}

          <TouchableOpacity
            onPress={() => router.push("/cadastro-pet" as Href)}
            className="mt-4 items-center rounded-full bg-[#6B0889] py-2.5"
          >
            <Text className="text-[13px] font-bold text-white">+ Adicionar Pet</Text>
          </TouchableOpacity>

          {/* Favoritos */}
          <SecaoTitulo titulo="Favoritos" />
          {usuario.favoritos && usuario.favoritos.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-1">
              {Array.from(
                new Map(usuario.favoritos.map((pet) => [pet.id, pet])).values()
              ).map((pet, index) => (
                <FavoritoCard key={`${pet.id}-${index}`} pet={pet} />
              ))}
            </ScrollView>
          ) : (
            <Text className="text-[13px] text-[#888] italic py-2">
              Nenhum pet adicionado aos favoritos ainda.
            </Text>
          )}

          {/* Sair */}
          <TouchableOpacity
            onPress={() => {
              logout();
              router.replace("/login" as Href);
            }}
            className="mt-6 flex-row items-center justify-center gap-1"
          >
            <Ionicons name="log-out" size={14} color="#D32F2F" />
            <Text className="text-[11px] font-bold text-[#D32F2F]">Sair da Conta</Text>
          </TouchableOpacity>
        </View>

        {/* BOTTOM SAFE AREA */}
        <SafeAreaView edges={["bottom"]} className="bg-[#6B0889]">
          <Footer backgroundColor="#6B0889" />
        </SafeAreaView>
      </ScrollView>

      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}
