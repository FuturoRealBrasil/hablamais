import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Clock, Target } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/stat-card";
import { buildStudyPlan, planFocusPt } from "@/lib/study-plan";
import { useProgress } from "@/lib/progress-store";

export const Route = createFileRoute("/plano")({
  head: () => ({
    meta: [
      { title: "Plano de Estudos de Espanhol Personalizado | Habla+" },
      {
        name: "description",
        content:
          "Informe quantos minutos você tem por dia e receba uma rotina de espanhol dividida em vocabulário, gramática, escuta e conversação, ajustada ao seu desempenho.",
      },
      { property: "og:title", content: "Plano de Estudos de Espanhol Personalizado | Habla+" },
      { property: "og:description", content: "Rotina diária automática ajustada às suas habilidades mais fracas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlanoPage,
});

const OPTIONS = [10, 15, 20, 30, 45, 60];

function PlanoPage() {
  const { state, setState } = useProgress();
  const [minutes, setMinutes] = useState(state.planMinutes || state.profile.minutesPerDay || 20);

  const blocks = useMemo(() => buildStudyPlan(state, minutes), [state, minutes]);
  const focus = useMemo(() => planFocusPt(state), [state]);
  const done = Math.min(state.minutesToday, minutes);

  function save(value: number) {
    setMinutes(value);
    setState((s) => ({ ...s, planMinutes: value, profile: { ...s.profile, minutesPerDay: value } }));
  }

  return (
    <AppShell>
      <header className="mb-5">
        <h1 className="font-display text-3xl font-semibold">Plano de estudos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Diga quanto tempo você tem por dia. A rotina é montada automaticamente e se ajusta ao seu desempenho.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        <StatCard icon={Clock} label="Minutos por dia" value={`${minutes} min`} hint="Toque abaixo para mudar" />
        <StatCard icon={Target} label="Hoje" value={`${done}/${minutes} min`} hint="Tempo estudado hoje" />
      </div>

      <Progress value={minutes ? (done / minutes) * 100 : 0} className="mt-3" />

      <div className="mt-4 flex flex-wrap gap-2">
        {OPTIONS.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => save(o)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              o === minutes ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
            }`}
          >
            {o} min
          </button>
        ))}
      </div>

      <p className="mt-4 rounded-xl bg-secondary/60 px-3 py-2 text-sm">🎯 {focus}</p>

      <section className="mt-6 space-y-3">
        <h2 className="font-display text-xl font-semibold">Sua rotina de hoje</h2>
        {blocks.map((b) => (
          <div key={b.id} className="shadow-soft flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{b.emoji}</span>
              <span>
                <span className="block text-sm font-semibold">
                  {b.minutes} minutos — {b.label}
                </span>
                <span className="block text-xs text-muted-foreground">{b.descriptionPt}</span>
              </span>
            </div>
            <Button asChild size="sm" variant="secondary">
              <Link to={b.to}>Começar</Link>
            </Button>
          </div>
        ))}
      </section>
    </AppShell>
  );
}
