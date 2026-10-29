import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";

import Footer from "../components/Footers/Footer";
import Header from "../components/Headers/Header";

type Pet = {
  id: string;
  nome: string;
  especie: string;
  porte: string;
  sexo: "M" | "F";
  nascimento: string;
  castrado: boolean;
  vacinas: string;
  vermifugado: boolean;
  condicao_especial: boolean;
  medicamento_continuo: boolean;
  historico_saude: string;
  microchipado: boolean;
  historia: string;
  motivo_doacao: string;
  personalidade: string;
  imagem: number;
};

const PETS: Pet[] = [
  {
    id: "1",
    nome: "Felix",
    especie: "Cachorro",
    porte: "Médio",
    sexo: "M",
    nascimento: "2021-10-18",
    castrado: true,
    vacinas: "Polivalente V10, Antirrábica",
    vermifugado: true,
    condicao_especial: false,
    medicamento_continuo: false,
    historico_saude: "Nunca ficou doente",
    microchipado: true,
    historia:
      "Felix era um cão bombeiro que auxiliava em operações de busca e salvamento, ajudando na busca com suas habilidades de faro e reduzindo o estresse em situações de pânico.",
    motivo_doacao:
      "Após anos de serviço, ele está aposentado e busca um lar pra receber amor.",
    personalidade:
      "Felix é calmo, carinhoso, sua brincadeira favorita é cabo de guerra, e ele gosta de ficar próximo ao seu dono.",
    imagem: require("../../assets/images/felix.jpg"),
  },
  {
    id: "2",
    nome: "Jana",
    especie: "Gato",
    porte: "Pequeno",
    sexo: "F",
    nascimento: "2025-10-18",
    castrado: true,
    vacinas: "Tríplice felina, Antirrábica",
    vermifugado: true,
    condicao_especial: false,
    medicamento_continuo: false,
    historico_saude: "Nunca ficou doente",
    microchipado: false,
    historia:
      "Jana foi encontrada ainda filhote na porta de uma padaria e cresceu sendo cuidada pela ONG.",
    motivo_doacao:
      "A ONG está com o abrigo lotado e quer garantir um lar definitivo para ela.",
    personalidade:
      "Jana é curiosa e brincalhona, adora perseguir bolinhas e dorme no colo.",
    imagem: require("../../assets/images/logo2.png"),
  },
  {
    id: "3",
    nome: "Rai",
    especie: "Cachorro",
    porte: "Grande",
    sexo: "F",
    nascimento: "2018-10-28",
    castrado: true,
    vacinas: "Polivalente V10, Antirrábica",
    vermifugado: true,
    condicao_especial: true,
    medicamento_continuo: true,
    historico_saude: "Artrose leve diagnosticada aos 7 anos, controlada com medicação",
    microchipado: true,
    historia:
      "Rai viveu 6 anos com uma família que se mudou para o exterior e não pôde levá-la.",
    motivo_doacao:
      "Os antigos tutores se mudaram de país e procuram uma casa tranquila para ela.",
    personalidade:
      "Rai é calma, obediente e adora passeios curtos. Convive bem com crianças e outros cães.",
    imagem: require("../../assets/images/rai.png"),
  },
  {
    id: "4",
    nome: "Sam",
    especie: "Cachorro",
    porte: "Grande",
    sexo: "F",
    nascimento: "2026-07-18",
    castrado: false,
    vacinas: "V10 (1ª dose)",
    vermifugado: true,
    condicao_especial: false,
    medicamento_continuo: false,
    historico_saude: "Nunca ficou doente",
    microchipado: false,
    historia:
      "Sam nasceu de uma ninhada resgatada de um terreno baldio e foi criada em lar temporário.",
    motivo_doacao:
      "Faz parte de uma ninhada resgatada e precisa de um lar definitivo.",
    personalidade:
      "Sam é agitada e muito sociável, adora morder brinquedos e aprende comandos rápido.",
    imagem: require("../../assets/images/sam.png"),
  },
  {
    id: "5",
    nome: "Joe",
    especie: "Gato",
    porte: "Médio",
    sexo: "M",
    nascimento: "2017-10-18",
    castrado: true,
    vacinas: "Tríplice felina, Antirrábica",
    vermifugado: true,
    condicao_especial: false,
    medicamento_continuo: false,
    historico_saude: "Faz acompanhamento anual, sem problemas de saúde",
    microchipado: true,
    historia:
      "Joe viveu com um senhor idoso por 8 anos, que faleceu no início do ano.",
    motivo_doacao: "Perdeu o tutor e precisa de uma nova família que o acolha.",
    personalidade:
      "Joe é sossegado e carinhoso, gosta de tomar sol na janela e de ficar perto das pessoas.",
    imagem: require("../../assets/images/logo2.png"),
  },
  {
    id: "6",
    nome: "Bela",
    especie: "Gato",
    porte: "Pequeno",
    sexo: "F",
    nascimento: "2024-10-18",
    castrado: true,
    vacinas: "Tríplice felina, Antirrábica",
    vermifugado: true,
    condicao_especial: false,
    medicamento_continuo: false,
    historico_saude: "Nunca ficou doente",
    microchipado: true,
    historia:
      "Bela foi resgatada de uma colônia de gatos de rua e passou por tratamento para se acostumar com pessoas.",
    motivo_doacao:
      "Já está socializada e pronta para ir para uma casa de verdade.",
    personalidade:
      "Bela é tímida no começo, mas depois fica muito afetuosa. Adora brincar com varinhas de penas.",
    imagem: require("../../assets/images/logo2.png"),
  },
];

