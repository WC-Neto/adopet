import { Ionicons } from "@expo/vector-icons";
import { Stack, router, useFocusEffect, type Href } from "expo-router";
import { useCallback, useState } from "react";
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

  // Busca o perfil dinâmico no backend baseado no usuário logado (recarrega ao voltar para a tela)
  useFocusEffect(
    useCallback(() => {
      const controller = new AbortController();
      const idUsuario = usuarioAuth?.id_usuario;
      const url = idUsuario
        ? `${API_URL}/usuarios/${idUsuario}/perfil`
        : `${API_URL}/usuarios/me`;

      fetch(url, { signal: controller.signal })
        .then((res) => (res.ok ? res.json() : Promise.reject(res)))
        .then((dados) => {
          if (dados) {
            setUsuario(dados);
          }
        })
        .catch(() => {
          // fallback: se a API de perfil falhar, usa dados básicos do usuário logado
          if (usuarioAuth) {
            setUsuario((prev) => ({
              ...prev,
              id_usuario: usuarioAuth.id_usuario ?? prev.id_usuario,
              nome_usuario: (usuarioAuth.nome as string) || prev.nome_usuario,
              email: (usuarioAuth.email as string) || prev.email,
              telefone: (usuarioAuth.telefone as string) || prev.telefone,
              cidade:
                usuarioAuth.cidade && usuarioAuth.uf
                  ? `${usuarioAuth.cidade}, ${usuarioAuth.uf}`
                  : (usuarioAuth.cidade as string) || prev.cidade,
            }));
          }
        });

      return () => controller.abort();
    }, [
      usuarioAuth?.id_usuario,
      usuarioAuth?.nome,
      usuarioAuth?.email,
      usuarioAuth?.telefone,
      usuarioAuth?.cidade,
      usuarioAuth?.uf,
    ])
  );

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
        <View style={{ width: "100%", height: 84, overflow: "hidden" }}>
          <Image
            source={require("../../assets/images/banner.jpeg")}
            style={{ width: "100%", height: 84 }}
            resizeMode="cover"
          />
        </View>

        {/* Card do perfil */}
        <View
          className="mx-2 mb-8 rounded-[28px] bg-white px-5 pb-8 shadow-md"
          style={{ marginTop: -28 }}
        >
          {/* Avatar */}
          <View className="items-center" style={{ marginTop: -50 }}>
            <View className="h-[140px] w-[140px] items-center justify-center overflow-hidden rounded-full border-[5px] border-[#F09545] bg-[#6B0889]">
              <Text className="text-[56px] font-medium text-white">
                {iniciais(usuario.nome_usuario)}
              </Text>
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
              {usuario.meus_pets.map((pet) => (
                <MeuPetCard
                  key={pet.id}
                  pet={pet}
                  onPress={(p) => console.log("Pet:", p.nome)}
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

          {/* Pets favoritos */}
          <SecaoTitulo titulo="Pets favoritos" />
          {usuario.favoritos && usuario.favoritos.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-1">
              {usuario.favoritos.map((pet) => (
                <FavoritoCard key={pet.id} pet={pet} />
              ))}
            </ScrollView>
          ) : (
            <Text className="text-[13px] text-[#888] italic py-2">
              Você ainda não tem pets favoritos. Toque em "Favoritar" na página de um pet para vê-lo aqui.
            </Text>
          )}

          {/* Verificação rápida de perfil de adoção */}
          <SecaoTitulo titulo="Perfil de adoção" />
          {usuario.perfil_adocao_resultado ? (
            <View className="rounded-xl border border-[#E8D7F2] bg-[#F8F1FB] p-3">
              <Text className="text-[13px] font-bold text-[#6B0889]">Resultado salvo</Text>
              <Text className="mt-1 text-[13px] text-[#333]">{usuario.perfil_adocao_resultado}</Text>
              <Text className="mt-1 text-[11px] text-[#666]">
                Atualizado em: {usuario.perfil_adocao_atualizado_em ? new Date(usuario.perfil_adocao_atualizado_em).toLocaleString("pt-BR") : "agora"}
              </Text>
            </View>
          ) : (
            <Text className="text-[13px] text-[#888] italic py-2">
              Faça uma verificação rápida para avaliar sua compatibilidade com a adoção.
            </Text>
          )}
          <TouchableOpacity
            onPress={() => router.push("/questionario-adocao" as Href)}
            className="mt-3 items-center rounded-full bg-[#F09545] py-2.5"
          >
            <Text className="text-[13px] font-bold text-white">
              {usuario.perfil_adocao_resultado ? "Refazer verificação rápida" : "Fazer verificação rápida"}
            </Text>
          </TouchableOpacity>

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
