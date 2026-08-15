import type { AppState } from "./progress-store";

export type DailyChallenge = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  xp: number;
  to: string;
  ctaLabel: string;
  target: number;
  current: (s: AppState) => number;
};

/** Banco de desafios — um diferente é sorteado a cada dia. */
export const CHALLENGE_POOL: DailyChallenge[] = [
  {
    id: "palavras10",
    title: "Aprenda 10 palavras novas",
    description: "Revise flashcards até fixar 10 palavras hoje.",
    emoji: "📚",
    xp: 60,
    to: "/vocabulario",
    ctaLabel: "Ir para o vocabulário",
    target: 10,
    current: (s) => s.dailyWords ?? 0,
  },
  {
    id: "conversa5min",
    title: "Converse 5 minutos com a IA",
    description: "Escolha uma situação e mantenha o diálogo em espanhol.",
    emoji: "🗣️",
    xp: 55,
    to: "/conversar",
    ctaLabel: "Conversar agora",
    target: 5,
    current: (s) => Math.min(5, s.minutesToday) + (s.dailyConversations > 0 ? 0 : 0),
  },
  {
    id: "exercicios20",
    title: "Complete 20 exercícios",
    description: "Treino livre com correção imediata.",
    emoji: "🎯",
    xp: 70,
    to: "/exercicios",
    ctaLabel: "Começar treino",
    target: 20,
    current: (s) => s.dailyExercises,
  },
  {
    id: "expressoes-espanha",
    title: "Aprenda 5 expressões usadas na Espanha",
    description: "Estude expressões típicas do espanhol peninsular.",
    emoji: "🇪🇸",
    xp: 50,
    to: "/vocabulario",
    ctaLabel: "Ver expressões",
    target: 5,
    current: (s) => s.dailyWords ?? 0,
  },
  {
    id: "pronuncia3",
    title: "Grave 3 frases na pronúncia",
    description: "Treine os sons difíceis: R, RR, J, LL e Ñ.",
    emoji: "🎤",
    xp: 55,
    to: "/pronuncia",
    ctaLabel: "Treinar pronúncia",
    target: 3,
    current: (s) => Object.values(s.pronunciation).reduce((n, p) => n + (p.attempts > 0 ? 1 : 0), 0),
  },
  {
    id: "revisao1",
    title: "Faça 1 Revisão Inteligente",
    description: "Sessão montada com seus pontos fracos de hoje.",
    emoji: "🔁",
    xp: 45,
    to: "/revisao",
    ctaLabel: "Abrir revisão",
    target: 1,
    current: (s) => s.dailyReviews,
  },
  {
    id: "viagem-sim",
    title: "Simule uma situação de viagem",
    description: "Aeroporto, hotel ou táxi: resolva tudo em espanhol.",
    emoji: "🧳",
    xp: 50,
    to: "/viagens",
    ctaLabel: "Ir para viagens",
    target: 1,
    current: (s) => s.dailyConversations,
  },
  {
    id: "trabalho-sim",
    title: "Pratique uma situação profissional",
    description: "Entrevista, reunião ou negociação em espanhol.",
    emoji: "💼",
    xp: 50,
    to: "/profissional",
    ctaLabel: "Ir para profissional",
    target: 1,
    current: (s) => s.dailyConversations,
  },
  {
    id: "gramatica1",
    title: "Conclua 1 tópico de gramática",
    description: "Explicação, comparação com o português e teste.",
    emoji: "🧠",
    xp: 45,
    to: "/gramatica",
    ctaLabel: "Estudar gramática",
    target: 1,
    current: (s) => (s.grammarDone.length > 0 ? 1 : 0),
  },
  {
    id: "xp100",
    title: "Ganhe 100 XP hoje",
    description: "Vale qualquer atividade do app.",
    emoji: "⚡",
    xp: 60,
    to: "/aulas",
    ctaLabel: "Ver trilha",
    target: 100,
    current: (s) => s.dailyXp,
  },
];

export const todayKey = () => new Date().toISOString().slice(0, 10);

function hashDate(key: string) {
  let h = 0;
  for (let i = 0; i < key.length; i += 1) h = (h * 31 + key.charCodeAt(i)) % 100000;
  return h;
}

/** Desafio determinístico do dia (muda todo dia, igual para o mesmo dia). */
export function challengeOfDay(key = todayKey()): DailyChallenge {
  const index = hashDate(key) % CHALLENGE_POOL.length;
  return CHALLENGE_POOL[index]!;
}

export function challengeClaimId(key = todayKey()) {
  return `d:desafio:${key}`;
}

export function challengeStatus(s: AppState, key = todayKey()) {
  const challenge = challengeOfDay(key);
  const current = Math.min(challenge.target, Math.max(0, challenge.current(s)));
  const done = current >= challenge.target;
  const claimed = s.claimed.includes(challengeClaimId(key));
  const percent = Math.min(100, Math.round((current / challenge.target) * 100));
  return { challenge, current, done, claimed, percent };
}
