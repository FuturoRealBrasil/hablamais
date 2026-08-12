import { EXERCISES, shuffle, type ExItem } from "./exercises";
import { GRAMMAR_TOPICS } from "./grammar";
import { VOCAB, dueWords } from "./vocabulary";
import { PHONEME_DRILLS } from "./pronunciation";
import type { AppState } from "./progress-store";

export type Diagnostic = {
  id: string;
  area: "vocabulario" | "gramatica" | "pronuncia" | "erros" | "conteudo";
  title: string;
  detail: string;
  severity: "alta" | "media" | "baixa";
};

function wordItem(wordId: string): ExItem | null {
  const w = VOCAB.find((v) => v.id === wordId);
  if (!w) return null;
  const distractors = shuffle(VOCAB.filter((v) => v.id !== w.id))
    .slice(0, 3)
    .map((v) => v.pt);
  const options = shuffle([w.pt, ...distractors]);
  return {
    id: `rev-voc-${w.id}`,
    type: "choose-translation",
    skill: "vocabulario",
    level: w.level === "B2" ? "B2" : w.level,
    promptPt: "Palavra que você estava esquecendo — escolha a tradução.",
    question: `«${w.es}»`,
    options,
    answerIndex: options.indexOf(w.pt),
    explanationPt: `${w.es} = ${w.pt}. Exemplo: «${w.example}» (${w.examplePt}).`,
    xp: 10,
  };
}

function grammarItem(topicId: string, index: number): ExItem | null {
  const topic = GRAMMAR_TOPICS.find((t) => t.id === topicId);
  const ex = topic?.test[index] ?? topic?.exercises[index];
  if (!topic || !ex) return null;
  return {
    id: `rev-gram-${topic.id}-${index}`,
    type: "mc",
    skill: "gramatica",
    level: topic.level,
    promptPt: `Gramática em revisão: ${topic.title}`,
    question: ex.prompt,
    options: ex.options,
    answerIndex: ex.answer,
    explanationPt: ex.explainPt,
    xp: 12,
  };
}

export function buildReview(state: AppState) {
  const diagnostics: Diagnostic[] = [];
  const items: ExItem[] = [];

  // 1. Palavras esquecidas (vencidas no SRS ou com recaídas)
  const due = dueWords(state.srs);
  const lapsed = VOCAB.filter((w) => (state.srs[w.id]?.lapses ?? 0) > 0);
  const forgotten = Array.from(new Set([...lapsed, ...due].map((w) => w.id))).slice(0, 5);
  if (forgotten.length) {
    diagnostics.push({
      id: "d-voc",
      area: "vocabulario",
      title: `${forgotten.length} palavra(s) esquecida(s)`,
      detail: forgotten
        .map((id) => VOCAB.find((v) => v.id === id)?.es)
        .filter(Boolean)
        .join(", "),
      severity: forgotten.length > 3 ? "alta" : "media",
    });
    forgotten.forEach((id) => {
      const item = wordItem(id);
      if (item) items.push(item);
    });
  }

  // 2. Erros frequentes registrados nos exercícios
  const mistakeItems = state.mistakes
    .map((m) => EXERCISES.find((e) => e.id === m.id))
    .filter((e): e is ExItem => Boolean(e))
    .slice(0, 4);
  if (state.mistakes.length) {
    diagnostics.push({
      id: "d-err",
      area: "erros",
      title: `${state.mistakes.length} erro(s) recente(s) para corrigir`,
      detail: state.mistakes.slice(0, 3).map((m) => `“${m.given || "sem resposta"}” → ${m.correct}`).join(" · "),
      severity: state.mistakes.length > 5 ? "alta" : "media",
    });
  }
  items.push(...mistakeItems);

  // 3. Gramática com baixo desempenho
  const weakGrammar = GRAMMAR_TOPICS.filter((t) => {
    const score = state.grammarScores[t.id];
    return typeof score === "number" ? score < 70 : !state.grammarDone.includes(t.id);
  }).slice(0, 3);
  if (weakGrammar.length) {
    diagnostics.push({
      id: "d-gram",
      area: "gramatica",
      title: "Gramática com baixo desempenho",
      detail: weakGrammar.map((t) => t.title).join(" · "),
      severity: "alta",
    });
    weakGrammar.forEach((t) => {
      const item = grammarItem(t.id, 0);
      if (item) items.push(item);
    });
  }

  // 4. Pronúncia fraca
  const weakSounds = Array.from(new Set(state.weakSounds)).slice(0, 4);
  const lowScores = Object.entries(state.pronunciation).filter(([, p]) => p.best < 70);
  if (weakSounds.length || lowScores.length) {
    diagnostics.push({
      id: "d-pron",
      area: "pronuncia",
      title: "Sons que precisam de treino",
      detail: weakSounds.length
        ? weakSounds.join(", ")
        : `${lowScores.length} frase(s) com nota abaixo de 70`,
      severity: "media",
    });
  }

  // 5. Conteúdo não dominado (aulas com baixa precisão)
  const weakLessons = state.history.filter((h) => h.accuracy < 70).slice(0, 3);
  if (weakLessons.length) {
    diagnostics.push({
      id: "d-cont",
      area: "conteudo",
      title: "Aulas para refazer",
      detail: weakLessons.map((h) => `${h.title} (${h.accuracy}%)`).join(" · "),
      severity: "media",
    });
  }

  // Completa a sessão com exercícios variados do banco
  if (items.length < 6) {
    const extras = shuffle(EXERCISES.filter((e) => e.type !== "ai" && !items.some((i) => i.id === e.id)));
    items.push(...extras.slice(0, 6 - items.length));
  }

  const drills = PHONEME_DRILLS.filter((d) => weakSounds.includes(d.sound)).slice(0, 3);

  return { diagnostics, items: items.slice(0, 10), drills, weakLessons };
}
