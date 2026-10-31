import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const COR_CAMPO = "#F8EEEC";

// caixa de texto grande ("Discorra sobre")
export function CampoTexto({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: string;
  onChangeText: (texto: string) => void;
}) {
  return (
    <View className="mb-[16px]">
      <Text className="text-[#333] text-[14px] mb-[6px]">{label}</Text>
      <TextInput
        className="border border-[#999] rounded-[6px] px-[10px] py-[8px] h-[90px] text-[#333]"
        style={{ backgroundColor: COR_CAMPO, textAlignVertical: "top" }}
        placeholder="Discorra sobre"
        placeholderTextColor="#9A9A9A"
        multiline
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

// select de uma opcao
export function SelectField({
  label,
  placeholder,
  opcoes,
  valor,
  onChange,
}: {
  label: string;
  placeholder: string;
  opcoes: string[];
  valor: string;
  onChange: (valor: string) => void;
}) {
  const [aberto, setAberto] = useState(false);

  return (
    <View className="mb-[16px]">
      <Text className="text-[#333] text-[14px] mb-[6px]">{label}</Text>
      <TouchableOpacity
        className="rounded-[20px] px-[16px] py-[12px] flex-row items-center justify-between border border-[#999]"
        style={{ backgroundColor: COR_CAMPO }}
        onPress={() => setAberto(!aberto)}
      >
        <Text style={{ color: valor ? "#333333" : "#9A9A9A" }}>
          {valor || placeholder}
        </Text>
        <Ionicons name={aberto ? "chevron-up" : "chevron-down"} size={18} color="#666" />
      </TouchableOpacity>

      {aberto && (
        <View className="bg-[#F3F0F0] rounded-[12px] mt-[6px] overflow-hidden">
          {opcoes.map((item) => (
            <TouchableOpacity
              key={item}
              className="px-[16px] py-[10px] border-b border-[#E0E0E0]"
              onPress={() => {
                onChange(item);
                setAberto(false);
              }}
            >
              <Text className="text-[#333]">{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

// select de varias opcoes (ex: vacinas)
export function MultiSelectField({
  label,
  placeholder,
  opcoes,
  valores,
  onChange,
}: {
  label: string;
  placeholder: string;
  opcoes: string[];
  valores: string[];
  onChange: (valores: string[]) => void;
}) {
  const [aberto, setAberto] = useState(false);

  const alternar = (item: string) => {
    onChange(
      valores.includes(item)
        ? valores.filter((v) => v !== item)
        : [...valores, item]
    );
  };

  return (
    <View className="mb-[16px]">
      <Text className="text-[#333] text-[14px] mb-[6px]">{label}</Text>
      <TouchableOpacity
        className="rounded-[20px] px-[16px] py-[12px] flex-row items-center justify-between border border-[#999]"
        style={{ backgroundColor: COR_CAMPO }}
        onPress={() => setAberto(!aberto)}
      >
        <Text
          className="flex-1 pr-[8px]"
          numberOfLines={1}
          style={{ color: valores.length ? "#333333" : "#9A9A9A" }}
        >
          {valores.length ? valores.join(", ") : placeholder}
        </Text>
        <Ionicons name={aberto ? "chevron-up" : "chevron-down"} size={18} color="#666" />
      </TouchableOpacity>

      {aberto && (
        <View className="bg-[#F3F0F0] rounded-[12px] mt-[6px] overflow-hidden">
          {opcoes.map((item) => {
            const marcado = valores.includes(item);
            return (
              <TouchableOpacity
                key={item}
                className="px-[16px] py-[10px] border-b border-[#E0E0E0] flex-row items-center justify-between"
                onPress={() => alternar(item)}
              >
                <Text className="text-[#333]">{item}</Text>
                <Ionicons
                  name={marcado ? "checkbox" : "square-outline"}
                  size={20}
                  color={marcado ? "#6B0889" : "#999"}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}
