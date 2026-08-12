import type { Level } from "./course-data";

export type Skill = "vocabulario" | "gramatica" | "leitura" | "compreensao" | "construcao" | "interpretacao";

export const SKILL_LABEL: Record<Skill, string> = {
  vocabulario: "Vocabulário",
  gramatica: "Gramática",
  leitura: "Leitura",
  compreensao: "Compreensão",
  construcao: "Construção de frases",
  interpretacao: "Interpretação",
};

export const SKILL_TIP: Record<Skill, string> = {
  vocabulario: "Revise as listas de palavras das aulas e use o modo de áudio para fixar.",
  gramatica: "Foque nas aulas de gramática do seu nível: tempos verbais e concordância.",
  leitura: "Leia textos curtos em espanhol todos os dias e marque as palavras novas.",
  compreensao: "Ouça áudios das aulas com legenda e depois sem legenda.",
  construcao: "Pratique os exercícios de tradução: monte frases completas, sem pressa.",
  interpretacao: "Trabalhe textos com ironia, opinião e contexto nas trilhas B2/C1/C2.",
};

export type PlacementQuestion = {
  id: string;
  skill: Skill;
  level: Level;
  question: string;
  context?: string;
  options: string[];
  answer: number;
  explanation: string;
};

export const PLACEMENT_TEST: PlacementQuestion[] = [
  {
    id: "p1",
    skill: "vocabulario",
    level: "A1",
    question: "“Buenas noches” se usa quando?",
    options: ["De manhã", "À tarde", "À noite", "Ao acordar"],
    answer: 2,
    explanation: "“Buenas noches” serve tanto para cumprimentar quanto para se despedir à noite.",
  },
  {
    id: "p2",
    skill: "gramatica",
    level: "A1",
    question: "Complete: Yo ____ brasileño.",
    options: ["soy", "estoy", "es", "son"],
    answer: 0,
    explanation: "Nacionalidade é característica permanente → verbo ser: “yo soy”.",
  },
  {
    id: "p3",
    skill: "construcao",
    level: "A1",
    question: "Qual frase está corretamente construída?",
    options: ["Me llamo es Ana", "Yo me llamo Ana", "Yo llamo Ana", "Me llama Ana yo"],
    answer: 1,
    explanation: "“(Yo) me llamo Ana” é a forma correta com verbo reflexivo llamarse.",
  },
  {
    id: "p4",
    skill: "leitura",
    level: "A1",
    context: "En la mesa hay un vaso de agua, pan y una taza de café.",
    question: "O que NÃO está na mesa?",
    options: ["Água", "Pão", "Café", "Vinho"],
    answer: 3,
    explanation: "O texto cita agua, pan e café — vinho não aparece.",
  },
  {
    id: "p5",
    skill: "gramatica",
    level: "A2",
    question: "Complete: Ayer nosotros ____ (ir) al museo.",
    options: ["vamos", "fuimos", "iremos", "íbamos"],
    answer: 1,
    explanation: "Pretérito indefinido de ir na 1ª pessoa do plural: fuimos.",
  },
  {
    id: "p6",
    skill: "vocabulario",
    level: "A2",
    question: "No hotel, “la llave” é:",
    options: ["A chave", "A conta", "A cama", "A toalha"],
    answer: 0,
    explanation: "llave = chave. Conta é “la cuenta”.",
  },
  {
    id: "p7",
    skill: "compreensao",
    level: "A2",
    context: "— ¿A qué hora sale el próximo tren a Sevilla? — A las ocho y cuarto, andén tres.",
    question: "Que informação foi dada?",
    options: [
      "Trem às 8h15, plataforma 3",
      "Trem às 8h45, plataforma 3",
      "Trem às 3h, plataforma 8",
      "Não há trens hoje",
    ],
    answer: 0,
    explanation: "“ocho y cuarto” = 8h15 e “andén tres” = plataforma 3.",
  },
  {
    id: "p8",
    skill: "construcao",
    level: "A2",
    question: "Como se diz “Eu trabalhei muito na semana passada”?",
    options: [
      "La semana pasada trabajé mucho",
      "La semana pasada trabajo mucho",
      "La semana pasada trabajaré mucho",
      "La semana pasada trabajando mucho",
    ],
    answer: 0,
    explanation: "trabajar → trabajé (passado, 1ª pessoa).",
  },
  {
    id: "p9",
    skill: "gramatica",
    level: "B1",
    question: "Complete: No creo que él ____ razón.",
    options: ["tiene", "tenga", "tendrá", "tuvo"],
    answer: 1,
    explanation: "“No creo que” exige subjuntivo: tenga.",
  },
  {
    id: "p10",
    skill: "vocabulario",
    level: "B1",
    question: "“Me da igual” significa:",
    options: ["Tanto faz", "Me dá raiva", "Igualmente", "Me devolve"],
    answer: 0,
    explanation: "Expressão idiomática de indiferença.",
  },
  {
    id: "p11",
    skill: "leitura",
    level: "B1",
    context:
      "Aunque el restaurante estaba lleno, conseguimos una mesa junto a la ventana porque alguien canceló su reserva.",
    question: "Por que conseguiram a mesa?",
    options: [
      "Porque o restaurante estava vazio",
      "Porque alguém cancelou a reserva",
      "Porque reservaram com antecedência",
      "Porque conheciam o garçom",
    ],
    answer: 1,
    explanation: "A causa está após “porque”: alguém cancelou a reserva.",
  },
  {
    id: "p12",
    skill: "compreensao",
    level: "B1",
    context: "— Si te soy sincero, el proyecto me convence, pero el plazo me parece imposible.",
    question: "Qual é a posição do falante?",
    options: [
      "Gosta do projeto, mas duvida do prazo",
      "Rejeita totalmente o projeto",
      "Aceita o prazo sem ressalvas",
      "Não entendeu o projeto",
    ],
    answer: 0,
    explanation: "“me convence, pero el plazo me parece imposible” = aprovação com ressalva.",
  },
  {
    id: "p13",
    skill: "gramatica",
    level: "B2",
    question: "Complete: Si ____ más tiempo, viajaría contigo.",
    options: ["tengo", "tuviera", "tendré", "tenga"],
    answer: 1,
    explanation: "Condicional irreal: si + imperfeito do subjuntivo + condicional.",
  },
  {
    id: "p14",
    skill: "vocabulario",
    level: "B2",
    question: "“Echar de menos” quer dizer:",
    options: ["Sentir falta", "Jogar fora", "Diminuir", "Reclamar"],
    answer: 0,
    explanation: "Equivale a “extrañar” na América Latina.",
  },
  {
    id: "p15",
    skill: "construcao",
    level: "B2",
    question: "Qual frase está mais bem construída em registro profissional?",
    options: [
      "Le mando el informe cuando lo termine",
      "Le mando el informe cuando lo termino",
      "Le mandaré el informe cuando lo terminaré",
      "Le mando el informe cuando terminarlo",
    ],
    answer: 0,
    explanation: "Ação futura após “cuando” pede subjuntivo: termine.",
  },
  {
    id: "p16",
    skill: "interpretacao",
    level: "B2",
    context: "— ¡Qué puntual eres! —dijo su jefe cuando llegó cuarenta minutos tarde.",
    question: "O que o chefe quis dizer?",
    options: ["Um elogio sincero", "Uma ironia pela demora", "Uma dúvida", "Um pedido de desculpas"],
    answer: 1,
    explanation: "O contexto (40 minutos de atraso) revela ironia.",
  },
  {
    id: "p17",
    skill: "gramatica",
    level: "C1",
    question: "Qual conector indica contraste formal?",
    options: ["Asimismo", "No obstante", "Además", "Por ejemplo"],
    answer: 1,
    explanation: "“No obstante” = não obstante, contraste de registro alto.",
  },
  {
    id: "p18",
    skill: "leitura",
    level: "C1",
    context:
      "El informe, lejos de aportar soluciones, se limita a enumerar problemas ya conocidos por todos los implicados.",
    question: "Qual é a avaliação do relatório?",
    options: ["Muito útil", "Inovador", "Insuficiente", "Excessivamente técnico"],
    answer: 2,
    explanation: "“lejos de aportar soluciones” indica crítica: é insuficiente.",
  },
  {
    id: "p19",
    skill: "interpretacao",
    level: "C1",
    question: "“A raíz de ello” equivale a:",
    options: ["Em decorrência disso", "Apesar disso", "Desde então", "Por sorte"],
    answer: 0,
    explanation: "Introduz consequência em registro formal.",
  },
  {
    id: "p20",
    skill: "vocabulario",
    level: "C2",
    question: "“Estar en las nubes” significa:",
    options: ["Estar distraído", "Estar feliz", "Viajar de avião", "Estar doente"],
    answer: 0,
    explanation: "Expressão idiomática: estar no mundo da lua.",
  },
  {
    id: "p21",
    skill: "interpretacao",
    level: "C2",
    context: "“No es que no me guste; es que me sobra criterio para no tragármelo.”",
    question: "O tom da frase é:",
    options: ["Neutro e técnico", "Sarcástico e crítico", "Afetuoso", "Formal e protocolar"],
    answer: 1,
    explanation: "“me sobra criterio para no tragármelo” é crítica coloquial e sarcástica.",
  },
  {
    id: "p22",
    skill: "construcao",
    level: "C2",
    question: "Qual reformulação mantém o sentido de “De haberlo sabido, no habría venido”?",
    options: [
      "Si lo hubiera sabido, no habría venido",
      "Si lo sé, no vengo mañana",
      "Cuando lo supe, vine igual",
      "Aunque lo sepa, vendré",
    ],
    answer: 0,
    explanation: "“De + infinitivo composto” equivale ao condicional irreal do passado.",
  },
  {
    id: "p23",
    skill: "compreensao",
    level: "C2",
    context:
      "— Vaya, veo que la reunión ha sido tan productiva como de costumbre —comentó tras dos horas sin acuerdos.",
    question: "O que se conclui?",
    options: [
      "A reunião foi excelente",
      "A reunião foi improdutiva, dita com ironia",
      "Houve acordo rápido",
      "Ele não participou",
    ],
    answer: 1,
    explanation: "“sin acuerdos” contradiz o elogio: ironia.",
  },
  {
    id: "p24",
    skill: "leitura",
    level: "C2",
    context:
      "La autora recurre a un narrador poco fiable, de modo que el lector debe reconstruir los hechos entre líneas.",
    question: "O que o texto afirma sobre a obra?",
    options: [
      "Os fatos são narrados de forma objetiva",
      "O leitor precisa interpretar além do narrado",
      "A obra não tem narrador",
      "É um texto científico",
    ],
    answer: 1,
    explanation: "“narrador poco fiable” exige leitura nas entrelinhas.",
  },
];

