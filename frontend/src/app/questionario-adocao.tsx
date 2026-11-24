import { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Headers/Header";
import Footer from "../components/Footers/Footer";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../services/api";

type Opcao = { label: string; valor: string; pontos: number };
type Pergunta = { id: string; titulo: string; opcoes: Opcao[] };

const PERGUNTAS: Pergunta[] = [
  {
    id: "moradia",
    titulo: "1. Qual é o seu tipo de moradia?",
    opcoes: [
      { label: "Casa própria com quintal/área segura", valor: "casa_quintal", pontos: 3 },
      { label: "Casa sem quintal, mas com espaço interno", valor: "casa_sem_quintal", pontos: 2 },
      { label: "Apartamento com telas/área segura", valor: "apto_seguro", pontos: 2 },
      { label: "Apartamento sem telas ou moradia instável", valor: "instavel", pontos: 0 },
    ],
  },
  {
    id: "espaco",
    titulo: "2. O espaço disponível é adequado para um pet?",
    opcoes: [
      { label: "Sim, tenho espaço suficiente e seguro", valor: "sim", pontos: 3 },
      { label: "Parcialmente, mas consigo adaptar", valor: "parcial", pontos: 2 },
      { label: "Tenho pouco espaço", valor: "pouco", pontos: 1 },
      { label: "Não tenho espaço adequado", valor: "nao", pontos: 0 },
    ],
  },
  {
    id: "outros_animais",
    titulo: "3. Você possui outros animais em casa?",
    opcoes: [
      { label: "Não", valor: "nao", pontos: 2 },
      { label: "Sim, e são sociáveis/adaptáveis", valor: "sim_sociaveis", pontos: 3 },
      { label: "Sim, mas exigem adaptação cuidadosa", valor: "sim_adaptacao", pontos: 1 },
      { label: "Sim, e há conflitos frequentes", valor: "sim_conflitos", pontos: 0 },
    ],
  },
  {
    id: "experiencia",
    titulo: "4. Qual sua experiência prévia com pets?",
    opcoes: [
      { label: "Já tive e cuidei por bastante tempo", valor: "alta", pontos: 3 },
      { label: "Já tive alguma experiência", valor: "media", pontos: 2 },
      { label: "Pouca experiência, mas estou disposto(a) a aprender", valor: "baixa", pontos: 1 },
      { label: "Nenhuma experiência", valor: "nenhuma", pontos: 0 },
    ],
  },
  {
    id: "tempo",
    titulo: "5. Quanto tempo por dia você pode dedicar ao pet?",
    opcoes: [
      { label: "Mais de 3 horas (cuidados, passeios e atenção)", valor: "alto", pontos: 3 },
      { label: "De 1 a 3 horas", valor: "medio", pontos: 2 },
      { label: "Menos de 1 hora", valor: "baixo", pontos: 1 },
      { label: "Quase nenhum tempo disponível", valor: "nenhum", pontos: 0 },
    ],
  },
  {
    id: "criancas",
    titulo: "6. Há crianças em casa?",
    opcoes: [
      { label: "Não", valor: "nao", pontos: 2 },
      { label: "Sim, e todos respeitam animais", valor: "sim_respeitam", pontos: 3 },
      { label: "Sim, mas será necessário supervisão/adaptação", valor: "sim_supervisao", pontos: 1 },
      { label: "Sim, e há dificuldade de convivência com animais", valor: "sim_dificuldade", pontos: 0 },
    ],
  },
];

function calcularResultado(respostas: Record<string, Opcao>) {
  const total = Object.values(respostas).reduce((acc, r) => acc + r.pontos, 0);
  const max = PERGUNTAS.length * 3;
  const percentual = Math.round((total / max) * 100);

  if (percentual >= 75) {
    return {
      titulo: "Alta compatibilidade",
      descricao:
        "Seu perfil indica boa preparação para adotar com responsabilidade. Você parece ter condições e rotina favoráveis para receber um pet.",
      percentual,
    };
  }
  if (percentual >= 45) {
    return {
      titulo: "Compatibilidade média",
      descricao:
        "Seu perfil tem pontos positivos, mas alguns ajustes podem ajudar (rotina, espaço, adaptação com outros moradores/animais ou tempo disponível).",
      percentual,
    };
  }
  return {
    titulo: "Baixa compatibilidade no momento",
    descricao:
      "No momento, alguns fatores podem dificultar a adoção responsável. Vale revisar sua rotina e ambiente antes de adotar para garantir o bem-estar do pet.",
    percentual,
  };
}

export default function QuestionarioAdocaoScreen() {
  const { usuario } = useAuth();
  const [respostas, setRespostas] = useState<Record<string, Opcao>>({});
  const [resultado, setResultado] = useState<ReturnType<typeof calcularResultado> | null>(null);
  const [salvando, setSalvando] = useState(false);

  const concluido = useMemo(() => PERGUNTAS.every((p) => respostas[p.id]), [respostas]);

  const selecionar = (perguntaId: string, opcao: Opcao) => {
    setRespostas((prev) => ({ ...prev, [perguntaId]: opcao }));
  };

  const finalizar = async () => {
    if (!concluido) {
      Alert.alert("Questionário incompleto", "Responda todas as perguntas para ver o resultado.");
      return;
    }

    const calc = calcularResultado(respostas);
    setResultado(calc);

    if (!usuario?.id_usuario) {
      Alert.alert(
        "Resultado gerado",
        "Faça login para salvar o resultado no seu perfil.",
        [{ text: "OK" }]
      );
      return;
    }

    try {
      setSalvando(true);
      const payloadRespostas = Object.fromEntries(
        Object.entries(respostas).map(([k, v]) => [k, v.valor])
      );
      const textoResultado = `${calc.titulo} (${calc.percentual}%). ${calc.descricao}`;

      const resp = await fetch(`${API_URL}/usuarios/${usuario.id_usuario}/questionario-adocao`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resultado: textoResultado,
          respostas: payloadRespostas,
          atualizado_em: new Date().toISOString(),
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err?.detail || "Não foi possível salvar o resultado no perfil.");
      }
    } catch (e: any) {
      Alert.alert("Aviso", e?.message || "O resultado foi calculado, mas não pôde ser salvo agora.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <View className="flex-1 bg-[#F2EFEF]">
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView edges={["top"]} className="bg-white">
        <Header
          backgroundColor="white"
          leftContent={
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </Pressable>
          }
          centerContent={<Text className="text-base font-bold text-[#6B0889]">Perfil de adoção</Text>}
          showAdotarButton={false}
        />
      </SafeAreaView>

      <ScrollView className="flex-1 px-4 py-4" contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="rounded-2xl bg-white p-4 mb-4 border border-[#eee]">
          <Text className="text-lg font-extrabold text-[#1a1a1a]">Verificação rápida de compatibilidade</Text>
          <Text className="mt-2 text-[13px] text-[#555] leading-5">
            Responda 6 perguntas rápidas para avaliar sua preparação para a adoção responsável.
          </Text>
        </View>

        {PERGUNTAS.map((pergunta) => (
          <View key={pergunta.id} className="rounded-2xl bg-white p-4 mb-3 border border-[#eee]">
            <Text className="text-[14px] font-bold text-[#222] mb-2">{pergunta.titulo}</Text>
            {pergunta.opcoes.map((opcao) => {
              const selecionada = respostas[pergunta.id]?.valor === opcao.valor;
              return (
                <Pressable
                  key={opcao.valor}
                  onPress={() => selecionar(pergunta.id, opcao)}
                  className={`mb-2 rounded-xl border px-3 py-3 ${
                    selecionada ? "border-[#6B0889] bg-[#F6ECFA]" : "border-[#ddd] bg-white"
                  }`}
                >
                  <Text className={`text-[13px] ${selecionada ? "text-[#4A1760] font-semibold" : "text-[#333]"}`}>
                    {opcao.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ))}

        <Pressable
          onPress={finalizar}
          disabled={salvando}
          className={`items-center rounded-full py-3.5 mt-2 ${salvando ? "bg-[#BFA3CC]" : "bg-[#6B0889]"}`}
        >
          <Text className="text-white font-bold text-[14px]">
            {salvando ? "Salvando resultado..." : "Ver resultado"}
          </Text>
        </Pressable>

        {resultado && (
          <View className="mt-4 rounded-2xl bg-white p-4 border border-[#E8D7F2]">
            <Text className="text-[16px] font-extrabold text-[#6B0889]">Resultado</Text>
            <Text className="mt-1 text-[15px] font-bold text-[#222]">
              {resultado.titulo} ({resultado.percentual}%)
            </Text>
            <Text className="mt-2 text-[13px] text-[#444] leading-5">{resultado.descricao}</Text>
            {!usuario?.id_usuario && (
              <Text className="mt-2 text-[12px] text-[#8A5A00]">
                Entre na sua conta para salvar este resultado no perfil.
              </Text>
            )}
          </View>
        )}
      </ScrollView>

      <SafeAreaView edges={["bottom"]} className="bg-[#6B0889]">
        <Footer backgroundColor="#6B0889" />
      </SafeAreaView>
    </View>
  );
}