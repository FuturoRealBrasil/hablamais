import type { AppState } from "./progress-store";

export type SkillScores = {
  vocabulario: number;
  gramatica: number;
  pronuncia: number;
  conversacao: number;
  compreensao: number;
  leitura: number;
  escrita: number;
};

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

function typeAccuracy(state: AppState, types: string[]) {
  let total = 0;
  let correct = 0;
  for (const t of types) {
    const stat = state.exercises?.byType?.[t];
    if (stat) {
      total += stat.total;
      correct += stat.correct;
    }
  }
  return total ? (correct / total) * 100 : null;
}

/** Nota 0-100 por habilidade, combinando volume de prática e acerto. */
export function skillScores(state: AppState): SkillScores {
  const learned = state.learnedWords?.length ?? 0;
  const srsValues = Object.values(state.srs ?? {}) as { ease?: number }[];
  const srsAvg = srsValues.length
    ? srsValues.reduce((a, c) => a + ((c.ease ?? 2.5) - 1.3) / 1.7, 0) / srsValues.length
    : 0;
  const vocabulario = clamp(Math.min(60, learned * 1.5) + srsAvg * 40);

  const grammarVals = Object.values(state.grammarScores ?? {});
  const grammarAvg = grammarVals.length ? grammarVals.reduce((a, c) => a + c, 0) / grammarVals.length : 0;
  const gramatica = clamp(grammarAvg * 0.7 + Math.min(30, (state.grammarDone?.length ?? 0) * 6));

  const pronVals = Object.values(state.pronunciation ?? {});
  const pronAvg = pronVals.length ? pronVals.reduce((a, c) => a + (c.best ?? 0), 0) / pronVals.length : 0;
  const pronuncia = clamp(pronAvg - (state.weakSounds?.length ?? 0) * 3);

  const conversacao = clamp(Math.min(100, (state.dailyConversations ?? 0) * 5 + (state.history?.length ?? 0) * 4 + (state.completedLessons?.length ?? 0) * 3));

  const compreensao = clamp(typeAccuracy(state, ["escutar", "escutar-responder", "audio"]) ?? Math.min(70, pronuncia * 0.6));
  const leitura = clamp(
    typeAccuracy(state, ["traducao", "escolher-traducao", "multipla-escolha"]) ??
      Math.min(70, (state.completedLessons?.length ?? 0) * 8),
  );
  const escrita = clamp(
    typeAccuracy(state, ["escrever", "completar", "organizar", "arrastar"]) ??
      Math.min(60, (state.exercises?.total ?? 0) * 3),
  );

  return { vocabulario, gramatica, pronuncia, conversacao, compreensao, leitura, escrita };
}

export const SKILL_LABEL: Record<keyof SkillScores, string> = {
  vocabulario: "Vocabulário",
  gramatica: "Gramática",
  pronuncia: "Pronúncia",
  conversacao: "Conversação",
  compreensao: "Compreensão",
  leitura: "Leitura",
  escrita: "Escrita",
};

export type Bucket = { label: string; xp: number };

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

/** Série de XP dos últimos N dias a partir do log diário. */
export function xpSeries(log: Record<string, number>, days: number): Bucket[] {
  const out: Bucket[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(Date.now() - i * 86400000);
    out.push({ label: d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }), xp: log[dayKey(d)] ?? 0 });
  }
  return out;
}

export function periodTotals(state: AppState) {
  const log = state.xpLog ?? {};
  const sum = (days: number) => xpSeries(log, days).reduce((a, c) => a + c.xp, 0);
  return {
    week: sum(7),
    month: sum(30),
    total: state.xp ?? 0,
    activeDays: Object.values(log).filter((v) => v > 0).length,
  };
}
