import { useState } from "react";
import { Platform, Text, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Constants from "expo-constants";
import FormLayout from "../components/FormLayout";
import { CampoTexto } from "../components/Campos";

// endereco da api
const debuggerHost = Constants.expoConfig?.hostUri?.split(":")[0];
const API_URL =
  Platform.OS === "web"
    ? "http://127.0.0.1:8000"
    : debuggerHost
      ? `http://${debuggerHost}:8000`
      : "http://192.168.1.179:8000";

// ultima etapa do cadastro: historia, motivo e personalidade
export default function CadastroPetComportamento() {
  const { id_animal } = useLocalSearchParams<{ id_animal: string }>();

  const [historia, setHistoria] = useState("");
  const [motivo, setMotivo] = useState("");
  const [personalidade, setPersonalidade] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleCadastrar = async () => {
    setErro("");

    if (!id_animal || Array.isArray(id_animal)) {
      setErro("ID do animal não encontrado. Volte ao cadastro do pet.");
      return;
    }

    setCarregando(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(
        `${API_URL}/animais/${id_animal}/comportamento`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            historia: historia.trim() || null,
            motivo_doacao: motivo.trim() || null,
            personalidade: personalidade.trim() || null,
          }),
        }
      );

      clearTimeout(timeoutId);
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setErro(
          typeof data?.detail === "string"
            ? data.detail
            : "Não foi possível salvar os dados de comportamento."
        );
        return;
      }

      // cadastro completo
      router.replace("/inicio");
    } catch (e: any) {
      clearTimeout(timeoutId);
      if (e?.name === "AbortError") {
        setErro("A API demorou demais. Confira se o PostgreSQL está ligado.");
      } else {
        setErro(
          "Não foi possível conectar ao servidor FastAPI (porta 8000)."
        );
      }
    } finally {
      setCarregando(false);
    }
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
