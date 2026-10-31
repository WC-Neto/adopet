import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";

import Footer from "../components/Footers/Footer";
import Header from "../components/Headers/Header";
import { useAuth } from "../context/AuthContext";
import {
  adicionarFavorito,
  buscarAnimal,
  calcularIdade,
  formatarSexo,
  gerarLinkWhatsappAdocao,
  obterPerfilUsuario,
  solicitarAdocao,
  type Animal,
  urlDaFoto,
} from "../services/animais";

function exibirAlerta(titulo: string, mensagem: string) {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    window.alert(`${titulo}\n\n${mensagem}`);
  } else {
    Alert.alert(titulo, mensagem);
  }
}

function getParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function display(value?: string | null) {
  return value?.trim() || "Não informado";
}

function displayBoolean(value?: boolean | null) {
  if (value === undefined || value === null) return "Não informado";
  return value ? "Sim" : "Não";
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <Text className="mb-2 text-[14px] leading-[19px] text-[#171717]">
      <Text className="font-bold">{label}: </Text>
      {value}
    </Text>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <Text className="mb-2 text-[16px] font-bold text-[#D97836]">
      {children}
    </Text>
  );
}

export default function PetDetailsScreen() {
  const { usuario } = useAuth();
  const params = useLocalSearchParams<{
    id?: string | string[];
    id_animal?: string | string[];
    nome?: string | string[];
    name?: string | string[];
  }>();
  const animalId = getParam(params.id_animal ?? params.id);
  const animalName = getParam(params.nome ?? params.name);
  const [tentativa, setTentativa] = useState(0);
  const [resultado, setResultado] = useState<{
    id: string;
    tentativa: number;
    animal: Animal | null;
    erro: string;
  } | null>(null);

  const [solicitando, setSolicitando] = useState(false);
  const [solicitado, setSolicitado] = useState(false);
  const [favoritado, setFavoritado] = useState(false);
  const [statusNaLista, setStatusNaLista] = useState<string | null>(null);
  const [mensagemFeedback, setMensagemFeedback] = useState<string | null>(null);

  const idValido = Boolean(animalId && /^\d+$/.test(animalId));
  const resultadoAtual =
    resultado !== null &&
    resultado.id === animalId &&
    resultado.tentativa === tentativa
      ? resultado
      : null;
  const animal = resultadoAtual?.animal ?? null;
  const carregando = idValido && resultadoAtual === null;
  const erro = idValido
    ? resultadoAtual?.erro ?? ""
    : "O ID do pet é inválido. Volte e selecione um card.";
  const ehMeuPet = Boolean(
    animal && usuario?.id_usuario && animal.id_responsavel === usuario.id_usuario
  );

  useEffect(() => {
    let ativo = true;

    if (!animalId || !/^\d+$/.test(animalId)) return;

    setMensagemFeedback(null);

    buscarAnimal(animalId)
      .then((dados) => {
        if (ativo) {
          setResultado({ id: animalId, tentativa, animal: dados, erro: "" });
        }
      })
      .catch((falha: unknown) => {
        if (ativo) {
          setResultado({
            id: animalId,
            tentativa,
            animal: null,
            erro:
              falha instanceof Error
                ? falha.message
                : "Não foi possível carregar os detalhes do pet.",
          });
        }
      });

    if (usuario?.id_usuario) {
      obterPerfilUsuario(usuario.id_usuario)
        .then((perfil) => {
          if (!ativo || !perfil) return;
          const idNum = Number(animalId);
          const petNaLista = Array.isArray(perfil.meus_pets)
            ? perfil.meus_pets.find((p: any) => Number(p.id) === idNum)
            : null;
          const petFavorito = Array.isArray(perfil.favoritos)
            ? perfil.favoritos.some((p: any) => Number(p.id) === idNum)
            : false;

          if (petNaLista) {
            setSolicitado(true);
            setStatusNaLista(petNaLista.status || "Em Processo");
          } else {
            setSolicitado(false);
            setStatusNaLista(null);
          }
          setFavoritado(petFavorito);
        })
        .catch(() => {});
    }

    return () => {
      ativo = false;
    };
  }, [animalId, tentativa, usuario?.id_usuario]);

  const handleAdotar = async () => {
    if (!animal) return;

    if (ehMeuPet) {
      const msg =
        "Este pet foi cadastrado por você e já está na sua lista de pets para adoção.";
      setMensagemFeedback(msg);
      exibirAlerta("Pet já está na sua lista", msg);
      return;
    }

    const linkWhatsapp = gerarLinkWhatsappAdocao(animal, usuario?.nome);

    if (!linkWhatsapp) {
      exibirAlerta(
        "Contato indisponível",
        "O responsável por este pet não possui número de telefone cadastrado."
      );
      return;
    }

    if (solicitado) {
      const msg = `Este pet já está na sua lista de adoção (${statusNaLista || "Em Processo"}). Abrindo o WhatsApp para continuar a conversa.`;
      setMensagemFeedback(msg);
      exibirAlerta("Já está na sua lista", msg);
      await Linking.openURL(linkWhatsapp).catch(() => {});
      return;
    }

    try {
      setSolicitando(true);
      if (usuario?.id_usuario) {
        const resp = await solicitarAdocao(
          animal.id_animal,
          usuario.id_usuario
        );
        setSolicitado(true);
        setFavoritado(true);
        setStatusNaLista("Em Processo");
        if (resp?.ja_existia) {
          setMensagemFeedback(resp.mensagem);
          exibirAlerta("Já está na sua lista", resp.mensagem);
        } else {
          setMensagemFeedback(
            "Pet adicionado à sua lista em 'Em Processo' e aos seus Favoritos!"
          );
        }
      }
      await Linking.openURL(linkWhatsapp);
    } catch (e: any) {
      const msgErro =
        e?.message || "Não foi possível registrar a solicitação de adoção.";
      setMensagemFeedback(msgErro);
      exibirAlerta("Aviso", msgErro);
    } finally {
      setSolicitando(false);
    }
  };

  const handleFavoritar = async () => {
    if (!animal) return;

    if (!usuario) {
      exibirAlerta(
        "Login Necessário",
        "Faça login para salvar seus pets favoritos."
      );
      return;
    }

    if (favoritado) {
      const msg = `${animal.nome} já está na sua lista de favoritos.`;
      setMensagemFeedback(msg);
      exibirAlerta("Já favoritado", msg);
      return;
    }

    try {
      await adicionarFavorito(animal.id_animal, usuario.id_usuario);
      setFavoritado(true);
      const msg = `${animal.nome} foi adicionado aos seus favoritos.`;
      setMensagemFeedback(msg);
      exibirAlerta("Favoritado! ❤️", msg);
    } catch (e: any) {
      exibirAlerta("Aviso", e.message || "Erro ao favoritar pet.");
    }
  };

  return (
    <View className="flex-1 bg-[#F8F7F9]">
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView edges={["top"]} className="z-10 bg-white">
        <Header backgroundColor="white" showAdotarButton={false} />
      </SafeAreaView>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        <View className="relative h-[92px] justify-center overflow-hidden bg-[#F09545] px-5">
          <Ionicons
            name="paw"
            size={82}
            color="rgba(220, 91, 35, 0.24)"
            style={{
              position: "absolute",
              right: 18,
              top: -22,
              transform: [{ rotate: "-24deg" }],
            }}
          />
          <Text className="text-center font-mono text-[16px] font-bold text-white">
            {animal?.nome || animalName || "Detalhes do Pet"}
          </Text>
        </View>

        <View className="mx-3 -mt-5 rounded-[12px] border border-[#DCDCDC] bg-white p-3 shadow-sm">
          {carregando ? (
            <View className="h-56 items-center justify-center">
              <ActivityIndicator color="#6B0889" />
              <Text className="mt-2 text-[13px] text-[#555]">
                Carregando informações do pet...
              </Text>
            </View>
          ) : erro || !animal ? (
            <View className="min-h-56 items-center justify-center px-4">
              <Text className="text-center text-[13px] leading-5 text-[#555]">
                {erro || "Não foi possível exibir o pet solicitado."}
              </Text>
              {idValido && (
                <TouchableOpacity
                  onPress={() => setTentativa((atual) => atual + 1)}
                  className="mt-3 rounded-full bg-[#6B0889] px-5 py-2"
                >
                  <Text className="text-[14px] font-semibold text-white">
                    Tentar novamente
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <>
              <View className="flex-row items-center border-b border-[#BEBEBE] p-2">
                <Image
                  source={{ uri: urlDaFoto(animal.foto_url) }}
                  className="h-[120px] w-[128px] rounded-[12px] bg-[#E5E5E5]"
                  resizeMode="cover"
                  accessibilityLabel={`Foto de ${animal.nome}`}
                />
                <View className="ml-3 flex-1">
                  <DetailLine label="Espécie" value={display(animal.especie)} />
                  <DetailLine label="Porte" value={display(animal.porte)} />
                  <DetailLine label="Sexo" value={formatarSexo(animal.sexo)} />
                  <DetailLine
                    label="Idade"
                    value={calcularIdade(animal.dt_nascimento)}
                  />
                </View>
              </View>

              <View className="border-b border-[#BEBEBE] px-1 pb-1 pt-2">
                <SectionTitle>Saúde e bem-estar do pet</SectionTitle>
                <DetailLine
                  label="Castrado?"
                  value={displayBoolean(animal.castrado)}
                />
                <DetailLine label="Vacinas" value={display(animal.vacinas)} />
                <DetailLine
                  label="Vermifugado?"
                  value={displayBoolean(animal.vermifugado)}
                />
                <DetailLine
                  label="Condição especial?"
                  value={displayBoolean(animal.condicao_especial)}
                />
                <DetailLine
                  label="Medicamento contínuo?"
                  value={displayBoolean(animal.medicamento_continuo)}
                />
                <DetailLine
                  label="Histórico de saúde"
                  value={display(animal.historico_saude)}
                />
                <DetailLine
                  label="Microchipado?"
                  value={displayBoolean(animal.microchipado)}
                />
              </View>

              <View className="border-b border-[#BEBEBE] px-1 pb-2 pt-2">
                <SectionTitle>História e comportamento</SectionTitle>
                <DetailLine label="História" value={display(animal.historia)} />
                <DetailLine
                  label="Motivo da doação"
                  value={display(animal.motivo_doacao)}
                />
                <DetailLine
                  label="Personalidade"
                  value={display(animal.personalidade)}
                />
              </View>

              <View className="px-1 pb-2 pt-2">
                <SectionTitle>Responsável pelo pet</SectionTitle>
                <DetailLine
                  label="Nome"
                  value={display(animal.nome_responsavel || "ONG / Protetor")}
                />
                <DetailLine
                  label="Telefone / Contato"
                  value={display(animal.telefone_responsavel)}
                />
                <DetailLine
                  label="Localização"
                  value={display(
                    [animal.cidade, animal.uf].filter(Boolean).join(", ")
                  )}
                />
              </View>

              {(ehMeuPet || solicitado || mensagemFeedback) && (
                <View className="mx-1 mt-2 rounded-lg border border-[#E5D4EF] bg-[#F7EFFB] px-3 py-2">
                  <Text className="text-center text-[12px] font-medium text-[#6B0889]">
                    {mensagemFeedback ||
                      (ehMeuPet
                        ? "Este pet foi cadastrado por você e já está na sua lista (Disponível)."
                        : `Este pet já está na sua lista de adoção (${statusNaLista || "Em Processo"}).`)}
                  </Text>
                </View>
              )}

              <View className="flex-row items-center justify-center gap-3 border-t border-[#BEBEBE] py-4 mt-2">
                <TouchableOpacity
                  onPress={handleFavoritar}
                  className={`h-11 w-11 items-center justify-center rounded-full border ${
                    favoritado
                      ? "border-[#E04A32] bg-[#FDE8E8]"
                      : "border-[#D1D5DB] bg-white"
                  }`}
                  accessibilityLabel="Favoritar pet"
                >
                  <Ionicons
                    name={favoritado ? "heart" : "heart-outline"}
                    size={24}
                    color={favoritado ? "#E04A32" : "#6B0889"}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleAdotar}
                  disabled={solicitando}
                  accessibilityRole="button"
                  className={`flex-row items-center gap-2 rounded-full px-6 py-3 ${
                    ehMeuPet
                      ? "border border-[#9CA3AF] bg-[#E5E7EB]"
                      : solicitado
                        ? "border border-[#10B981] bg-[#D1FAE5]"
                        : "bg-[#6B0889]"
                  }`}
                >
                  {solicitando ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <>
                      <Ionicons
                        name={ehMeuPet ? "checkmark-circle" : "logo-whatsapp"}
                        size={19}
                        color={
                          ehMeuPet
                            ? "#4B5563"
                            : solicitado
                              ? "#065F46"
                              : "white"
                        }
                      />
                      <Text
                        className={`text-[14px] font-bold ${
                          ehMeuPet
                            ? "text-[#4B5563]"
                            : solicitado
                              ? "text-[#065F46]"
                              : "text-white"
                        }`}
                      >
                        {ehMeuPet
                          ? "Seu pet (Já na lista)"
                          : solicitado
                            ? "Já na lista • WhatsApp"
                            : "Adote-me"}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <SafeAreaView edges={["bottom"]} className="bg-[#6B0889]">
        <Footer backgroundColor="#6B0889" />
      </SafeAreaView>
    </View>
  );
}
