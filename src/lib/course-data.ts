export type Track =
  | "conversacao"
  | "gramatica"
  | "vocabulario"
  | "pronuncia"
  | "viagem"
  | "trabalho"
  | "provas";

export type Level = "A1" | "A2" | "B1" | "B2" | "C1";

export type Exercise =
  | {
      kind: "choice";
      prompt: string;
      question: string;
      options: string[];
      answer: number;
      explanation: string;
    }
  | {
      kind: "translate";
      prompt: string;
      question: string;
      answer: string;
      accepted: string[];
      explanation: string;
    }
  | {
      kind: "listen";
      prompt: string;
      question: string;
      audioText: string;
      options: string[];
      answer: number;
      explanation: string;
    }
  | {
      kind: "speak";
      prompt: string;
      question: string;
      audioText: string;
      explanation: string;
    };

export type Vocab = { es: string; pt: string; tip?: string };

export type Lesson = {
  id: string;
  title: string;
  subtitle: string;
  level: Level;
  track: Track;
  minutes: number;
  xp: number;
  grammar: { title: string; body: string; examples: { es: string; pt: string }[] };
  vocab: Vocab[];
  exercises: Exercise[];
};

export const TRACK_LABEL: Record<Track, string> = {
  conversacao: "Conversação",
  gramatica: "Gramática",
  vocabulario: "Vocabulário",
  pronuncia: "Pronúncia",
  viagem: "Viagem",
  trabalho: "Trabalho",
  provas: "Provas",
};

export const LEVELS: { id: Level; name: string; description: string }[] = [
  { id: "A1", name: "Iniciante", description: "Primeiras palavras e frases do dia a dia" },
  { id: "A2", name: "Básico", description: "Conversas simples, passado e rotina" },
  { id: "B1", name: "Intermediário", description: "Opiniões, planos e situações reais" },
  { id: "B2", name: "Avançado", description: "Fluidez, subjuntivo e nuances" },
  { id: "C1", name: "Proficiente", description: "Espanhol profissional e acadêmico" },
];

