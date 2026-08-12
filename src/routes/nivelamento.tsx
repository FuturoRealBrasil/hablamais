import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { LEVELS } from "@/lib/course-data";
import { CURRICULUM } from "@/lib/curriculum";
import { PLACEMENT_TEST, SKILL_LABEL, SKILL_TIP, evaluatePlacement } from "@/lib/placement";
import { useProgress } from "@/lib/progress-store";

export const Route = createFileRoute("/nivelamento")({
  head: () => ({
    meta: [
      { title: "Teste de nivelamento de espanhol A1 a C2 | Habla+" },
      {
        name: "description",
        content:
          "Faça o teste de nivelamento de espanhol do Habla+: 24 questões de vocabulário, gramática, leitura, compreensão, construção de frases e interpretação, com resultado A1–C2.",
      },
      { property: "og:title", content: "Teste de nivelamento de espanhol A1–C2 | Habla+" },
      {
        property: "og:description",
        content: "Descubra seu nível de espanhol e veja seus pontos fortes e fracos por habilidade.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NivelamentoPage,
});

function NivelamentoPage() {
  const navigate = useNavigate();
  const { setState } = useProgress();
  const [answers, setAnswers] = useState<number[]>(Array(PLACEMENT_TEST.length).fill(-1));
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  const q = PLACEMENT_TEST[index]!;
  const result = evaluatePlacement(answers);

  function pick(i: number) {
    const next = [...answers];
    next[index] = i;
    setAnswers(next);
    if (index < PLACEMENT_TEST.length - 1) setIndex(index + 1);
    else setDone(true);
  }

  function applyLevel() {
    setState((s) => ({ ...s, onboarded: true, profile: { ...s.profile, level: result.level } }));
    toast.success(`Trilha ajustada para o nível ${result.level}`);
    navigate({ to: "/aulas" });
  }

  if (done) {
    const levelInfo = LEVELS.find((l) => l.id === result.level);
    return (
      <AppShell>
        <section className="bg-sun shadow-lift rounded-3xl p-6 text-primary-foreground sm:p-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-foreground/20">
            <Sparkles className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-3xl font-semibold">Seu nível é {result.level}</h1>
          <p className="mt-1 text-sm opacity-90">
            {levelInfo?.name} — {result.score} de {result.total} acertos ({result.percent}%).
          </p>
        </section>

        <section className="shadow-soft mt-5 rounded-3xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">Desempenho por habilidade</h2>
          <ul className="mt-4 space-y-3">
            {result.bySkill.map((s) => (
              <li key={s.skill}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{SKILL_LABEL[s.skill]}</span>
                  <span className="text-muted-foreground">
                    {s.correct}/{s.total} · {s.percent}%
                  </span>
                </div>
                <Progress value={s.percent} className="mt-1.5 h-2" />
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <section className="shadow-soft rounded-3xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <TrendingUp className="h-5 w-5 text-success" /> Pontos fortes
            </h2>
            {result.strengths.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">
                Ainda não há uma habilidade destacada — o plano vai construir sua base do zero.
              </p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm">
                {result.strengths.map((s) => (
                  <li key={s} className="flex items-start gap-2 rounded-xl bg-secondary/60 px-3 py-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-success" /> {SKILL_LABEL[s]}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="shadow-soft rounded-3xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <TrendingDown className="h-5 w-5 text-primary" /> Pontos a melhorar
            </h2>
            {result.weaknesses.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">Excelente: nenhuma habilidade ficou abaixo da média.</p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm">
                {result.weaknesses.map((s) => (
                  <li key={s} className="rounded-xl bg-secondary/60 px-3 py-2">
                    <span className="block font-medium">{SKILL_LABEL[s]}</span>
                    <span className="block text-xs text-muted-foreground">{SKILL_TIP[s]}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <section className="shadow-soft mt-5 rounded-3xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">Seu ponto de partida no curso</h2>
          <p className="mt-1 text-sm text-muted-foreground">{CURRICULUM[result.level].headline}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {CURRICULUM[result.level].modules.map((m) => (
              <span key={m.title} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                {m.title}
              </span>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={applyLevel}>
              Usar este nível na minha trilha <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setAnswers(Array(PLACEMENT_TEST.length).fill(-1));
                setIndex(0);
                setDone(false);
              }}
            >
              Refazer teste
            </Button>
          </div>
        </section>

        <section className="shadow-soft mt-5 rounded-3xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">Revisão das questões</h2>
          <ul className="mt-3 space-y-3">
            {PLACEMENT_TEST.map((item, i) => {
              const ok = answers[i] === item.answer;
              return (
                <li key={item.id} className="rounded-xl border border-border p-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {item.level} · {SKILL_LABEL[item.skill]}
                    </span>
                    <span className={ok ? "text-xs font-semibold text-success" : "text-xs font-semibold text-destructive"}>
                      {ok ? "Acertou" : "Errou"}
                    </span>
                  </div>
                  <p className="mt-1 font-medium">{item.question}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Resposta certa: {item.options[item.answer]} — {item.explanation}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <header className="mb-5">
        <h1 className="text-3xl font-semibold">Teste de nivelamento</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {PLACEMENT_TEST.length} questões de vocabulário, gramática, leitura, compreensão, construção de frases e
          interpretação. Ao final você recebe seu nível (A1 a C2) e seus pontos fortes e fracos.
        </p>
      </header>

      <Progress value={((index + 1) / PLACEMENT_TEST.length) * 100} className="h-2" />
      <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
        Pergunta {index + 1} de {PLACEMENT_TEST.length} · {SKILL_LABEL[q.skill]}
      </p>

      <section className="shadow-soft mt-4 rounded-3xl border border-border bg-card p-6">
        {q.context && (
          <p className="mb-4 rounded-2xl bg-secondary/60 px-4 py-3 text-sm italic">{q.context}</p>
        )}
        <p className="font-display text-lg">{q.question}</p>
        <div className="mt-4 grid gap-2">
          {q.options.map((opt, i) => (
            <button
              key={opt}
              onClick={() => pick(i)}
              className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors hover:border-primary hover:bg-secondary ${
                answers[index] === i ? "border-primary bg-secondary" : "border-border bg-background"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="mt-5 flex justify-between">
          <Button variant="ghost" disabled={index === 0} onClick={() => setIndex(index - 1)}>
            <ArrowLeft className="mr-1 h-4 w-4" /> Voltar
          </Button>
          <Button variant="ghost" onClick={() => (index < PLACEMENT_TEST.length - 1 ? setIndex(index + 1) : setDone(true))}>
            Pular
          </Button>
        </div>
      </section>
    </AppShell>
  );
}
