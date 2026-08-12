import { normalize } from "./speech";

export type ExerciseType =
  | "mc"
  | "fill"
  | "translate"
  | "drag"
  | "order"
  | "listen"
  | "choose-translation"
  | "find-error"
  | "write"
  | "ai";

export type Skill = "vocabulario" | "gramatica" | "escuta" | "escrita" | "traducao" | "conversacao";

export type ExItem = {
  id: string;
  type: ExerciseType;
  skill: Skill;
  level: "A1" | "A2" | "B1" | "B2";
  /** Instrução em português */
  promptPt: string;
  /** Enunciado principal (pode conter ___ para lacunas) */
  question: string;
  options?: string[];
  /** índice correto para tipos de escolha */
  answerIndex?: number;
  /** resposta textual esperada */
  answerText?: string;
  /** variações aceitas (normalizadas) */
  accepted?: string[];
  /** peças embaralháveis para drag/order */
  tokens?: string[];
  /** texto falado para exercícios de escuta */
  audioText?: string;
  /** cenário para exercício de conversação com IA */
  aiScenario?: { title: string; prompt: string; opener: string };
  explanationPt: string;
  xp: number;
};

export const TYPE_LABEL: Record<ExerciseType, string> = {
  mc: "Múltipla escolha",
  fill: "Complete a frase",
  translate: "Tradução",
  drag: "Arrastar palavras",
  order: "Organizar frases",
  listen: "Escutar e responder",
  "choose-translation": "Escolher a tradução",
  "find-error": "Identificar o erro",
  write: "Escrever resposta",
  ai: "Conversação com IA",
};

export const SKILL_LABEL: Record<Skill, string> = {
  vocabulario: "Vocabulário",
  gramatica: "Gramática",
  escuta: "Compreensão auditiva",
  escrita: "Escrita",
  traducao: "Tradução",
  conversacao: "Conversação",
};