export const LESSONS: Lesson[] = [
  {
    id: "a1-saludos",
    title: "¡Hola! Saudações e apresentações",
    subtitle: "Diga olá, apresente-se e pergunte o nome de alguém",
    level: "A1",
    track: "conversacao",
    minutes: 8,
    xp: 30,
    grammar: {
      title: "O verbo SER no presente",
      body: "Usamos ser para identidade, origem e profissão. Repare que em espanhol o pronome costuma ser omitido.",
      examples: [
        { es: "Yo soy Ana.", pt: "Eu sou a Ana." },
        { es: "¿De dónde eres?", pt: "De onde você é?" },
        { es: "Él es profesor.", pt: "Ele é professor." },
      ],
    },
    vocab: [
      { es: "hola", pt: "olá" },
      { es: "buenos días", pt: "bom dia" },
      { es: "buenas tardes", pt: "boa tarde" },
      { es: "¿cómo te llamas?", pt: "como você se chama?" },
      { es: "mucho gusto", pt: "muito prazer" },
      { es: "hasta luego", pt: "até logo" },
    ],
    exercises: [
      {
        kind: "choice",
        prompt: "Escolha a opção correta",
        question: "Como se diz “bom dia” em espanhol?",
        options: ["Buenas noches", "Buenos días", "Buen provecho", "Buenas tardes"],
        answer: 1,
        explanation: "“Buenos días” é usado da manhã até o almoço.",
      },
      {
        kind: "translate",
        prompt: "Traduza para o espanhol",
        question: "Eu sou o Pedro.",
        answer: "Yo soy Pedro",
        accepted: ["yo soy pedro", "soy pedro"],
        explanation: "O pronome “yo” é opcional: “Soy Pedro” também está certo.",
      },
      {
        kind: "listen",
        prompt: "Ouça e escolha o que foi dito",
        question: "Toque no alto-falante para ouvir",
        audioText: "¿Cómo te llamas?",
        options: ["¿Cómo estás?", "¿Cómo te llamas?", "¿Dónde vives?", "¿Qué tal?"],
        answer: 1,
        explanation: "“¿Cómo te llamas?” significa “como você se chama?”.",
      },
      {
        kind: "speak",
        prompt: "Pronuncie em voz alta",
        question: "Mucho gusto, me llamo Ana.",
        audioText: "Mucho gusto, me llamo Ana.",
        explanation: "O “ll” latino-americano soa como “j” de janela em muitos países.",
      },
    ],
  },
  {
    id: "a1-numeros",
    title: "Números, horas e datas",
    subtitle: "Fale preços, horários e combine encontros",
    level: "A1",
    track: "vocabulario",
    minutes: 10,
    xp: 30,
    grammar: {
      title: "Que hora es / Son las…",
      body: "Use “Es la una” para 1h e “Son las…” para as demais horas.",
      examples: [
        { es: "Son las tres y media.", pt: "São três e meia." },
        { es: "Es la una menos cuarto.", pt: "É uma menos quinze." },
      ],
    },
    vocab: [
      { es: "uno, dos, tres", pt: "um, dois, três" },
      { es: "diez", pt: "dez" },
      { es: "veinte", pt: "vinte" },
      { es: "¿cuánto cuesta?", pt: "quanto custa?" },
      { es: "mañana", pt: "amanhã / manhã" },
      { es: "hoy", pt: "hoje" },
    ],
    exercises: [
      {
        kind: "choice",
        prompt: "Escolha a opção correta",
        question: "Como se escreve o número 15?",
        options: ["Cincuenta", "Quince", "Cinco", "Catorce"],
        answer: 1,
        explanation: "15 = quince. 50 = cincuenta.",
      },
      {
        kind: "translate",
        prompt: "Traduza para o espanhol",
        question: "Quanto custa?",
        answer: "¿Cuánto cuesta?",
        accepted: ["cuanto cuesta", "¿cuanto cuesta?", "cuánto cuesta"],
        explanation: "Lembre dos dois pontos de interrogação: ¿…?",
      },
      {
        kind: "listen",
        prompt: "Ouça e escolha o que foi dito",
        question: "Toque para ouvir",
        audioText: "Son las siete y media.",
        options: ["São sete e meia", "São seis horas", "São nove e quinze", "É uma hora"],
        answer: 0,
        explanation: "“y media” = e meia.",
      },
    ],
  },
  {
    id: "a1-cafe",
    title: "No café: pedir comida e bebida",
    subtitle: "Situação real: pedir, pagar e agradecer",
    level: "A1",
    track: "viagem",
    minutes: 9,
    xp: 35,
    grammar: {
      title: "Querer / Quisiera",
      body: "“Quisiera” é a forma educada de pedir algo em restaurantes e lojas.",
      examples: [
        { es: "Quisiera un café con leche, por favor.", pt: "Eu gostaria de um café com leite, por favor." },
        { es: "¿Me trae la cuenta?", pt: "Pode trazer a conta?" },
      ],
    },
    vocab: [
      { es: "la cuenta", pt: "a conta" },
      { es: "el desayuno", pt: "o café da manhã" },
      { es: "sin azúcar", pt: "sem açúcar" },
      { es: "para llevar", pt: "para viagem" },
      { es: "la propina", pt: "a gorjeta" },
    ],
    exercises: [
      {
        kind: "choice",
        prompt: "Situação real",
        question: "Você quer pedir a conta. O que diz?",
        options: ["¿Me trae la cuenta?", "¿Dónde vives?", "Tengo hambre ayer", "¿Cómo se llama?"],
        answer: 0,
        explanation: "Forma padrão e educada em quase toda a América Latina.",
      },
      {
        kind: "translate",
        prompt: "Traduza para o espanhol",
        question: "Eu gostaria de um café sem açúcar.",
        answer: "Quisiera un café sin azúcar",
        accepted: ["quisiera un cafe sin azucar", "quiero un café sin azúcar", "quiero un cafe sin azucar"],
        explanation: "“Quisiera” soa mais educado que “quiero”.",
      },
      {
        kind: "speak",
        prompt: "Pronuncie em voz alta",
        question: "¿Me trae la cuenta, por favor?",
        audioText: "¿Me trae la cuenta, por favor?",
        explanation: "O “r” de “trae” é vibrante simples, como em “caro”.",
      },
    ],
  },
  {
    id: "a2-pasado",
    title: "Falando do passado",
    subtitle: "Conte o que você fez ontem e no fim de semana",
    level: "A2",
    track: "gramatica",
    minutes: 12,
    xp: 45,
    grammar: {
      title: "Pretérito indefinido",
      body: "Terminações regulares: -ar → é, aste, ó / -er e -ir → í, iste, ió.",
      examples: [
        { es: "Ayer hablé con mi jefe.", pt: "Ontem falei com meu chefe." },
        { es: "Comí en un restaurante nuevo.", pt: "Comi em um restaurante novo." },
      ],
    },
    vocab: [
      { es: "ayer", pt: "ontem" },
      { es: "el fin de semana", pt: "o fim de semana" },
      { es: "anoche", pt: "ontem à noite" },
      { es: "la semana pasada", pt: "a semana passada" },
    ],
    exercises: [
      {
        kind: "choice",
        prompt: "Complete a frase",
        question: "Ayer yo ____ (comer) paella.",
        options: ["como", "comí", "comeré", "comía"],
        answer: 1,
        explanation: "Pretérito indefinido de comer, 1ª pessoa: comí.",
      },
      {
        kind: "translate",
        prompt: "Traduza para o espanhol",
        question: "Na semana passada eu trabalhei muito.",
        answer: "La semana pasada trabajé mucho",
        accepted: ["la semana pasada trabaje mucho", "la semana pasada yo trabajé mucho"],
        explanation: "trabajar → trabajé (eu trabalhei).",
      },
      {
        kind: "listen",
        prompt: "Compreensão auditiva",
        question: "Toque para ouvir",
        audioText: "Anoche fui al cine con mis amigos.",
        options: [
          "Ontem à noite fui ao cinema com meus amigos",
          "Amanhã vou ao cinema",
          "Meus amigos moram longe",
          "Fui ao mercado hoje",
        ],
        answer: 0,
        explanation: "“fui” é o passado de ir e também de ser.",
      },
    ],
  },
  {
    id: "a2-trabajo",
    title: "Espanhol no trabalho",
    subtitle: "Reuniões, e-mails e apresentações profissionais",
    level: "A2",
    track: "trabalho",
    minutes: 12,
    xp: 45,
    grammar: {
      title: "Tratamento formal: usted",
      body: "Com clientes e superiores use “usted” + verbo na 3ª pessoa.",
      examples: [
        { es: "¿Puede usted enviarme el informe?", pt: "O senhor pode me enviar o relatório?" },
        { es: "Quedo atento a su respuesta.", pt: "Fico no aguardo da sua resposta." },
      ],
    },
    vocab: [
      { es: "la reunión", pt: "a reunião" },
      { es: "el informe", pt: "o relatório" },
      { es: "el plazo", pt: "o prazo" },
      { es: "la propuesta", pt: "a proposta" },
      { es: "el equipo", pt: "a equipe" },
    ],
    exercises: [
      {
        kind: "choice",
        prompt: "Escolha a opção mais formal",
        question: "Encerrando um e-mail profissional:",
        options: ["Chao", "Un abrazo fuerte", "Quedo atento a su respuesta", "Nos vemos"],
        answer: 2,
        explanation: "Fórmula padrão em e-mails corporativos.",
      },
      {
        kind: "translate",
        prompt: "Traduza para o espanhol",
        question: "A reunião é amanhã às dez.",
        answer: "La reunión es mañana a las diez",
        accepted: ["la reunion es mañana a las diez", "la reunión es mañana a las 10"],
        explanation: "Horas sempre com “a las”.",
      },
    ],
  },
  {
    id: "b1-opiniones",
    title: "Dar opinião e argumentar",
    subtitle: "Concordar, discordar e defender uma ideia",
    level: "B1",
    track: "conversacao",
    minutes: 14,
    xp: 55,
    grammar: {
      title: "Creo que + indicativo / No creo que + subjuntivo",
      body: "Afirmações usam indicativo; negações e dúvidas pedem subjuntivo.",
      examples: [
        { es: "Creo que es una buena idea.", pt: "Acho que é uma boa ideia." },
        { es: "No creo que sea difícil.", pt: "Não acho que seja difícil." },
      ],
    },
    vocab: [
      { es: "en mi opinión", pt: "na minha opinião" },
      { es: "estoy de acuerdo", pt: "concordo" },
      { es: "sin embargo", pt: "no entanto" },
      { es: "por lo tanto", pt: "portanto" },
    ],
    exercises: [
      {
        kind: "choice",
        prompt: "Complete a frase",
        question: "No creo que ____ tan caro.",
        options: ["es", "sea", "será", "fue"],
        answer: 1,
        explanation: "Depois de “no creo que” usamos subjuntivo: sea.",
      },
      {
        kind: "translate",
        prompt: "Traduza para o espanhol",
        question: "Na minha opinião, é a melhor opção.",
        answer: "En mi opinión, es la mejor opción",
        accepted: ["en mi opinion es la mejor opcion", "en mi opinión es la mejor opción"],
        explanation: "“mejor” não leva “más” antes.",
      },
      {
        kind: "speak",
        prompt: "Pronuncie em voz alta",
        question: "Sin embargo, creo que deberíamos esperar.",
        audioText: "Sin embargo, creo que deberíamos esperar.",
        explanation: "Atenção à sílaba tônica de “deberíamos”.",
      },
    ],
  },
  {
    id: "b2-subjuntivo",
    title: "Subjuntivo sem medo",
    subtitle: "Desejos, hipóteses e recomendações",
    level: "B2",
    track: "gramatica",
    minutes: 16,
    xp: 65,
    grammar: {
      title: "Presente do subjuntivo",
      body: "Aparece após ojalá, espero que, es importante que, cuando (futuro).",
      examples: [
        { es: "Espero que tengas un buen viaje.", pt: "Espero que você tenha uma boa viagem." },
        { es: "Cuando llegues, avísame.", pt: "Quando você chegar, me avise." },
      ],
    },
    vocab: [
      { es: "ojalá", pt: "tomara" },
      { es: "a menos que", pt: "a menos que" },
      { es: "con tal de que", pt: "contanto que" },
    ],
    exercises: [
      {
        kind: "choice",
        prompt: "Complete a frase",
        question: "Cuando ____ a Madrid, te llamo.",
        options: ["llego", "llegue", "llegaré", "llegaba"],
        answer: 1,
        explanation: "Ação futura depois de “cuando” pede subjuntivo.",
      },
      {
        kind: "translate",
        prompt: "Traduza para o espanhol",
        question: "Espero que você esteja bem.",
        answer: "Espero que estés bien",
        accepted: ["espero que estes bien"],
        explanation: "estar → estés no presente do subjuntivo.",
      },
    ],
  },
  {
    id: "c1-examenes",
    title: "Espanhol para provas (DELE/SIELE)",
    subtitle: "Conectores acadêmicos e leitura crítica",
    level: "C1",
    track: "provas",
    minutes: 18,
    xp: 80,
    grammar: {
      title: "Conectores de registro alto",
      body: "Use conectores precisos para estruturar redações e respostas orais.",
      examples: [
        { es: "Cabe destacar que…", pt: "Vale destacar que…" },
        { es: "A raíz de ello, se concluye que…", pt: "Em decorrência disso, conclui-se que…" },
      ],
    },
    vocab: [
      { es: "cabe destacar", pt: "vale destacar" },
      { es: "no obstante", pt: "não obstante" },
      { es: "en definitiva", pt: "em suma" },
      { es: "asimismo", pt: "da mesma forma" },
    ],
    exercises: [
      {
        kind: "choice",
        prompt: "Registro acadêmico",
        question: "Qual conector introduz uma conclusão?",
        options: ["Asimismo", "En definitiva", "No obstante", "Es decir"],
        answer: 1,
        explanation: "“En definitiva” fecha o raciocínio.",
      },
      {
        kind: "translate",
        prompt: "Traduza para o espanhol",
        question: "Vale destacar que os resultados melhoraram.",
        answer: "Cabe destacar que los resultados mejoraron",
        accepted: ["cabe destacar que los resultados mejoraron"],
        explanation: "Estrutura frequente em redações do DELE.",
      },
    ],
  },
];

