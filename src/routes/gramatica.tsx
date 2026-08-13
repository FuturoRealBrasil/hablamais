import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Volume2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { GRAMMAR_TOPICS, type GrammarExercise } from "@/lib/grammar";
import { speakSpanish } from "@/lib/speech";
import { useProgress } from "@/lib/progress-store";

export const Route = createFileRoute("/gramatica")({
  head: () => ({
    meta: [
      { title: "Gramática Espanhola para Brasileiros | Habla+" },
      {
        name: "description",
        content:
          "Gramática de espanhol explicada em português: ser x estar, gustar, subjuntivo, falsos cognatos e os erros mais comuns de brasileiros.",
      },
      { property: "og:title", content: "Gramática Espanhola para Brasileiros | Habla+" },
      { property: "og:description", content: "Explicação simples, comparação português x espanhol, exercícios, teste e revisão." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GramaticaPage,
});

const STEPS = ["explicacao", "exemplos", "comparacao", "exercicios", "teste", "revisao"] as const;
const STEP_LABEL: Record<(typeof STEPS)[number], string> = {
  explicacao: "Explicação",
  exemplos: "Exemplos",
  comparacao: "PT x ES",
  exercicios: "Exercícios",
  teste: "Teste",
  revisao: "Revisão",
};

function Quiz({
  items,
  onFinish,
}: {
  items: GrammarExercise[];
  onFinish?: (correct: number) => void;
}) {
  const [answers, setAnswers] = useState<Record<number, number>>({});

  function choose(qi: number, oi: number) {
    if (answers[qi] !== undefined) return;
    const next = { ...answers, [qi]: oi };
    setAnswers(next);
    if (Object.keys(next).length === items.length && onFinish) {
      onFinish(items.filter((q, i) => next[i] === q.answer).length);
    }
  }

  return (
    <div className="space-y-4">
      {items.map((q, qi) => {
        const chosen = answers[qi];
        return (
          <div key={q.prompt} className="rounded-2xl border border-border bg-background p-4">
            <p className="font-medium">{q.prompt}</p>
            <div className="mt-3 grid gap-2">
              {q.options.map((opt, oi) => {
                const isAnswer = oi === q.answer;
                const picked = chosen === oi;
                const done = chosen !== undefined;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => choose(qi, oi)}
                    className={`rounded-xl border px-3.5 py-2.5 text-left text-sm transition-colors ${
                      done && isAnswer
                        ? "border-emerald-500 bg-emerald-500/10"
                        : picked
                          ? "border-destructive bg-destructive/10"
                          : "border-border hover:border-primary/40"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {chosen !== undefined && <p className="mt-2 text-sm text-muted-foreground">{q.explainPt}</p>}
          </div>
        );
      })}
    </div>
  );
}

function GramaticaPage() {
  const { state, setState } = useProgress();
  const [topicId, setTopicId] = useState(GRAMMAR_TOPICS[0]!.id);
  const [step, setStep] = useState<(typeof STEPS)[number]>("explicacao");
  const topic = GRAMMAR_TOPICS.find((t) => t.id === topicId)!;
  const variant = state.profile.variant;
  const done = state.grammarDone.includes(topic.id);

  function finishTest(correct: number) {
    const score = topic.test.length ? Math.round((correct / topic.test.length) * 100) : 0;
    setState((s) => ({
      ...s,
      xp: s.xp + correct * 10,
      weeklyXp: s.weeklyXp + correct * 10,
      grammarScores: { ...s.grammarScores, [topic.id]: score },
      grammarDone: s.grammarDone.includes(topic.id) ? s.grammarDone : [...s.grammarDone, topic.id],
    }));
    setStep("revisao");
  }


  return (
    <AppShell>
      <header className="mb-5">
        <h1 className="font-display text-3xl font-semibold">Gramática</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Explicações em português, comparações com o português do Brasil e os erros mais comuns de brasileiros.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-2">
          {GRAMMAR_TOPICS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTopicId(t.id);
                setStep("explicacao");
              }}
              className={`flex w-full items-start gap-2 rounded-2xl border p-3 text-left transition-colors ${
                t.id === topicId ? "border-primary bg-secondary" : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <span className="mt-0.5 rounded-full bg-background px-2 py-0.5 text-[11px] font-semibold">{t.level}</span>
              <span className="flex-1 text-sm font-medium">{t.title}</span>
              {state.grammarDone.includes(t.id) && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
            </button>
          ))}
        </aside>

        <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-semibold">{topic.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{topic.summaryPt}</p>
            </div>
            {done && <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700">Concluído</span>}
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {STEPS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStep(s)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                  s === step ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                }`}
              >
                {STEP_LABEL[s]}
              </button>
            ))}
          </div>

          <div className="mt-5">
            {step === "explicacao" && (
              <ul className="space-y-3">
                {topic.explanationPt.map((p) => (
                  <li key={p} className="rounded-2xl border border-border bg-background p-4 text-sm leading-relaxed">
                    {p}
                  </li>
                ))}
              </ul>
            )}

            {step === "exemplos" && (
              <ul className="space-y-3">
                {topic.examples.map((ex) => (
                  <li key={ex.es} className="flex items-start justify-between gap-3 rounded-2xl border border-border bg-background p-4">
                    <div>
                      <p className="font-display text-lg font-semibold">{ex.es}</p>
                      <p className="text-sm text-muted-foreground">{ex.pt}</p>
                    </div>
                    <Button size="icon" variant="ghost" aria-label="Ouvir exemplo" onClick={() => speakSpanish(ex.es, variant)}>
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}

            {step === "comparacao" && (
              <ul className="space-y-3">
                {topic.comparison.map((c) => (
                  <li key={c.es} className="rounded-2xl border border-border bg-background p-4">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <p className="rounded-xl bg-muted p-3 text-sm">
                        <span className="block text-[11px] font-semibold uppercase text-muted-foreground">Português</span>
                        {c.pt}
                      </p>
                      <p className="rounded-xl bg-secondary/60 p-3 text-sm">
                        <span className="block text-[11px] font-semibold uppercase text-muted-foreground">Español</span>
                        {c.es}
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{c.notePt}</p>
                  </li>
                ))}
              </ul>
            )}

            {step === "exercicios" && (
              <>
                <Quiz items={topic.exercises} />
                <Button className="mt-4" onClick={() => setStep("teste")}>
                  Ir para o teste
                </Button>
              </>
            )}

            {step === "teste" && <Quiz items={topic.test} onFinish={finishTest} />}

            {step === "revisao" && (
              <ul className="space-y-2">
                {topic.reviewPt.map((r) => (
                  <li key={r} className="flex items-center gap-2 rounded-2xl border border-border bg-background p-3.5 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" /> {r}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
