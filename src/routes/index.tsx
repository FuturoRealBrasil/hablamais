import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { BookOpen, Clock, Flame, Languages, Play, Target, Trophy } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LEVELS, TRACK_LABEL } from "@/lib/course-data";
import { useProgress, usePlan } from "@/lib/progress-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Habla+ — Seu Professor de Espanhol com IA" },
      {
        name: "description",
        content:
          "Aprenda espanhol do zero ao avançado: aulas guiadas, conversação, pronúncia, vocabulário e um plano de estudos personalizado.",
      },
      { property: "og:title", content: "Habla+ — Seu Professor de Espanhol com IA" },
      {
        property: "og:description",
        content: "Aprenda espanhol do zero ao avançado: aulas guiadas, conversação, pronúncia, vocabulário e um plano de estudos personalizado.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { state, hydrated } = useProgress();
  const { next, percent, plan } = usePlan();
  const navigate = useNavigate();

  useEffect(() => {
    if (hydrated && !state.onboarded) navigate({ to: "/comecar" });
  }, [hydrated, state.onboarded, navigate]);

  const levelName = LEVELS.find((l) => l.id === state.profile.level)?.name ?? "";
  const goalPercent = Math.min(100, Math.round((state.minutesToday / state.profile.minutesPerDay) * 100));

  return (
    <AppShell>
      <section className="bg-sun shadow-lift relative overflow-hidden rounded-3xl p-6 text-primary-foreground sm:p-8">
        <p className="text-sm opacity-90">¡Hola, {state.profile.name || "estudante"}!</p>
        <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">
          Nível {state.profile.level} · {levelName}
        </h1>
        <div className="mt-5 max-w-md">
          <div className="flex justify-between text-xs opacity-90">
            <span>Progresso do plano</span>
            <span>{percent}%</span>
          </div>
          <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-primary-foreground/25">
            <div className="h-full rounded-full bg-primary-foreground transition-all" style={{ width: `${percent}%` }} />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5">
            <Flame className="h-4 w-4" /> {state.streak} dias seguidos
          </span>
          <span className="flex items-center gap-1.5">
            <Trophy className="h-4 w-4" /> {state.xp} XP
          </span>
          <span className="flex items-center gap-1.5">
            <Languages className="h-4 w-4" /> {state.learnedWords.length} palavras
          </span>
        </div>
      </section>

      {next && (
        <section className="shadow-soft mt-5 rounded-3xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Próxima aula</p>
          <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold">{next.title}</h2>
              <p className="text-sm text-muted-foreground">{next.subtitle}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded-full bg-secondary px-2.5 py-1 font-semibold text-secondary-foreground">
                  {TRACK_LABEL[next.track]}
                </span>
                <span className="rounded-full bg-secondary px-2.5 py-1">{next.minutes} min</span>
                <span className="rounded-full bg-secondary px-2.5 py-1">+{next.xp} XP</span>
              </div>
            </div>
            <Button size="lg" onClick={() => navigate({ to: "/aula/$lessonId", params: { lessonId: next.id } })}>
              <Play className="mr-2 h-4 w-4" /> Continuar estudando
            </Button>
          </div>
        </section>
      )}

      <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Trophy} label="Pontuação" value={`${state.xp} pts`} hint="XP acumulado no app" />
        <StatCard
          icon={BookOpen}
          label="Aulas"
          value={`${state.completedLessons.length}/${plan.length}`}
          hint="concluídas no seu plano"
        />
        <StatCard
          icon={Clock}
          label="Hoje"
          value={`${state.minutesToday} min`}
          hint={`meta de ${state.profile.minutesPerDay} min`}
        />
        <StatCard icon={Languages} label="Vocabulário" value={`${state.learnedWords.length}`} hint="palavras aprendidas" />
      </section>

      <section className="shadow-soft mt-5 rounded-3xl border border-border bg-card p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Target className="h-5 w-5 text-primary" /> Meta diária
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {state.minutesToday} de {state.profile.minutesPerDay} minutos estudados hoje.
        </p>
        <Progress value={goalPercent} className="mt-3 h-2.5" />
      </section>

      <section className="shadow-soft mt-5 rounded-3xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Desempenho recente</h2>
          <Link to="/aulas" className="text-sm text-primary underline-offset-2 hover:underline">
            Ver trilha
          </Link>
        </div>
        {state.history.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Ainda não há histórico. Conclua sua primeira aula para ver seu desempenho aqui.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {state.history.map((h, i) => (
              <li
                key={`${h.lessonId}-${i}`}
                className="flex items-center justify-between rounded-xl bg-secondary/60 px-3 py-2 text-sm"
              >
                <span>
                  <span className="block font-medium">{h.title}</span>
                  <span className="block text-xs text-muted-foreground">{h.date}</span>
                </span>
                <span className={h.accuracy >= 70 ? "font-semibold text-success" : "font-semibold text-primary"}>
                  {h.accuracy}%
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  );
}
