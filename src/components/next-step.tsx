import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, MapPin, Play, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LEVELS, TRACK_LABEL } from "@/lib/course-data";
import { usePlan, useProgress } from "@/lib/progress-store";
import { SKILL_LABEL, skillScores, type SkillScores } from "@/lib/report";

const SKILL_ROUTE: Record<keyof SkillScores, string> = {
  vocabulario: "/vocabulario",
  gramatica: "/gramatica",
  pronuncia: "/pronuncia",
  conversacao: "/conversar",
  compreensao: "/exercicios",
  leitura: "/exercicios",
  escrita: "/exercicios",
};

/** Painel de orientação: onde o aluno está, o que falta, o que melhorar e qual é a próxima atividade. */
export function NextStepCard() {
  const { state } = useProgress();
  const { plan, next, percent } = usePlan();
  const navigate = useNavigate();

  const levelName = LEVELS.find((l) => l.id === state.profile.level)?.name ?? "";
  const doneCount = plan.filter((l) => state.completedLessons.includes(l.id)).length;
  const remaining = Math.max(0, plan.length - doneCount);

  const scores = skillScores(state);
  const entries = Object.entries(scores) as [keyof SkillScores, number][];
  entries.sort((a, b) => a[1] - b[1]);
  const weakest = entries[0];

  return (
    <section className="shadow-soft rounded-3xl border border-primary/30 bg-card p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Seu caminho agora</p>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-secondary/60 p-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> Onde você está
          </p>
          <p className="mt-1 text-sm font-medium">
            Nível {state.profile.level} · {levelName}
          </p>
          <p className="text-xs text-muted-foreground">{percent}% do nível concluído</p>
        </div>

        <div className="rounded-2xl bg-secondary/60 p-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5" /> Quanto falta
          </p>
          <p className="mt-1 text-sm font-medium">
            {remaining === 0 ? "Nível concluído 🎉" : `${remaining} aula${remaining > 1 ? "s" : ""} restante${remaining > 1 ? "s" : ""}`}
          </p>
          <p className="text-xs text-muted-foreground">
            {doneCount} de {plan.length} aulas feitas
          </p>
        </div>

        <div className="rounded-2xl bg-secondary/60 p-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5" /> O que melhorar
          </p>
          {weakest ? (
            <>
              <p className="mt-1 text-sm font-medium">{SKILL_LABEL[weakest[0]]}</p>
              <button
                type="button"
                className="text-xs text-primary underline-offset-2 hover:underline"
                onClick={() => navigate({ to: SKILL_ROUTE[weakest[0]] })}
              >
                {weakest[1]}% · treinar agora
              </button>
            </>
          ) : (
            <p className="mt-1 text-sm">Comece uma aula para medir</p>
          )}
        </div>
      </div>

      {next && (
        <div className="mt-4 flex flex-col justify-between gap-3 rounded-2xl border border-border p-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Próxima atividade</p>
            <h2 className="mt-0.5 text-lg font-semibold">{next.title}</h2>
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
            <Play className="mr-2 h-4 w-4" /> Continuar
          </Button>
        </div>
      )}
    </section>
  );
}
