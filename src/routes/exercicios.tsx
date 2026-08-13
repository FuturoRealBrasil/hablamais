import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Dumbbell } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ExercisePlayer } from "@/components/exercise-player";
import { Button } from "@/components/ui/button";
import { EXERCISES, SKILL_LABEL, TYPE_LABEL, shuffle, type ExerciseType } from "@/lib/exercises";
import { useProgress } from "@/lib/progress-store";

const TYPES = Object.keys(TYPE_LABEL) as ExerciseType[];

export const Route = createFileRoute("/exercicios")({
  head: () => ({
    meta: [
      { title: "Exercícios de Espanhol | Habla+" },
      {
        name: "description",
        content:
          "Dez tipos de exercícios de espanhol: múltipla escolha, complete a frase, tradução, arrastar palavras, escutar, identificar erro e conversação com IA.",
      },
      { property: "og:title", content: "Exercícios de Espanhol | Habla+" },
      { property: "og:description", content: "Pratique espanhol com 10 tipos de exercícios e correção imediata." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ExercisesPage,
});

function ExercisesPage() {
  const { state } = useProgress();
  const [filter, setFilter] = useState<ExerciseType | "todos">("todos");
  const [session, setSession] = useState<string[] | null>(null);

  const pool = useMemo(
    () => (filter === "todos" ? EXERCISES : EXERCISES.filter((e) => e.type === filter)),
    [filter],
  );

  const items = useMemo(
    () => (session ? (session.map((id) => EXERCISES.find((e) => e.id === id)!).filter(Boolean) as typeof EXERCISES) : []),
    [session],
  );

  return (
    <AppShell>
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">Exercícios</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Dez formatos diferentes com correção imediata: resposta certa, sua resposta, explicação e pontuação.
          </p>
        </div>
        <Dumbbell className="hidden h-9 w-9 text-primary sm:block" />
      </header>

      {session ? (
        <div className="mt-6 space-y-4">
          <Button variant="ghost" onClick={() => setSession(null)}>
            ← Voltar aos formatos
          </Button>
          <ExercisePlayer items={items} />
        </div>
      ) : (
        <>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilter("todos")}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${filter === "todos" ? "border-primary bg-secondary" : "border-border text-muted-foreground"}`}
            >
              Todos
            </button>
            {TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFilter(t)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium ${filter === t ? "border-primary bg-secondary" : "border-border text-muted-foreground"}`}
              >
                {TYPE_LABEL[t]}
              </button>
            ))}
          </div>

          <div className="shadow-soft mt-5 rounded-3xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">
              {pool.length} exercício(s) disponível(is) · você já respondeu {state.exercises.total} no total (
              {state.exercises.total ? Math.round((state.exercises.correct / state.exercises.total) * 100) : 0}% de acerto).
            </p>
            <Button className="mt-4" onClick={() => setSession(shuffle(pool).map((e) => e.id))} disabled={!pool.length}>
              Começar sessão
            </Button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {pool.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => setSession([e.id])}
                className="shadow-soft rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:border-primary"
              >
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
                  {TYPE_LABEL[e.type]}
                </span>
                <p className="font-display mt-2 text-base">{e.question}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {SKILL_LABEL[e.skill]} · {e.level} · {e.xp} XP
                </p>
              </button>
            ))}
          </div>
        </>
      )}
    </AppShell>
  );
}
