import type { AppState } from "./progress-store";

export type Rank = { level: number; name: string; min: number; next: number | null };

const RANK_NAMES = [
  "Principiante",
  "Explorador",
  "Aprendiz",
  "Viajante",
  "Comunicador",
  "Conversador",
  "Fluente",
  "Avançado",
  "Mestre",
  "Nativo Honorário",
];

/** Cada nível exige 100 XP a mais que o anterior. */
export function rankFromXp(xp: number): Rank {
  let level = 1;
  let min = 0;
  let step = 100;
  while (xp >= min + step && level < RANK_NAMES.length) {
    min += step;
    step += 100;
    level += 1;
  }
  const next = level < RANK_NAMES.length ? min + step : null;
  return { level, name: RANK_NAMES[level - 1] ?? "Nativo Honorário", min, next };
}

export type Badge = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  earned: (s: AppState) => boolean;
  progress: (s: AppState) => { current: number; target: number };
};

export const BADGES: Badge[] = [
  {
    id: "primeiros-passos",
    name: "Primeiros Passos",
    description: "Concluir a primeira aula",
    emoji: "🌱",
    earned: (s) => s.completedLessons.length >= 1,
    progress: (s) => ({ current: Math.min(1, s.completedLessons.length), target: 1 }),
  },
  {
    id: "primeira-semana",
    name: "Primeira Semana",
    description: "Estudar 7 dias consecutivos",
    emoji: "🔥",
    earned: (s) => s.streak >= 7,
    progress: (s) => ({ current: Math.min(7, s.streak), target: 7 }),
  },
  {
    id: "maratonista",
    name: "Maratonista",
    description: "Chegar a 30 dias de sequência",
    emoji: "🏅",
    earned: (s) => s.streak >= 30,
    progress: (s) => ({ current: Math.min(30, s.streak), target: 30 }),
  },
  {
    id: "poliglota",
    name: "Colecionador de Palavras",
    description: "Aprender 50 palavras novas",
    emoji: "📚",
    earned: (s) => s.learnedWords.length >= 50,
    progress: (s) => ({ current: Math.min(50, s.learnedWords.length), target: 50 }),
  },
  {
    id: "exercitado",
    name: "Treino Pesado",
    description: "Responder 100 exercícios",
    emoji: "💪",
    earned: (s) => s.exercises.total >= 100,
    progress: (s) => ({ current: Math.min(100, s.exercises.total), target: 100 }),
  },
  {
    id: "boca-solta",
    name: "Boca Solta",
    description: "Tirar 90+ em um exercício de pronúncia",
    emoji: "🎤",
    earned: (s) => Object.values(s.pronunciation).some((p) => p.best >= 90),
    progress: (s) => ({
      current: Math.min(90, Math.max(0, ...Object.values(s.pronunciation).map((p) => p.best), 0)),
      target: 90,
    }),
  },
  {
    id: "gramatico",
    name: "Gramático",
    description: "Concluir 5 tópicos de gramática",
    emoji: "🧠",
    earned: (s) => s.grammarDone.length >= 5,
    progress: (s) => ({ current: Math.min(5, s.grammarDone.length), target: 5 }),
  },
  {
    id: "revisor",
    name: "Revisor Dedicado",
    description: "Completar 5 sessões de Revisão Inteligente",
    emoji: "🔁",
    earned: (s) => s.reviewSessions >= 5,
    progress: (s) => ({ current: Math.min(5, s.reviewSessions), target: 5 }),
  },
  {
    id: "mil-xp",
    name: "Mil XP",
    description: "Acumular 1000 XP",
    emoji: "⭐",
    earned: (s) => s.xp >= 1000,
    progress: (s) => ({ current: Math.min(1000, s.xp), target: 1000 }),
  },
];

export type Mission = {
  id: string;
  title: string;
  reward: number;
  current: number;
  target: number;
};

export function dailyMissions(s: AppState): Mission[] {
  return [
    { id: "d:exercicios", title: "Responder 10 exercícios", reward: 20, current: s.dailyExercises, target: 10 },
    { id: "d:minutos", title: `Estudar ${s.profile.minutesPerDay} minutos`, reward: 25, current: s.minutesToday, target: s.profile.minutesPerDay },
    { id: "d:conversa", title: "Conversar com o professor de IA", reward: 30, current: s.dailyConversations, target: 1 },
    { id: "d:revisao", title: "Fazer 1 Revisão Inteligente", reward: 25, current: s.dailyReviews, target: 1 },
  ];
}

export function weeklyGoals(s: AppState): Mission[] {
  return [
    { id: "w:xp", title: "Ganhar 500 XP na semana", reward: 100, current: s.weeklyXp, target: 500 },
    { id: "w:minutos", title: `Estudar ${s.profile.minutesPerDay * 5} minutos na semana`, reward: 80, current: s.weeklyMinutes, target: s.profile.minutesPerDay * 5 },
    { id: "w:aulas", title: "Concluir 5 aulas", reward: 120, current: s.completedLessons.length, target: 5 },
  ];
}

export type Challenge = { id: string; title: string; description: string; xp: number; to: string };

export const CHALLENGES: Challenge[] = [
  { id: "c-pron", title: "Desafio de Pronúncia", description: "Grave 3 frases e tire nota acima de 80.", xp: 40, to: "/pronuncia" },
  { id: "c-flash", title: "Desafio Relâmpago", description: "Revise todos os flashcards vencidos hoje.", xp: 35, to: "/vocabulario" },
  { id: "c-role", title: "Desafio de Roleplay", description: "Complete uma conversa no restaurante em espanhol.", xp: 50, to: "/conversar" },
  { id: "c-mix", title: "Desafio Misto", description: "Acerte 10 exercícios de tipos diferentes seguidos.", xp: 45, to: "/exercicios" },
];

/** Ranking local: o aluno entra numa liga semanal com colegas simulados. */
export function leaderboard(s: AppState) {
  const bots = [
    { name: "Camila R.", xp: 940 },
    { name: "Diego F.", xp: 780 },
    { name: "Marina P.", xp: 610 },
    { name: "Tiago A.", xp: 470 },
    { name: "Bruna L.", xp: 320 },
    { name: "Rafael S.", xp: 210 },
    { name: "Júlia M.", xp: 120 },
  ];
  const me = { name: s.profile.name || "Você", xp: s.weeklyXp, isMe: true };
  return [...bots.map((b) => ({ ...b, isMe: false })), me].sort((a, b) => b.xp - a.xp);
}
