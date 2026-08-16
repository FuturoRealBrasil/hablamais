import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarDays, Flame, Trophy, Zap } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/stat-card";
import { SKILL_LABEL, periodTotals, skillScores, xpSeries, type SkillScores } from "@/lib/report";
import { useProgress } from "@/lib/progress-store";

export const Route = createFileRoute("/relatorio")({
  head: () => ({
    meta: [
      { title: "Relatório de Desempenho em Espanhol | Habla+" },
      {
        name: "description",
        content:
          "Acompanhe sua evolução em espanhol por semana, mês e período total: vocabulário, gramática, pronúncia, conversação, compreensão, leitura e escrita.",
      },
      { property: "og:title", content: "Relatório de Desempenho em Espanhol | Habla+" },
      { property: "og:description", content: "Veja a evolução das suas sete habilidades em espanhol ao longo do tempo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RelatorioPage,
});

const PERIODS = [
  { id: "semana", label: "Semana", days: 7 },
  { id: "mes", label: "Mês", days: 30 },
  { id: "total", label: "Total", days: 90 },
] as const;

function RelatorioPage() {
  const { state } = useProgress();
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>(PERIODS[0]);

  const skills = useMemo(() => skillScores(state), [state]);
  const totals = useMemo(() => periodTotals(state), [state]);
  const series = useMemo(() => xpSeries(state.xpLog ?? {}, period.days), [state.xpLog, period]);
  const max = Math.max(10, ...series.map((s) => s.xp));
  const periodXp = series.reduce((a, c) => a + c.xp, 0);

  const entries = Object.entries(skills) as [keyof SkillScores, number][];
  const best = [...entries].sort((a, b) => b[1] - a[1])[0];
  const worst = [...entries].sort((a, b) => a[1] - b[1])[0];

  return (
    <AppShell>
      <header className="mb-5">
        <h1 className="font-display text-3xl font-semibold">Relatório de desempenho</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sua evolução por habilidade e ao longo do tempo.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-4">
        <StatCard icon={Zap} label="XP total" value={String(totals.total)} />
        <StatCard icon={CalendarDays} label="XP na semana" value={String(totals.week)} />
        <StatCard icon={Trophy} label="XP no mês" value={String(totals.month)} />
        <StatCard icon={Flame} label="Dias ativos" value={String(totals.activeDays)} hint={`Sequência: ${state.streak}`} />
      </div>

      <section className="shadow-soft mt-6 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-semibold">Evolução</h2>
          <div className="flex gap-1">
            {PERIODS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPeriod(p)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  p.id === period.id ? "bg-primary/10 text-primary" : "text-muted-foreground"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{periodXp} XP neste período</p>
        <div className="mt-4 flex h-32 items-end gap-1">
          {series.map((s, i) => (
            <div key={i} className="flex-1" title={`${s.label}: ${s.xp} XP`}>
              <div
                className="w-full rounded-t bg-primary/70"
                style={{ height: `${Math.max(2, (s.xp / max) * 100)}%` }}
              />
            </div>
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
          <span>{series[0]?.label}</span>
          <span>{series[series.length - 1]?.label}</span>
        </div>
      </section>

      <section className="shadow-soft mt-6 space-y-3 rounded-2xl border border-border bg-card p-5">
        <h2 className="font-display text-xl font-semibold">Habilidades</h2>
        {entries.map(([key, value]) => (
          <div key={key}>
            <div className="flex items-center justify-between text-sm">
              <span>{SKILL_LABEL[key]}</span>
              <span className="font-medium">{value}%</span>
            </div>
            <Progress value={value} className="mt-1" />
          </div>
        ))}
      </section>

      {best && worst && (
        <p className="mt-4 rounded-xl bg-secondary/60 px-3 py-2 text-sm">
          🏅 Seu ponto forte é <strong>{SKILL_LABEL[best[0]]}</strong> ({best[1]}%). Foque em{" "}
          <strong>{SKILL_LABEL[worst[0]]}</strong> ({worst[1]}%) para evoluir mais rápido.
        </p>
      )}
    </AppShell>
  );
}
