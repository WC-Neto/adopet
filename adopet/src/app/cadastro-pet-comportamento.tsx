import { useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import FormLayout from "../components/FormLayout";
import { CampoTexto } from "../components/Campos";
import { useCadastroPet } from "../context/CadastroPetContext";
import { cadastrarAnimal } from "../services/api";

// tela de comportamento do pet: manda os dados pra api
export default function CadastroPetComportamento() {
  const { dados, limpar } = useCadastroPet();

  const [historia, setHistoria] = useState("");
  const [motivo, setMotivo] = useState("");
  const [personalidade, setPersonalidade] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleCadastrar = async () => {
    setErro("");

    setCarregando(true);

    const resultado = await cadastrarAnimal({
      ...dados,
      historia: historia.trim() || null,
      motivo_doacao: motivo.trim() || null,
      personalidade: personalidade.trim() || null,
    });

    setCarregando(false);

    if (!resultado.ok) {
      setErro(resultado.erro);
      return;
    }

    // cadastrou: limpa o formulario e vai pra inicio
    limpar();
    router.replace("/inicio");
  };

  return (
    <FormLayout tituloCartao="Conte mais sobre o pet">
      <CampoTexto
        label="Nos conte um pouco sobre a história do pet:"
        value={historia}
        onChangeText={setHistoria}
      />

      <CampoTexto
        label="Qual o motivo da doação?"
        value={motivo}
        onChangeText={setMotivo}
      />

      <CampoTexto
        label="Fale um pouco também sobre a personalidade dele:"
        value={personalidade}
        onChangeText={setPersonalidade}
      />

      {erro ? (
        <Text className="text-[13px] font-semibold text-[#D92D20] text-center mb-[14px]">
          {erro}
        </Text>
      ) : null}

      <TouchableOpacity
        className="bg-[#2C2C2C] rounded-[24px] py-[14px] items-center self-center px-[40px]"
        activeOpacity={0.8}
        onPress={handleCadastrar}
        disabled={carregando}
      >
        <Text className="text-white text-[16px] font-bold">
          {carregando ? "Salvando..." : "Cadastrar"}
        </Text>
      </TouchableOpacity>
    </FormLayout>
  );
}