export const EXERCISES: ExItem[] = [
  {
    id: "e-mc-1",
    type: "mc",
    skill: "gramatica",
    level: "A1",
    promptPt: "Escolha a opção correta.",
    question: "¿Cómo ___ (tú)? — Muy bien, gracias.",
    options: ["eres", "estás", "tienes", "haces"],
    answerIndex: 1,
    explanationPt: "Estado momentâneo (como você está) pede ESTAR: «¿Cómo estás?». SER seria para característica permanente.",
    xp: 10,
  },
  {
    id: "e-mc-2",
    type: "mc",
    skill: "vocabulario",
    level: "A1",
    promptPt: "Escolha a opção correta.",
    question: "No restaurante, para pedir a conta você diz:",
    options: ["La cuenta, por favor.", "El cuento, por favor.", "La factura de hotel.", "El plato, por favor."],
    answerIndex: 0,
    explanationPt: "«La cuenta» é a conta do restaurante. «El cuento» é conto (história) — um falso amigo clássico.",
    xp: 10,
  },
  {
    id: "e-fill-1",
    type: "fill",
    skill: "gramatica",
    level: "A1",
    promptPt: "Complete a frase escrevendo a palavra que falta.",
    question: "Tengo veinte ___ .",
    answerText: "años",
    accepted: ["años", "anos"],
    explanationPt: "Idade em espanhol usa TENER + años. Cuidado: «ano» sem o til tem outro significado; o correto é «años».",
    xp: 10,
  },
  {
    id: "e-fill-2",
    type: "fill",
    skill: "gramatica",
    level: "A2",
    promptPt: "Complete com a forma correta do verbo GUSTAR.",
    question: "A mí me ___ los libros de historia.",
    answerText: "gustan",
    accepted: ["gustan"],
    explanationPt: "Com sujeito plural («los libros»), o verbo vai para «gustan». Quem gosta é o pronome «me».",
    xp: 12,
  },
  {
    id: "e-tr-1",
    type: "translate",
    skill: "traducao",
    level: "A1",
    promptPt: "Traduza para o espanhol.",
    question: "Bom dia, eu me chamo Ana.",
    answerText: "Buenos días, me llamo Ana.",
    accepted: ["buenos dias me llamo ana", "buenos dias, me llamo ana", "buenos dias yo me llamo ana"],
    explanationPt: "«Buenos días» é sempre no plural. Para se apresentar: «me llamo» (literalmente: eu me chamo).",
    xp: 12,
  },
  {
    id: "e-tr-2",
    type: "translate",
    skill: "traducao",
    level: "A2",
    promptPt: "Traduza para o espanhol.",
    question: "Eu preciso de ajuda, por favor.",
    answerText: "Necesito ayuda, por favor.",
    accepted: ["necesito ayuda por favor", "necesito ayuda, por favor", "yo necesito ayuda por favor"],
    explanationPt: "«Necesitar» não leva preposição: «necesito ayuda» (e não «necesito de ayuda»).",
    xp: 12,
  },
  {
    id: "e-drag-1",
    type: "drag",
    skill: "gramatica",
    level: "A1",
    promptPt: "Arraste as palavras para completar a frase na ordem correta.",
    question: "Complete: «___ ___ ___ ___» (Eu moro em Madri.)",
    answerText: "Yo vivo en Madrid",
    tokens: ["en", "Madrid", "Yo", "vivo", "soy", "de"],
    explanationPt: "«Vivir en + cidade» indica onde se mora. «Soy de Madrid» significaria que você é natural de lá.",
    xp: 12,
  },
  {
    id: "e-order-1",
    type: "order",
    skill: "escrita",
    level: "A2",
    promptPt: "Organize as palavras para formar a frase correta.",
    question: "Monte a frase: «Amanhã vou viajar para a Espanha.»",
    answerText: "Mañana voy a viajar a España",
    tokens: ["a", "viajar", "Mañana", "España", "voy", "a"],
    explanationPt: "Futuro próximo em espanhol: IR + A + infinitivo → «voy a viajar». O destino também leva «a»: «a España».",
    xp: 14,
  },
  {
    id: "e-order-2",
    type: "order",
    skill: "escrita",
    level: "B1",
    promptPt: "Organize as palavras para formar a frase correta.",
    question: "Monte a frase: «Espero que você venha à festa.»",
    answerText: "Espero que vengas a la fiesta",
    tokens: ["que", "vengas", "Espero", "fiesta", "a", "la"],
    explanationPt: "Verbos de desejo («esperar que») exigem subjuntivo: «vengas», não «vienes».",
    xp: 16,
  },
  {
    id: "e-listen-1",
    type: "listen",
    skill: "escuta",
    level: "A1",
    promptPt: "Escute o áudio e responda o que foi dito.",
    question: "O que você ouviu?",
    audioText: "¿Dónde está la estación de tren?",
    options: [
      "Onde fica a estação de trem?",
      "Onde fica a farmácia?",
      "A que horas sai o trem?",
      "Quanto custa a passagem?",
    ],
    answerIndex: 0,
    explanationPt: "«¿Dónde está…?» pergunta localização. «La estación de tren» = a estação de trem.",
    xp: 14,
  },
  {
    id: "e-listen-2",
    type: "listen",
    skill: "escuta",
    level: "A2",
    promptPt: "Escute e escolha a resposta adequada.",
    question: "Qual é a melhor resposta para o que você ouviu?",
    audioText: "¿Quieres algo de tomar?",
    options: ["Sí, un agua, por favor.", "Tengo treinta años.", "Vivo en Brasil.", "Es a las ocho."],
    answerIndex: 0,
    explanationPt: "A pergunta oferece uma bebida («algo de tomar»), então a resposta natural aceita ou recusa a bebida.",
    xp: 14,
  },
  {
    id: "e-ct-1",
    type: "choose-translation",
    skill: "vocabulario",
    level: "A2",
    promptPt: "Escolha a tradução correta.",
    question: "«Estoy embarazada.»",
    options: ["Estou grávida.", "Estou envergonhada.", "Estou embaraçada com a situação.", "Estou atrapalhada."],
    answerIndex: 0,
    explanationPt: "Falso cognato famoso: «embarazada» = grávida. Envergonhado(a) é «avergonzado(a)».",
    xp: 12,
  },
  {
    id: "e-ct-2",
    type: "choose-translation",
    skill: "vocabulario",
    level: "A2",
    promptPt: "Escolha a tradução correta.",
    question: "«Necesito una goma.»",
    options: ["Preciso de uma borracha.", "Preciso de uma goma de mascar.", "Preciso de cola.", "Preciso de um elástico."],
    answerIndex: 0,
    explanationPt: "«Goma» em espanhol é borracha de apagar. Chiclete é «chicle».",
    xp: 12,
  },
  {
    id: "e-err-1",
    type: "find-error",
    skill: "gramatica",
    level: "A1",
    promptPt: "Identifique a palavra errada na frase.",
    question: "Yo soy 25 anos y vivo en Brasil.",
    options: ["soy", "25", "anos", "vivo"],
    answerIndex: 0,
    explanationPt: "O correto é «Tengo 25 años». Idade usa TENER, nunca SER (e «anos» precisa do til: años).",
    xp: 14,
  },
  {
    id: "e-err-2",
    type: "find-error",
    skill: "gramatica",
    level: "A2",
    promptPt: "Identifique a palavra errada na frase.",
    question: "Me gusta mucho las playas de España.",
    options: ["Me", "gusta", "mucho", "playas"],
    answerIndex: 1,
    explanationPt: "«Las playas» é plural, então o correto é «Me gustan mucho las playas».",
    xp: 14,
  },
  {
    id: "e-write-1",
    type: "write",
    skill: "escrita",
    level: "A1",
    promptPt: "Escreva sua resposta em espanhol (frase completa).",
    question: "¿De dónde eres y a qué te dedicas?",
    answerText: "Soy de Brasil y trabajo como profesor.",
    accepted: ["soy de", "vivo en", "trabajo"],
    explanationPt: "Uma boa resposta usa «Soy de + país» e «trabajo como / soy + profissão». Ex.: «Soy de Brasil y trabajo como profesor».",
    xp: 16,
  },
  {
    id: "e-write-2",
    type: "write",
    skill: "escrita",
    level: "A2",
    promptPt: "Escreva sua resposta em espanhol (frase completa).",
    question: "¿Qué hiciste el fin de semana pasado?",
    answerText: "El fin de semana pasado fui al cine con mis amigos.",
    accepted: ["fui", "estuve", "comí", "visité", "trabajé", "descansé"],
    explanationPt: "Fatos concluídos no passado pedem pretérito indefinido: fui, estuve, comí, visité…",
    xp: 18,
  },
  {
    id: "e-ai-1",
    type: "ai",
    skill: "conversacao",
    level: "A1",
    promptPt: "Converse com o professor de IA por algumas mensagens e depois finalize.",
    question: "Apresente-se e conte três coisas sobre você.",
    aiScenario: {
      title: "Apresentação pessoal",
      prompt:
        "Você é um professor de espanhol simpático. O aluno deve se apresentar (nome, origem, profissão, gostos). Faça perguntas curtas de acompanhamento, corrija os erros e explique a correção em português, sem entregar a frase pronta.",
      opener: "¡Hola! Soy tu profesor. Cuéntame: ¿cómo te llamas y de dónde eres?",
    },
    explanationPt: "Na conversação o importante é arriscar: o professor de IA corrige e explica cada erro em português.",
    xp: 20,
  },
];

