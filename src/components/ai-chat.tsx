import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Send, Sparkles, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { teacherReply, type TeacherTurn } from "@/lib/ai.functions";
import { useProgress } from "@/lib/progress-store";
import { speakSpanish } from "@/lib/speech";

type Turn = {
  role: "user" | "assistant";
  content: string;
  pt?: string;
  correction?: TeacherTurn["correction"];
  tipPt?: string;
  scores?: TeacherTurn["scores"];
};

export function AiChat({
  scenario,
  scenarioPrompt,
  opener,
  className = "",
}: {
  scenario: string;
  scenarioPrompt: string;
  opener: string;
  className?: string;
}) {
  const { state } = useProgress();
  const call = useServerFn(teacherReply);
  const [turns, setTurns] = useState<Turn[]>([{ role: "assistant", content: opener }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTurns([{ role: "assistant", content: opener }]);
  }, [opener]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [turns, loading]);

  const scored = turns.filter((t) => t.scores && (t.scores.gramatica || t.scores.vocabulario || t.scores.fluencia));
  const avg = (k: keyof TeacherTurn["scores"]) =>
    scored.length ? Math.round(scored.reduce((sum, t) => sum + (t.scores?.[k] ?? 0), 0) / scored.length) : 0;

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next: Turn[] = [...turns, { role: "user", content: text }];
    setTurns(next);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const res = await call({
        data: {
          level: state.profile.level,
          variant: state.profile.variant,
          scenario,
          scenarioPrompt,
          studentName: state.profile.name,
          messages: next.map((t) => ({ role: t.role, content: t.content })),
        },
      });
      setTurns((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.reply,
          pt: res.replyPt,
          correction: res.correction,
          tipPt: res.tipPt,
          scores: res.scores,
        },
      ]);
      speakSpanish(res.reply, state.profile.variant);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      setError(
        msg.includes("RATE_LIMIT")
          ? "Muitas mensagens em pouco tempo. Espere alguns segundos e tente de novo."
          : msg.includes("NO_CREDITS")
            ? "Os créditos de IA acabaram. Adicione créditos para continuar conversando."
            : "Não consegui falar com o professor agora. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`shadow-soft flex flex-col rounded-3xl border border-border bg-card ${className}`}>
      <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5" style={{ maxHeight: 460 }}>
        {turns.map((t, i) => (
          <div key={i} className={t.role === "user" ? "flex justify-end" : "space-y-2"}>
            {t.role === "user" ? (
              <p className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2 text-sm text-primary-foreground">
                {t.content}
              </p>
            ) : (
              <>
                <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-secondary px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium">{t.content}</p>
                    <button
                      onClick={() => speakSpanish(t.content, state.profile.variant)}
                      aria-label="Ouvir pronúncia"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                  </div>
                  {t.pt && <p className="mt-1 text-xs text-muted-foreground">{t.pt}</p>}
                </div>

                {t.correction && (
                  <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-xs">
                    <p className="text-sm font-semibold">Correção do professor</p>
                    <p className="mt-1">
                      <span className="text-muted-foreground">Você escreveu:</span>{" "}
                      <s>{t.correction.wrong}</s>
                    </p>
                    <p className="mt-1 flex items-center gap-2">
                      <span className="text-muted-foreground">Correto:</span>
                      <strong>{t.correction.correct}</strong>
                      <button
                        onClick={() => speakSpanish(t.correction!.correct, state.profile.variant)}
                        aria-label="Ouvir frase correta"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                      </button>
                    </p>
                    <p className="mt-1">
                      <span className="text-muted-foreground">Por quê:</span> {t.correction.whyPt}
                    </p>
                    <p className="mt-1">
                      <span className="text-muted-foreground">Melhor resposta:</span> {t.correction.betterPt}
                    </p>
                  </div>
                )}

                {t.tipPt && (
                  <p className="flex items-start gap-2 rounded-2xl bg-secondary/50 p-3 text-xs text-muted-foreground">
                    <Sparkles className="mt-0.5 h-3.5 w-3.5 text-primary" /> {t.tipPt}
                  </p>
                )}
              </>
            )}
          </div>
        ))}
        {loading && (
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> O professor está pensando…
          </p>
        )}
        <div ref={endRef} />
      </div>

      {scored.length > 0 && (
        <div className="grid grid-cols-3 gap-2 border-t border-border px-4 py-3 text-center text-xs">
          <Score label="Vocabulário" value={avg("vocabulario")} />
          <Score label="Gramática" value={avg("gramatica")} />
          <Score label="Fluência" value={avg("fluencia")} />
        </div>
      )}

      {error && <p className="px-4 pb-2 text-xs text-destructive">{error}</p>}

      <form
        className="flex items-center gap-2 border-t border-border p-3"
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
      >
        <Input
          value={input}
          maxLength={400}
          placeholder="Escreva em espanhol…"
          onChange={(e) => setInput(e.target.value)}
        />
        <Button type="submit" size="icon" disabled={loading || !input.trim()} aria-label="Enviar">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-secondary/60 py-2">
      <p className="font-display text-base font-semibold">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
