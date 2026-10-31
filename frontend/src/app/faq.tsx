import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';


if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface FAQItem {
  id: number;
  category: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    category: "Adoção",
    question: "Como funciona a busca por localização?",
    answer: "O Adopet utiliza sua localização (ou a cidade selecionada) para mostrar os animais disponíveis mais próximos de você, facilitando as visitas e o processo de adoção."
  },
  {
    id: 2,
    category: "Adoção",
    question: "Como entrar em contato com o protetor?",
    answer: "Ao encontrar o pet ideal no feed ou na busca, clique no perfil dele e selecione 'Quero Adotar'. As instruções de contato e o formulário do responsável serão exibidos."
  },
  {
    id: 3,
    category: "Requisitos",
    question: "Quais são as exigências para adotar?",
    answer: "É necessário ter mais de 18 anos, documento com foto (RG/CPF), comprovante de residência e passar pela entrevista com a ONG/protetor responsável."
  },
  {
    id: 4,
    category: "ONGs e Protetores",
    question: "Sou protetor independente, posso cadastrar pets?",
    answer: "Com certeza! O Adopet aceita cadastros tanto de ONGs registradas quanto de protetores independentes que realizam resgates."
  },
  {
    id: 5,
    category: "Saúde",
    question: "Como sei se o pet está vacinado ou castrado?",
    answer: "Na etapa de 'Saúde' do perfil do animal, você verá os selos de vacinação, vermifugação e castração preenchidos diretamente pelo protetor."
  }
];

export default function FAQScreen() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleAccordion = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <ScrollView className="flex-1 bg-slate-50 px-4 py-6">
      <View className="mb-6">
        <Text className="text-2xl font-bold text-slate-800 text-center">
          Perguntas Frequentes 🐾
        </Text>
        <Text className="text-slate-500 text-center text-sm mt-1">
          Tire suas dúvidas sobre o processo de adoção e cadastro no Adopet
        </Text>
      </View>

      <View className="space-y-3 pb-8">
        {faqData.map((item) => {
          const isOpen = expandedId === item.id;
          return (
            <View 
              key={item.id} 
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
            >
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => toggleAccordion(item.id)}
                className="p-4 flex-row justify-between items-center bg-white"
              >
                <Text className="font-semibold text-slate-700 flex-1 pr-2">
                  {item.question}
                </Text>
                <Text className="text-slate-400 font-bold">
                  {isOpen ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>

              {isOpen && (
                <View className="px-4 pb-4 pt-1 border-t border-slate-100 bg-slate-50">
                  <Text className="text-xs font-semibold text-amber-600 mb-1 uppercase">
                    {item.category}
                  </Text>
                  <Text className="text-slate-600 leading-5">
                    {item.answer}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
