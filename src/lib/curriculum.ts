import type { Level } from "./course-data";

export type Module = { title: string; topics: string[] };

export const CURRICULUM: Record<Level, { headline: string; modules: Module[] }> = {
  A1: {
    headline: "Do zero absoluto às primeiras conversas do dia a dia.",
    modules: [
      { title: "Sons e letras", topics: ["Alfabeto e pronúncia", "Acentuação", "Ñ, LL, RR, J e H"] },
      { title: "Primeiros contatos", topics: ["Cumprimentos", "Apresentações", "Despedidas"] },
      { title: "Números e tempo", topics: ["Números", "Dias da semana", "Meses", "Horas e datas"] },
      { title: "Mundo ao redor", topics: ["Cores", "Objetos", "Casa", "Lugares"] },
      { title: "Pessoas", topics: ["Família", "Profissões", "Descrições simples"] },
      { title: "Comer e beber", topics: ["Comidas", "Bebidas", "Pedidos no café"] },
      {
        title: "Base gramatical",
        topics: ["Verbos básicos", "Presente do indicativo", "Artigos", "Pronomes", "Adjetivos", "Frases básicas"],
      },
    ],
  },
  A2: {
    headline: "Conversas simples com passado, futuro e situações reais.",
    modules: [
      { title: "Tempos verbais", topics: ["Passado (indefinido e imperfeito)", "Futuro", "Verbos irregulares"] },
      { title: "Estrutura da frase", topics: ["Preposições", "Comparações", "Conectores simples"] },
      { title: "Pessoas e rotina", topics: ["Descrição de pessoas", "Rotina", "Saúde"] },
      { title: "Fora de casa", topics: ["Compras", "Restaurante", "Hotel", "Transporte", "Viagens"] },
      { title: "Primeiro contato profissional", topics: ["Trabalho", "Conversas do cotidiano"] },
    ],
  },
  B1: {
    headline: "Você se vira sozinho: opinião, narrativa e textos.",
    modules: [
      { title: "Conversação intermediária", topics: ["Conversas mais longas", "Concordar e discordar", "Argumentação"] },
      { title: "Domínio verbal", topics: ["Tempos verbais compostos", "Subjuntivo introdutório", "Perífrases"] },
      { title: "Expressividade", topics: ["Expressões idiomáticas", "Expressões com verbo + preposição"] },
      { title: "Textos e relatos", topics: ["Narração", "Compreensão de textos"] },
      { title: "Contexto profissional", topics: ["Situações profissionais", "E-mails e recados"] },
    ],
  },
  B2: {
    headline: "Fluidez em debates, trabalho e textos complexos.",
    modules: [
      { title: "Conversação avançada", topics: ["Debate", "Defesa de ponto de vista", "Nuances de registro"] },
      { title: "Espanhol profissional", topics: ["Apresentações", "Entrevistas de emprego", "Reuniões"] },
      { title: "Variedades", topics: ["Expressões regionais", "Diferenças Espanha × América Latina"] },
      { title: "Leitura crítica", topics: ["Notícias", "Textos complexos"] },
    ],
  },
  C1: {
    headline: "Espanhol acadêmico e profissional com precisão.",
    modules: [
      { title: "Fluência", topics: ["Discurso espontâneo", "Debate estruturado"] },
      { title: "Registro alto", topics: ["Linguagem acadêmica", "Linguagem profissional", "Expressões avançadas"] },
      { title: "Leitura e escrita", topics: ["Literatura", "Notícias", "Redação", "Interpretação avançada"] },
    ],
  },
  C2: {
    headline: "Domínio praticamente nativo, com nuance e humor.",
    modules: [
      { title: "Conversação natural", topics: ["Ritmo nativo", "Gírias", "Expressões regionais"] },
      { title: "Nuance", topics: ["Ironia", "Humor", "Nuances da língua", "Duplos sentidos"] },
      { title: "Alta complexidade", topics: ["Textos complexos", "Literatura", "Debates"] },
      { title: "Profissional avançado", topics: ["Negociação", "Espanhol jurídico e técnico", "Redação executiva"] },
    ],
  },
};
