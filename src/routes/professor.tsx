import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Loader2, Sparkles, Volume2, XCircle } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { askTeacher, type DoubtAnswer } from "@/lib/ai.functions";
import { speakSpanish } from "@/lib/speech";
import { useProgress } from "@/lib/progress-store";

export const Route = createFileRoute("/professor")({
  head: () => ({
    meta: [
      { title: "Pergunte ao Professor de Espanhol com IA | Habla+" },
      {
        name: "description",
        content:
          "Tire dúvidas de espanhol com um professor de IA: explicação simples em português, exemplos com áudio e exercícios criados na hora.",
      },
      { property: "og:title", content: "Pergunte ao Professor de Espanhol com IA | Habla+" },
      { property: "og:description", content: "Explicações simples em português, exemplos e exercícios sobre a sua dúvida." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfessorPage,
});

const IDEAS = [
  "Qual a diferença entre ser e estar?",
  "Quando uso por e para?",
  "Como funciona o pretérito indefinido?",
  "Quais são os falsos cognatos mais perigosos?",
];

function ProfessorPage() {
  const { state, addXp } = useProgress();
  const variant = state.profile.variant;
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<DoubtAnswer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [picked, setPicked] = useState<Record<number, number>>({});

  async function ask(q: string) {
    const value = q.trim();
    if (value.length < 3) return;
    setQuestion(value);
    setLoading(true);
    setError("");
    setPicked({});
    try {
      const data = await askTeacher({ data: { question: value, level: state.profile.level, variant } });
      setAnswer(data);
      addXp(10, { minutes: 2 });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      setError(
        msg === "RATE_LIMIT"
          ? "Muitas perguntas seguidas. Espere alguns segundos."
          : msg === "NO_CREDITS"
            ? "Os créditos de IA acabaram."
            : "Não consegui responder agora. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <header className="mb-5">
        <h1 className="font-display text-3xl font-semibold">Pergunte ao Professor</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Escreva sua dúvida em português. O professor explica de forma simples, dá exemplos e cria exercícios.
        </p>
      </header>

      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          void ask(question);
        }}
      >
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={3}
          placeholder="Professor, qual a diferença entre ser e estar?"
          aria-label="Sua dúvida"
        />
        <Button type="submit" disabled={loading} className="gap-1">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Perguntar
        </Button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {IDEAS.map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => void ask(i)}
            className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {i}
          </button>
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      {answer && (
        <article className="shadow-soft mt-6 space-y-5 rounded-2xl border border-border bg-card p-5">
          <h2 className="font-display text-xl font-semibold">{answer.titlePt}</h2>
          <p className="whitespace-pre-line text-sm leading-relaxed">{answer.explanationPt}</p>

          {answer.keyPointsPt.length > 0 && (
            <ul className="space-y-1 text-sm">
              {answer.keyPointsPt.map((k, i) => (
                <li key={i} className="rounded-lg bg-secondary/50 px-3 py-1.5">• {k}</li>
              ))}
            </ul>
          )}

          {answer.examples.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Exemplos</h3>
              <ul className="mt-2 space-y-2">
                {answer.examples.map((ex, i) => (
                  <li key={i} className="flex items-start justify-between gap-3 rounded-xl bg-secondary/50 px-3 py-2">
                    <span>
                      <span className="block text-sm font-medium">{ex.es}</span>
                      <span className="block text-xs text-muted-foreground">{ex.pt}</span>
                    </span>
                    <button
                      type="button"
                      aria-label={`Ouvir: ${ex.es}`}
                      className="mt-0.5 shrink-0 rounded-full p-1.5 text-muted-foreground hover:text-primary"
                      onClick={() => speakSpanish(ex.es, variant)}
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {answer.exercises.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Exercícios sobre a sua dúvida
              </h3>
              <div className="mt-2 space-y-4">
                {answer.exercises.map((ex, qi) => {
                  const chosen = picked[qi];
                  return (
                    <div key={qi} className="rounded-xl border border-border p-3">
                      <p className="text-sm font-medium">{ex.question}</p>
                      <div className="mt-2 grid gap-2">
                        {ex.options.map((opt, oi) => {
                          const isAnswer = oi === ex.answerIndex;
                          const isChosen = chosen === oi;
                          const revealed = chosen !== undefined;
                          return (
                            <button
                              key={oi}
                              type="button"
                              disabled={revealed}
                              onClick={() => {
                                setPicked((p) => ({ ...p, [qi]: oi }));
                                if (isAnswer) addXp(5);
                              }}
                              className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                                revealed && isAnswer
                                  ? "border-primary bg-primary/10"
                                  : revealed && isChosen
                                    ? "border-destructive bg-destructive/10"
                                    : "border-border hover:bg-secondary/60"
                              }`}
                            >
                              {opt}
                              {revealed && isAnswer && <CheckCircle2 className="h-4 w-4 text-primary" />}
                              {revealed && isChosen && !isAnswer && <XCircle className="h-4 w-4 text-destructive" />}
                            </button>
                          );
                        })}
                      </div>
                      {chosen !== undefined && (
                        <p className="mt-2 text-xs text-muted-foreground">{ex.explanationPt}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {answer.tipPt && <p className="rounded-xl bg-secondary/60 px-3 py-2 text-sm">💡 {answer.tipPt}</p>}
        </article>
      )}
    </AppShell>
  );
}
