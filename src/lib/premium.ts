import type { AppState } from "./progress-store";

export type PlanId = "free" | "mensal" | "trimestral" | "anual";

export type Plan = {
  id: Exclude<PlanId, "free">;
  name: string;
  months: number;
  price: number;
  perMonth: number;
  badge?: string;
  save?: string;
};

export const PLANS: Plan[] = [
  { id: "mensal", name: "Mensal", months: 1, price: 39.9, perMonth: 39.9 },
  { id: "trimestral", name: "Trimestral", months: 3, price: 99.9, perMonth: 33.3, save: "Economize 17%" },
  { id: "anual", name: "Anual", months: 12, price: 299.9, perMonth: 25, badge: "Mais escolhido", save: "Economize 37%" },
];

export const FREE_FEATURES = [
  "Aulas iniciais do nível A1",
  "Vocabulário básico (30 palavras)",
  "Até 10 exercícios por dia",
  "Até 5 mensagens de conversação por dia",
];

export const PREMIUM_FEATURES = [
  "Curso completo de A1 a C2",
  "Professor de IA ilimitado",
  "Conversação em todos os cenários",
  "Treino de pronúncia com correção",
  "Revisão inteligente",
  "Certificados digitais com validação",
  "Relatórios avançados de desempenho",
];

export const FREE_LIMITS = {
  lessons: 3,
  words: 30,
  exercisesPerDay: 10,
  chatMessagesPerDay: 5,
  levels: ["A1"],
};

export function isPremium(state: AppState) {
  const sub = state.subscription;
  if (!sub || sub.plan === "free") return false;
  if (sub.until && sub.until < new Date().toISOString().slice(0, 10)) return false;
  return true;
}

export function premiumLabel(state: AppState) {
  const sub = state.subscription;
  if (!isPremium(state)) return "Gratuito";
  const plan = PLANS.find((p) => p.id === sub.plan);
  return `Premium ${plan?.name ?? ""}`.trim();
}

export function activatePlan(plan: Plan) {
  const now = new Date();
  const until = new Date(now);
  until.setMonth(until.getMonth() + plan.months);
  return {
    plan: plan.id as PlanId,
    since: now.toISOString().slice(0, 10),
    until: until.toISOString().slice(0, 10),
  };
}

/** Recurso bloqueado no plano gratuito? */
export function isLocked(state: AppState, feature: "pronuncia" | "revisao" | "certificados" | "relatorio-avancado" | "niveis") {
  return !isPremium(state) && ["pronuncia", "revisao", "certificados", "relatorio-avancado", "niveis"].includes(feature);
}
