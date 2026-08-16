import type { AppState } from "./progress-store";
import { skillScores } from "./report";

export type PlanBlock = {
  id: string;
  label: string;
  minutes: number;
  emoji: string;
  to: string;
  descriptionPt: string;
};

const BASE: Omit<PlanBlock, "minutes">[] = [
  { id: "vocabulario", label: "Vocabulário", emoji: "🃏", to: "/vocabulario", descriptionPt: "Flashcards com repetição espaçada." },
  { id: "gramatica", label: "Gramática", emoji: "📐", to: "/gramatica", descriptionPt: "Um tópico curto com exemplos e teste." },
  { id: "escuta", label: "Escuta e pronúncia", emoji: "🎧", to: "/pronuncia", descriptionPt: "Ouça, repita e receba nota de pronúncia." },
  { id: "conversacao", label: "Conversação", emoji: "💬", to: "/conversar", descriptionPt: "Roleplay com o professor de IA." },
  { id: "revisao", label: "Revisão inteligente", emoji: "🔁", to: "/revisao", descriptionPt: "Repasse dos seus pontos fracos." },
];

/** Distribui os minutos disponíveis dando mais tempo às habilidades mais fracas. */
export function buildStudyPlan(state: AppState, minutes: number): PlanBlock[] {
  const s = skillScores(state);
  const weights: Record<string, number> = {
    vocabulario: 100 - s.vocabulario,
    gramatica: 100 - s.gramatica,
    escuta: 100 - Math.round((s.pronuncia + s.compreensao) / 2),
    conversacao: 100 - s.conversacao,
    revisao: 100 - Math.round((s.leitura + s.escrita) / 2),
  };

  const blocks = minutes <= 10 ? BASE.slice(0, 2) : minutes <= 20 ? BASE.slice(0, 4) : BASE;
  const total = blocks.reduce((acc, b) => acc + Math.max(20, weights[b.id] ?? 50), 0);
  const unit = 5;

  let remaining = minutes;
  const result: PlanBlock[] = blocks.map((b, i) => {
    const share = Math.max(20, weights[b.id] ?? 50) / total;
    const raw = i === blocks.length - 1 ? remaining : Math.max(unit, Math.round((minutes * share) / unit) * unit);
    const value = Math.min(raw, Math.max(unit, remaining - unit * (blocks.length - 1 - i)));
    remaining -= value;
    return { ...b, minutes: value };
  });

  return result.filter((b) => b.minutes > 0);
}

export function planFocusPt(state: AppState): string {
  const s = skillScores(state);
  const entries = Object.entries(s) as [string, number][];
  entries.sort((a, b) => a[1] - b[1]);
  const weakest = entries[0];
  if (!weakest) return "Comece pelo vocabulário básico.";
  return `Seu ponto mais fraco agora é ${weakest[0]} (${weakest[1]}%). O plano dá mais tempo para essa habilidade.`;
}