export const LEVEL_ORDER: Level[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export type PlacementResult = {
  score: number;
  total: number;
  percent: number;
  level: Level;
  bySkill: { skill: Skill; correct: number; total: number; percent: number }[];
  strengths: Skill[];
  weaknesses: Skill[];
};

export function evaluatePlacement(answers: number[]): PlacementResult {
  const correctFlags = PLACEMENT_TEST.map((q, i) => answers[i] === q.answer);
  const score = correctFlags.filter(Boolean).length;
  const total = PLACEMENT_TEST.length;
  const percent = Math.round((score / total) * 100);

  const skills = Object.keys(SKILL_LABEL) as Skill[];
  const bySkill = skills.map((skill) => {
    const idx = PLACEMENT_TEST.map((q, i) => (q.skill === skill ? i : -1)).filter((i) => i >= 0);
    const correct = idx.filter((i) => correctFlags[i]).length;
    return {
      skill,
      correct,
      total: idx.length,
      percent: idx.length ? Math.round((correct / idx.length) * 100) : 0,
    };
  });

  // nível = maior faixa em que o aluno acertou pelo menos 60% das questões
  let level: Level = "A1";
  for (const lvl of LEVEL_ORDER) {
    const idx = PLACEMENT_TEST.map((q, i) => (q.level === lvl ? i : -1)).filter((i) => i >= 0);
    if (!idx.length) continue;
    const rate = idx.filter((i) => correctFlags[i]).length / idx.length;
    if (rate >= 0.6) level = lvl;
    else break;
  }

  const sorted = [...bySkill].sort((a, b) => b.percent - a.percent);
  const strengths = sorted.filter((s) => s.percent >= 67).slice(0, 3).map((s) => s.skill);
  const weaknesses = [...sorted].reverse().filter((s) => s.percent < 67).slice(0, 3).map((s) => s.skill);

  return { score, total, percent, level, bySkill, strengths, weaknesses };
}