export function shuffle<T>(list: T[]) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function clean(value: string) {
  return normalize(value).replace(/[.,!?¡¿;:]/g, "").replace(/\s+/g, " ").trim();
}

export function correctAnswerOf(item: ExItem) {
  if (item.options && typeof item.answerIndex === "number") return item.options[item.answerIndex];
  return item.answerText ?? "";
}

/** Retorna 0..1 */
export function checkAnswer(item: ExItem, given: string): number {
  if (item.type === "ai") return 1;
  if (item.options && typeof item.answerIndex === "number") {
    return clean(given) === clean(item.options[item.answerIndex]) ? 1 : 0;
  }
  const target = clean(item.answerText ?? "");
  const value = clean(given);
  if (!value) return 0;
  if (value === target) return 1;
  if (item.type === "write") {
    const hits = (item.accepted ?? []).filter((a) => value.includes(clean(a))).length;
    if (hits > 0 && value.split(" ").length >= 4) return 1;
    return value.split(" ").length >= 4 ? 0.5 : 0;
  }
  if ((item.accepted ?? []).some((a) => clean(a) === value)) return 1;
  // tolera 1 caractere de diferença em respostas curtas
  if (Math.abs(value.length - target.length) <= 1 && target.length > 3) {
    let diff = 0;
    const max = Math.max(value.length, target.length);
    for (let i = 0; i < max; i++) if (value[i] !== target[i]) diff++;
    if (diff <= 1) return 1;
  }
  return 0;
}
