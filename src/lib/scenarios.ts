export type Scenario = {
  id: string;
  label: string;
  emoji: string;
  description: string;
  prompt: string;
  opener: string;
};

export const SCENARIOS: Scenario[] = [
  {
    id: "restaurante",
    label: "Restaurante",
    emoji: "🍽️",
    description: "Peça pratos, bebidas e a conta",
    prompt: "Você é um garçom simpático de um restaurante. Anote o pedido do aluno.",
    opener: "Buenas noches, ¿mesa para cuántas personas?",
  },
  {
    id: "aeroporto",
    label: "Aeroporto",
    emoji: "✈️",
    description: "Check-in, bagagem e embarque",
    prompt: "Você é um agente de check-in de companhia aérea.",
    opener: "Buenos días, su pasaporte y su billete, por favor.",
  },
  {
    id: "hotel",
    label: "Hotel",
    emoji: "🏨",
    description: "Reserva, quarto e pedidos",
    prompt: "Você é o recepcionista de um hotel.",
    opener: "¡Bienvenido! ¿Tiene usted una reserva?",
  },
  {
    id: "mercado",
    label: "Mercado",
    emoji: "🛒",
    description: "Compras, preços e quantidades",
    prompt: "Você é um vendedor de mercado que negocia preços e quantidades.",
    opener: "¡Hola! ¿Qué le pongo hoy?",
  },
  {
    id: "trabalho",
    label: "Trabalho",
    emoji: "💼",
    description: "Reuniões e tarefas do dia",
    prompt: "Você é um colega de trabalho falando sobre prazos e reuniões.",
    opener: "Hola, ¿tienes un momento para hablar del proyecto?",
  },
  {
    id: "entrevista",
    label: "Entrevista de emprego",
    emoji: "🧑‍💼",
    description: "Responda perguntas de recrutador",
    prompt: "Você é um recrutador conduzindo uma entrevista de emprego.",
    opener: "Buenos días, cuéntame un poco sobre ti.",
  },
  {
    id: "faculdade",
    label: "Faculdade",
    emoji: "🎓",
    description: "Aulas, matrícula e colegas",
    prompt: "Você é um colega de faculdade conversando sobre aulas e provas.",
    opener: "¡Hola! ¿Ya te matriculaste en las asignaturas?",
  },
  {
    id: "viagem",
    label: "Viagem",
    emoji: "🧭",
    description: "Direções, passeios e transporte",
    prompt: "Você é um guia turístico local dando dicas e direções.",
    opener: "¡Hola! ¿Qué te gustaría visitar hoy?",
  },
  {
    id: "consulta",
    label: "Consulta médica",
    emoji: "🩺",
    description: "Sintomas, dores e receitas",
    prompt: "Você é um médico atendendo o aluno em uma consulta.",
    opener: "Buenas tardes, ¿qué le trae por aquí?",
  },
  {
    id: "casual",
    label: "Conversa casual",
    emoji: "☕",
    description: "Papo do dia a dia sem roteiro",
    prompt: "Você é um amigo conversando de forma leve e casual.",
    opener: "¡Hola! ¿Cómo va tu día?",
  },
  {
    id: "encontro",
    label: "Primeiro encontro",
    emoji: "💛",
    description: "Gostos, hobbies e planos",
    prompt: "Você está em um primeiro encontro, curioso e educado.",
    opener: "Qué bien que viniste, ¿qué te apetece tomar?",
  },
  {
    id: "amizade",
    label: "Fazer amizade",
    emoji: "🤝",
    description: "Conhecer alguém novo",
    prompt: "Você acabou de conhecer o aluno em um evento e quer fazer amizade.",
    opener: "¡Hola! Creo que no nos conocemos, ¿cómo te llamas?",
  },
  {
    id: "atendimento",
    label: "Atendimento ao cliente",
    emoji: "📞",
    description: "Resolver problemas e reclamações",
    prompt: "Você é um atendente de suporte resolvendo um problema do cliente.",
    opener: "Gracias por llamar, ¿en qué puedo ayudarle?",
  },
];