export const PLACEMENT_QUESTIONS: {
  question: string;
  options: string[];
  answer: number;
  level: Level;
}[] = [
  {
    question: "“Buenas noches” se usa quando?",
    options: ["De manhã", "À tarde", "À noite", "Ao acordar"],
    answer: 2,
    level: "A1",
  },
  {
    question: "Complete: Yo ____ brasileño.",
    options: ["soy", "estoy", "es", "son"],
    answer: 0,
    level: "A1",
  },
  {
    question: "Complete: Ayer nosotros ____ (ir) al museo.",
    options: ["vamos", "fuimos", "iremos", "íbamos"],
    answer: 1,
    level: "A2",
  },
  {
    question: "Qual frase está correta?",
    options: [
      "Hace dos años que trabajo aquí",
      "Hace dos años que trabajaré aquí",
      "Hago dos años que trabajo aquí",
      "Hace dos años trabajo por aquí desde",
    ],
    answer: 0,
    level: "A2",
  },
  {
    question: "Complete: No creo que él ____ razón.",
    options: ["tiene", "tenga", "tendrá", "tuvo"],
    answer: 1,
    level: "B1",
  },
  {
    question: "“Me da igual” significa:",
    options: ["Tanto faz", "Me dá raiva", "Igualmente", "Me devolve"],
    answer: 0,
    level: "B1",
  },
  {
    question: "Complete: Si ____ más tiempo, viajaría contigo.",
    options: ["tengo", "tuviera", "tendré", "tenga"],
    answer: 1,
    level: "B2",
  },
  {
    question: "“Echar de menos” quer dizer:",
    options: ["Sentir falta", "Jogar fora", "Diminuir", "Reclamar"],
    answer: 0,
    level: "B2",
  },
  {
    question: "Qual conector indica contraste formal?",
    options: ["Asimismo", "No obstante", "Además", "Por ejemplo"],
    answer: 1,
    level: "C1",
  },
  {
    question: "“A raíz de ello” equivale a:",
    options: ["Em decorrência disso", "Apesar disso", "Desde então", "Por sorte"],
    answer: 0,
    level: "C1",
  },
];

export function levelFromScore(score: number): Level {
  if (score <= 2) return "A1";
  if (score <= 4) return "A2";
  if (score <= 6) return "B1";
  if (score <= 8) return "B2";
  return "C1";
}

export function lessonsForLevel(level: Level) {
  const order: Level[] = ["A1", "A2", "B1", "B2", "C1"];
  const start = order.indexOf(level);
  return LESSONS.filter((l) => order.indexOf(l.level) >= start);
}
