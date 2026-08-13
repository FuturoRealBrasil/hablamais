import { useMemo, useState } from "react";
import { Check, ChevronRight, RotateCcw, Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AiChat } from "@/components/ai-chat";
import { useProgress } from "@/lib/progress-store";
import { speakSpanish } from "@/lib/speech";
import { TYPE_LABEL, checkAnswer, correctAnswerOf, shuffle, type ExItem } from "@/lib/exercises";

type Result = { score: number; given: string; xp: number };

export function ExercisePlayer({
  items,
  kind = "exercicio",
  onFinish,
}: {
  items: ExItem[];
  kind?: "exercicio" | "revisao";
  onFinish?: (summary: { xp: number; correct: number; total: number }) => void;
}) {
  const { state, addXp, recordExercise } = useProgress();
  const [index, setIndex] = useState(0);
  const [given, setGiven] = useState("");
  const [tokens, setTokens] = useState<string[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [done, setDone] = useState(false);

  const item = items[index];
  const pool = useMemo(() => (item?.tokens ? shuffle(item.tokens) : []), [item?.id]);

  if (!item) return null;

  const chosen = tokens;
  const answerFromTokens = chosen.join(" ");

  function submit(value: string) {
    if (result || !item) return;
    const score = checkAnswer(item, value);
    const xp = Math.round(item.xp * score);
    const res = { score, given: value, xp };
    setResult(res);
    setResults((r) => [...r, res]);
    recordExercise({
      id: item.id,
      type: item.type,
      skill: item.skill,
      question: item.question,
      given: value || "(sem resposta)",
      correct: correctAnswerOf(item),
      isCorrect: score >= 1,
    });
    if (xp > 0) addXp(xp, item.type === "ai" ? { minutes: 1, kind: "conversa" } : { minutes: 1 });
  }

  function next() {
    if (index + 1 >= items.length) {
      const all = [...results];
      const xp = all.reduce((sum, r) => sum + r.xp, 0);
      const correct = all.filter((r) => r.score >= 1).length;
      if (kind === "revisao") addXp(25, { minutes: 2, kind: "revisao" });
      setDone(true);
      onFinish?.({ xp, correct, total: items.length });
      return;
    }
    setIndex((i) => i + 1);
    setGiven("");
    setTokens([]);
    setResult(null);
  }

  if (done) {
    const xp = results.reduce((sum, r) => sum + r.xp, 0);
    const correct = results.filter((r) => r.score >= 1).length;
    const pct = Math.round((correct / items.length) * 100);
    return (
      <div className="shadow-soft rounded-3xl border border-border bg-card p-6 text-center">
        <p className="text-5xl">{pct >= 80 ? "🎉" : pct >= 50 ? "💪" : "📘"}</p>
        <h2 className="font-display mt-3 text-2xl font-semibold">
          {correct} de {items.length} corretos ({pct}%)
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          +{xp + (kind === "revisao" ? 25 : 0)} XP conquistados nesta sessão.
        </p>
        <Button
          className="mt-5"
          onClick={() => {
            setIndex(0);
            setResults([]);
            setResult(null);
            setGiven("");
            setTokens([]);
            setDone(false);
          }}
        >
          <RotateCcw className="h-4 w-4" /> Refazer sessão
        </Button>
      </div>
    );
  }

  const correctText = correctAnswerOf(item);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="rounded-full bg-secondary px-2.5 py-1 font-medium text-secondary-foreground">
          {TYPE_LABEL[item.type]}
        </span>
        <span>
          {index + 1} / {items.length} · {item.xp} XP
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="bg-sun h-full transition-all" style={{ width: `${(index / items.length) * 100}%` }} />
      </div>

      <div className="shadow-soft rounded-3xl border border-border bg-card p-5 sm:p-6">
        <p className="text-sm text-muted-foreground">{item.promptPt}</p>

        {item.type === "listen" ? (
          <div className="mt-4 flex flex-col items-center gap-3 rounded-2xl bg-muted/60 p-5">
            <Button type="button" variant="secondary" onClick={() => speakSpanish(item.audioText ?? "", state.profile.variant)}>
              <Volume2 className="h-4 w-4" /> Ouvir novamente
            </Button>
            <p className="text-sm text-muted-foreground">{item.question}</p>
            {result && <p className="font-display text-lg">«{item.audioText}»</p>}
          </div>
        ) : (
          <div className="mt-2 flex items-start justify-between gap-3">
            <p className="font-display text-xl leading-snug sm:text-2xl">{item.question}</p>
            {item.type !== "translate" && item.type !== "write" && (
              <button
                type="button"
                onClick={() => speakSpanish(item.question, state.profile.variant)}
                className="mt-1 rounded-full p-2 text-muted-foreground hover:bg-muted"
                aria-label="Ouvir em espanhol"
              >
                <Volume2 className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Opções */}
        {item.options && (
          <div className="mt-4 grid gap-2">
            {item.options.map((opt) => {
              const isCorrect = opt === correctText;
              const isPicked = result?.given === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  disabled={Boolean(result)}
                  onClick={() => submit(opt)}
                  className={`rounded-2xl border p-3 text-left text-[15px] transition-colors ${
                    result
                      ? isCorrect
                        ? "border-emerald-500 bg-emerald-500/10"
                        : isPicked
                          ? "border-destructive bg-destructive/10"
                          : "border-border opacity-60"
                      : "border-border hover:border-primary hover:bg-secondary"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {/* Arrastar / organizar */}
        {(item.type === "drag" || item.type === "order") && (
          <div className="mt-4 space-y-3">
            <div className="min-h-14 rounded-2xl border border-dashed border-border bg-muted/50 p-3">
              {chosen.length === 0 ? (
                <span className="text-sm text-muted-foreground">Toque nas palavras abaixo para montar a frase.</span>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {chosen.map((t, i) => (
                    <button
                      key={`${t}-${i}`}
                      type="button"
                      disabled={Boolean(result)}
                      onClick={() => setTokens((prev) => prev.filter((_, idx) => idx !== i))}
                      className="rounded-xl bg-card px-3 py-1.5 text-sm shadow-soft"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {pool.map((t, i) => {
                const used = chosen.filter((c) => c === t).length;
                const available = pool.filter((p) => p === t).length;
                if (used >= available) return null;
                return (
                  <button
                    key={`${t}-pool-${i}`}
                    type="button"
                    disabled={Boolean(result)}
                    onClick={() => setTokens((prev) => [...prev, t])}
                    className="rounded-xl border border-border px-3 py-1.5 text-sm hover:border-primary hover:bg-secondary"
                  >
                    {t}
                  </button>
                );
              })}
            </div>
            {!result && (
              <Button onClick={() => submit(answerFromTokens)} disabled={chosen.length === 0}>
                Conferir
              </Button>
            )}
          </div>
        )}

        {/* Texto */}
        {(item.type === "fill" || item.type === "translate" || item.type === "write") && !result && (
          <div className="mt-4 space-y-3">
            {item.type === "write" ? (
              <Textarea
                value={given}
                onChange={(e) => setGiven(e.target.value)}
                placeholder="Escreva em espanhol…"
                rows={3}
              />
            ) : (
              <Input
                value={given}
                onChange={(e) => setGiven(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit(given)}
                placeholder={item.type === "fill" ? "Palavra que falta" : "Sua tradução em espanhol"}
              />
            )}
            <Button onClick={() => submit(given)} disabled={!given.trim()}>
              Conferir
            </Button>
          </div>
        )}

        {/* Conversação com IA */}
        {item.type === "ai" && item.aiScenario && (
          <div className="mt-4 space-y-3">
            <AiChat
              scenario={item.aiScenario.title}
              scenarioPrompt={item.aiScenario.prompt}
              opener={item.aiScenario.opener}
            />
            {!result && (
              <Button onClick={() => submit("Conversa concluída")}>Concluir conversação</Button>
            )}
          </div>
        )}

        {/* Feedback imediato */}
        {result && (
          <div
            className={`mt-5 rounded-2xl border p-4 ${
              result.score >= 1 ? "border-emerald-500/50 bg-emerald-500/10" : "border-destructive/50 bg-destructive/10"
            }`}
          >
            <p className="flex items-center gap-2 font-semibold">
              {result.score >= 1 ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
              {result.score >= 1 ? "Correto!" : result.score > 0 ? "Quase lá" : "Não foi dessa vez"}
            </p>
            <dl className="mt-3 space-y-1.5 text-sm">
              <div className="flex gap-2">
                <dt className="w-36 shrink-0 text-muted-foreground">Resposta correta</dt>
                <dd className="font-medium">{correctText}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-36 shrink-0 text-muted-foreground">Sua resposta</dt>
                <dd>{result.given || "(sem resposta)"}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-36 shrink-0 text-muted-foreground">Explicação</dt>
                <dd>{item.explanationPt}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-36 shrink-0 text-muted-foreground">Pontuação</dt>
                <dd className="font-semibold">
                  +{result.xp} XP de {item.xp}
                </dd>
              </div>
            </dl>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" onClick={() => speakSpanish(correctText, state.profile.variant)}>
                <Volume2 className="h-4 w-4" /> Ouvir
              </Button>
              <Button onClick={next}>
                {index + 1 >= items.length ? "Ver resultado" : "Próximo"} <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