function getAge(birthDate: string) {
  const date = new Date(`${birthDate}T00:00:00`);
  const today = new Date();
  let totalMonths =
    (today.getFullYear() - date.getFullYear()) * 12 +
    today.getMonth() -
    date.getMonth();
  if (today.getDate() < date.getDate()) totalMonths -= 1;

  const years = Math.floor(totalMonths / 12);
  if (years > 0) return `${years} ${years === 1 ? "ano" : "anos"}`;
  return `${totalMonths} ${totalMonths === 1 ? "mês" : "meses"}`;
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

function yesNo(value: boolean) {
  return value ? "Sim" : "Não";
}

export default function PetDetailsScreen() {
  const params = useLocalSearchParams<{
    id?: string | string[];
    id_animal?: string | string[];
    nome?: string | string[];
    name?: string | string[];
  }>();
  const nameParam = params.nome ?? params.name;
  const idParam = params.id_animal ?? params.id;
  const petName = Array.isArray(nameParam) ? nameParam[0] : nameParam;
  const petId = Array.isArray(idParam) ? idParam[0] : idParam;
  const pet = petName
    ? PETS.find((item) => item.nome.toLocaleLowerCase() === petName.trim().toLocaleLowerCase())
    : PETS.find((item) => item.id === petId);

  return (
    <View className="flex-1 bg-[#F09545]">
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView edges={["top"]} className="z-10 bg-[#FAFCFF]">
        <Header backgroundColor="#FAFCFF" />
      </SafeAreaView>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 8 }}
      >
        <View className="relative overflow-hidden px-5 pb-3 pt-2">
          <Ionicons
            name="paw"
            size={86}
            color="rgba(220, 91, 35, 0.22)"
            style={{
              position: "absolute",
              right: 70,
              top: -12,
              transform: [{ rotate: "-25deg" }],
            }}
          />
          <View className="flex-row items-center justify-between">
            <Text className="text-[34px] font-extrabold leading-[42px] text-white">
              {pet?.nome ?? "Pet"}
            </Text>
            <TouchableOpacity
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
              className="rounded-full bg-white px-5 py-2"
            >
              <Text className="text-[15px] font-semibold text-[#444]">Voltar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mx-3 overflow-hidden rounded-[12px] border border-[#D8D8D8] bg-[#FAFAFA]">
          {pet ? (
            <>
              <View className="flex-row items-center border-b border-[#BEBEBE] p-2">
                <Image
                  source={pet.imagem}
                  className="h-[120px] w-[128px] rounded-[12px] bg-[#E5E5E5]"
                  resizeMode="cover"
                  accessibilityLabel={`Foto de ${pet.nome}`}
                />
                <View className="ml-3 flex-1">
                  <DetailLine label="Espécie" value={pet.especie} />
                  <DetailLine label="Porte" value={pet.porte} />
                  <DetailLine label="Sexo" value={pet.sexo === "M" ? "Macho" : "Fêmea"} />
                  <DetailLine label="Idade" value={getAge(pet.nascimento)} />
                </View>
              </View>

              <View className="border-b border-[#BEBEBE] px-1 pb-1 pt-2">
                <SectionTitle>Saúde e bem-estar do pet</SectionTitle>
                <DetailLine label="Castrado?" value={yesNo(pet.castrado)} />
                <DetailLine label="Vacinas" value={pet.vacinas} />
                <DetailLine label="Vermifugado?" value={yesNo(pet.vermifugado)} />
                <DetailLine
                  label="Doença crônica ou condição especial?"
                  value={yesNo(pet.condicao_especial)}
                />
                <DetailLine
                  label="Usa medicamento contínuo?"
                  value={yesNo(pet.medicamento_continuo)}
                />
                <DetailLine label="Histórico de saúde" value={pet.historico_saude} />
                <DetailLine label="Microchipado?" value={yesNo(pet.microchipado)} />
              </View>

              <View className="px-1 pb-2 pt-2">
                <SectionTitle>História e comportamento</SectionTitle>
                <DetailLine label="História" value={pet.historia} />
                <DetailLine label="Motivo da doação" value={pet.motivo_doacao} />
                <DetailLine label="Personalidade" value={pet.personalidade} />
              </View>

              <View className="items-center border-t border-[#BEBEBE] py-3">
                <TouchableOpacity
                  onPress={() => router.push("/doar")}
                  accessibilityRole="button"
                  className="rounded-full border border-[#E7B5E8] bg-[#F6D7F5] px-6 py-2"
                >
                  <Text className="text-[14px] font-semibold text-[#6B0889]">Adote-me</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View className="min-h-[280px] items-center justify-center px-6">
              <Text className="text-center text-[14px] text-[#333]">
                Pet não encontrado. Volte e selecione um dos pets cadastrados.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <SafeAreaView edges={["bottom"]} className="bg-[#6B0889]">
        <Footer backgroundColor="#6B0889" />
      </SafeAreaView>
    </View>
  );
}
