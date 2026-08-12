import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Clock, Lock, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { LESSONS, LEVELS, TRACK_LABEL, type Level } from "@/lib/course-data";
import { CURRICULUM } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress-store";

export const Route = createFileRoute("/aulas")({
  head: () => ({
    meta: [
      { title: "Trilha de aulas de espanhol | Habla+ Espanhol" },
      {
        name: "description",
        content:
          "Aulas de espanhol do A1 ao C1: conversação, gramática, vocabulário, viagem, trabalho e provas, com exercícios guiados.",
      },
      { property: "og:title", content: "Trilha de aulas de espanhol | Habla+" },
      {
        property: "og:description",
        content: "Do iniciante ao avançado com aulas curtas, exercícios e prática de pronúncia.",
      },
    ],
  }),
  component: AulasPage,
});

function AulasPage() {
  const { state, hydrated } = useProgress();
  const order: Level[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const userIdx = order.indexOf(state.profile.level);

  return (
    <AppShell>
      <header className="mb-6">
        <h1 className="text-3xl font-semibold">Trilha de aulas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Do primeiro “hola” até o espanhol profissional. Seu nível atual é{" "}
          <strong className="text-foreground">{state.profile.level}</strong>.{" "}
          <Link to="/nivelamento" className="text-primary underline-offset-2 hover:underline">
            Refazer teste de nivelamento
          </Link>
        </p>
      </header>

      <div className="space-y-10">
        {LEVELS.map((lvl, idx) => {
          const locked = hydrated && idx < userIdx;
          const lessons = LESSONS.filter((l) => l.level === lvl.id);
          const curriculum = CURRICULUM[lvl.id];
          return (
            <section key={lvl.id}>
              <div className="mb-3 flex items-center gap-3">
                <span className="bg-sun rounded-full px-3 py-1 text-xs font-bold text-primary-foreground">
                  {lvl.id}
                </span>
                <div>
                  <h2 className="text-lg font-semibold">{lvl.name}</h2>
                  <p className="text-xs text-muted-foreground">{lvl.description}</p>
                </div>
              </div>

              <div className="shadow-soft mb-4 rounded-2xl border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">{curriculum.headline}</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {curriculum.modules.map((m) => (
                    <div key={m.title} className="rounded-xl bg-secondary/50 p-3">
                      <p className="text-sm font-semibold">{m.title}</p>
                      <ul className="mt-1 flex flex-wrap gap-1.5">
                        {m.topics.map((t) => (
                          <li key={t} className="rounded-full bg-background px-2 py-0.5 text-[11px] text-muted-foreground">
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {lessons.map((lesson) => {
                  const done = state.completedLessons.includes(lesson.id);
                  return (
                    <Link
                      key={lesson.id}
                      to="/aula/$lessonId"
                      params={{ lessonId: lesson.id }}
                      className="shadow-soft group rounded-2xl border border-border bg-card p-4 transition-transform hover:-translate-y-0.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-secondary-foreground">
                            {TRACK_LABEL[lesson.track]}
                          </span>
                          <h3 className="mt-2 text-base font-semibold">{lesson.title}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">{lesson.subtitle}</p>
                        </div>
                        {done ? (
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
                        ) : locked ? (
                          <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
                        ) : (
                          <Sparkles className="h-4 w-4 shrink-0 text-accent" />
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> {lesson.minutes} min
                        </span>
                        <span>+{lesson.xp} XP</span>
                        <span>{lesson.vocab.length} palavras</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}
