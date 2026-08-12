import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, BookOpen, Check, MessagesSquare, Mic, RotateCcw, Trophy, Volume2, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AiChat } from "@/components/ai-chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { LESSONS, TRACK_LABEL } from "@/lib/course-data";
import { useProgress } from "@/lib/progress-store";
import { normalize, speakSpanish } from "@/lib/speech";


export const Route = createFileRoute("/aula/$lessonId")({
  head: () => ({
    meta: [
      { title: "Aula de espanhol guiada | Habla+ Espanhol" },
      {
        name: "description",
        content: "Estude com explicação de gramática, vocabulário, áudio, escrita e exercícios corrigidos na hora.",
      },
      { property: "og:title", content: "Aula de espanhol guiada | Habla+" },
      { property: "og:description", content: "Gramática, vocabulário, áudio e exercícios em uma aula curta." },
    ],
  }),
  component: LessonPage,
});

function LessonPage() {
  const { lessonId } = Route.useParams();
  const navigate = useNavigate();
  const { state, completeLesson } = useProgress();
  const lesson = useMemo(() => LESSONS.find((l) => l.id === lessonId), [lessonId]);

  const [phase, setPhase] = useState<"study" | "practice" | "conversa" | "revisao" | "teste" | "done">("study");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [typed, setTyped] = useState("");
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  if (!lesson) {
    return (
      <AppShell>
        <p className="text-sm text-muted-foreground">Aula não encontrada.</p>
        <Link to="/aulas" className="mt-3 inline-block text-primary underline">
          Voltar para a trilha
        </Link>
      </AppShell>
    );
  }

  const questions = phase === "teste" ? [...lesson.exercises].reverse() : lesson.exercises;
  const exercise = questions[index]!;
  const variant = state.profile.variant;

  function resetQuiz() {
    setIndex(0);
    setSelected(null);
    setTyped("");
    setChecked(false);
    setCorrectCount(0);
  }

  function isCorrect() {
    if (!exercise) return false;
    if (exercise.kind === "speak") return true;
    if (exercise.kind === "translate") {
      const value = normalize(typed);
      return value === normalize(exercise.answer) || exercise.accepted.some((a) => normalize(a) === value);
    }
    return selected === exercise.answer;
  }

  function handleCheck() {
    if (checked) {
      const nextIndex = index + 1;
      if (nextIndex >= questions.length) {
        if (phase === "practice") {
          resetQuiz();
          setPhase("conversa");
          return;
        }
        const accuracy = Math.round((correctCount / questions.length) * 100);
        completeLesson({
          lessonId: lesson!.id,
          title: lesson!.title,
          xp: lesson!.xp,
          minutes: lesson!.minutes,
          accuracy,
          words: lesson!.vocab.map((v) => v.es),
        });
        setPhase("done");
        return;
      }
      setIndex(nextIndex);
      setSelected(null);
      setTyped("");
      setChecked(false);
      return;
    }
    if (isCorrect()) setCorrectCount((c) => c + 1);
    setChecked(true);
  }

  if (phase === "done") {
    const accuracy = Math.round((correctCount / lesson.exercises.length) * 100);

    return (
      <AppShell>
        <div className="shadow-soft mx-auto max-w-md rounded-3xl border border-border bg-card p-8 text-center">
          <span className="bg-sun mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-primary-foreground">
            <Check className="h-8 w-8" />
          </span>
          <h1 className="mt-4 text-2xl font-semibold">¡Muy bien!</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Você concluiu “{lesson.title}” com {accuracy}% de acerto.
          </p>
          <div className="mt-5 grid grid-cols-3 gap-2 text-sm">
            <Stat value={`+${lesson.xp}`} label="XP" />
            <Stat value={`${lesson.vocab.length}`} label="palavras" />
            <Stat value={`${lesson.minutes} min`} label="estudo" />
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <Button onClick={() => navigate({ to: "/" })}>Voltar ao início</Button>
            <Button variant="outline" onClick={() => navigate({ to: "/aulas" })}>
              Escolher próxima aula
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Link to="/aulas" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Trilha de aulas
      </Link>

      <header className="mb-5">
        <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
          {lesson.level} · {TRACK_LABEL[lesson.track]}
        </span>
        <h1 className="mt-2 text-2xl font-semibold">{lesson.title}</h1>
        <p className="text-sm text-muted-foreground">{lesson.subtitle}</p>
      </header>

      {phase === "study" ? (
        <div className="space-y-5">
          <section className="shadow-soft rounded-3xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <BookOpen className="h-5 w-5 text-primary" /> {lesson.grammar.title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{lesson.grammar.body}</p>
            <ul className="mt-4 space-y-2">
              {lesson.grammar.examples.map((ex) => (
                <li key={ex.es} className="flex items-center justify-between gap-3 rounded-xl bg-secondary/60 px-3 py-2">
                  <div>
                    <p className="font-medium">{ex.es}</p>
                    <p className="text-xs text-muted-foreground">{ex.pt}</p>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => speakSpanish(ex.es, variant)} aria-label="Ouvir">
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </section>

          <section className="shadow-soft rounded-3xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">Vocabulário da aula</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {lesson.vocab.map((v) => (
                <button
                  key={v.es}
                  onClick={() => speakSpanish(v.es, variant)}
                  className="flex items-center justify-between rounded-xl border border-border px-3 py-2 text-left hover:bg-secondary"
                >
                  <span>
                    <span className="block font-medium">{v.es}</span>
                    <span className="block text-xs text-muted-foreground">{v.pt}</span>
                  </span>
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </section>

          <Button className="w-full" onClick={() => setPhase("practice")}>
            Praticar agora ({lesson.exercises.length} exercícios)
          </Button>
        </div>
      ) : phase === "conversa" ? (
        <div className="space-y-4">
          <section className="shadow-soft rounded-3xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <MessagesSquare className="h-5 w-5 text-primary" /> Conversação da aula
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Use o que você acabou de aprender ({lesson.grammar.title}) conversando com o professor de IA. Ele corrige
              seus erros e explica em português.
            </p>
          </section>
          <AiChat
            scenario={`Prática da aula “${lesson.title}”`}
            scenarioPrompt={`Pratique com o aluno o tema da aula: ${lesson.grammar.title}. ${lesson.grammar.body} Use o vocabulário: ${lesson.vocab
              .map((v) => v.es)
              .join(", ")}.`}
            opener={lesson.grammar.examples[0]?.es ?? "¡Hola! ¿Empezamos?"}
          />
          <Button className="w-full" onClick={() => setPhase("revisao")}>
            Ir para a revisão
          </Button>
        </div>
      ) : phase === "revisao" ? (
        <div className="space-y-5">
          <section className="shadow-soft rounded-3xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <RotateCcw className="h-5 w-5 text-primary" /> Revisão rápida
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{lesson.grammar.body}</p>
            <ul className="mt-4 space-y-2">
              {lesson.grammar.examples.map((ex) => (
                <li key={ex.es} className="flex items-center justify-between gap-3 rounded-xl bg-secondary/60 px-3 py-2">
                  <div>
                    <p className="font-medium">{ex.es}</p>
                    <p className="text-xs text-muted-foreground">{ex.pt}</p>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => speakSpanish(ex.es, variant)} aria-label="Ouvir">
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {lesson.vocab.map((v) => (
                <button
                  key={v.es}
                  onClick={() => speakSpanish(v.es, variant)}
                  className="flex items-center justify-between rounded-xl border border-border px-3 py-2 text-left hover:bg-secondary"
                >
                  <span>
                    <span className="block font-medium">{v.es}</span>
                    <span className="block text-xs text-muted-foreground">{v.pt}</span>
                  </span>
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </section>
          <Button
            className="w-full"
            onClick={() => {
              resetQuiz();
              setPhase("teste");
            }}
          >
            <Trophy className="mr-2 h-4 w-4" /> Fazer o teste final
          </Button>
        </div>
      ) : (
        <div className="shadow-soft rounded-3xl border border-border bg-card p-6">
          {phase === "teste" && (
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <Trophy className="h-4 w-4 text-primary" /> Teste final da aula
            </p>
          )}
          <Progress value={((index + (checked ? 1 : 0)) / questions.length) * 100} className="h-2" />
          <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">{exercise.prompt}</p>
          <p className="font-display mt-1 text-xl">{exercise.question}</p>


          {(exercise.kind === "listen" || exercise.kind === "speak") && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => speakSpanish(exercise.audioText, variant)}
            >
              {exercise.kind === "speak" ? <Mic className="mr-2 h-4 w-4" /> : <Volume2 className="mr-2 h-4 w-4" />}
              Ouvir em espanhol
            </Button>
          )}

          {(exercise.kind === "choice" || exercise.kind === "listen") && (
            <div className="mt-4 grid gap-2">
              {exercise.options.map((opt, i) => {
                const isAnswer = i === exercise.answer;
                const state =
                  checked && isAnswer
                    ? "border-success bg-success/10"
                    : checked && selected === i
                      ? "border-destructive bg-destructive/10"
                      : selected === i
                        ? "border-primary bg-secondary"
                        : "border-border";
                return (
                  <button
                    key={opt}
                    disabled={checked}
                    onClick={() => setSelected(i)}
                    className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors ${state}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {exercise.kind === "translate" && (
            <Input
              className="mt-4"
              value={typed}
              maxLength={140}
              disabled={checked}
              placeholder="Escreva em espanhol…"
              onChange={(e) => setTyped(e.target.value)}
            />
          )}

          {exercise.kind === "speak" && (
            <p className="mt-4 rounded-xl bg-secondary/60 p-3 text-sm text-muted-foreground">
              Repita a frase em voz alta imitando o áudio. Quando estiver confortável, siga em frente.
            </p>
          )}

          {checked && (
            <div
              className={`mt-4 flex items-start gap-2 rounded-xl p-3 text-sm ${
                isCorrect() ? "bg-success/10 text-foreground" : "bg-destructive/10 text-foreground"
              }`}
            >
              {isCorrect() ? (
                <Check className="mt-0.5 h-4 w-4 text-success" />
              ) : (
                <X className="mt-0.5 h-4 w-4 text-destructive" />
              )}
              <span>
                <strong>{isCorrect() ? "¡Correcto!" : "Quase lá."}</strong>{" "}
                {exercise.kind === "translate" && !isCorrect() && (
                  <>
                    Resposta: <em>{exercise.answer}</em>.{" "}
                  </>
                )}
                {exercise.explanation}
              </span>
            </div>
          )}

          <Button
            className="mt-5 w-full"
            disabled={
              !checked &&
              ((exercise.kind === "translate" && typed.trim().length === 0) ||
                ((exercise.kind === "choice" || exercise.kind === "listen") && selected === null))
            }
            onClick={handleCheck}
          >
            {checked
              ? index + 1 >= questions.length
                ? phase === "practice"
                  ? "Ir para a conversação"
                  : "Concluir aula"
                : "Próximo"
              : "Verificar"}

          </Button>
        </div>
      )}
    </AppShell>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-secondary/60 px-2 py-3">
      <p className="font-display text-lg font-semibold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
