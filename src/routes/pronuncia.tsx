import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { Loader2, Mic, Square, Volume2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PHONEME_DRILLS, feedbackFor, scorePronunciation, type PronunciationResult } from "@/lib/pronunciation";
import { startRecording, transcribeBlob, type Recorder } from "@/lib/audio-record";
import { speakSpanish } from "@/lib/speech";
import { useProgress } from "@/lib/progress-store";

export const Route = createFileRoute("/pronuncia")({
  head: () => ({
    meta: [
      { title: "Treino de Pronúncia em Espanhol | Habla+" },
      {
        name: "description",
        content:
          "Fale, grave e receba nota de pronúncia em espanhol. Exercícios específicos para R, RR, J, LL, Ñ, B/V, D e G.",
      },
      { property: "og:title", content: "Treino de Pronúncia em Espanhol | Habla+" },
      { property: "og:description", content: "Grave sua voz, compare com a frase esperada e descubra quais palavras treinar de novo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PronunciaPage,
});

function PronunciaPage() {
  const { state, setState } = useProgress();
  const [drillId, setDrillId] = useState(PHONEME_DRILLS[0]!.id);
  const drill = PHONEME_DRILLS.find((d) => d.id === drillId)!;
  const items = useMemo(() => [...drill.words, ...drill.phrases], [drill]);
  const [index, setIndex] = useState(0);
  const target = items[index] ?? items[0]!;

  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PronunciationResult | null>(null);
  const recorderRef = useRef<Recorder | null>(null);

  const variant = state.profile.variant;
  const drillStat = state.pronunciation[drill.id];

  function pick(id: string) {
    setDrillId(id);
    setIndex(0);
    setResult(null);
    setError(null);
  }

  async function toggleRecord() {
    setError(null);
    if (recording) {
      setRecording(false);
      setBusy(true);
      try {
        const blob = await recorderRef.current!.stop();
        recorderRef.current = null;
        const heard = await transcribeBlob(blob);
        const scored = scorePronunciation(target, heard);
        setResult(scored);
        setState((s) => {
          const prev = s.pronunciation[drill.id];
          const weak = new Set(s.weakSounds);
          if (scored.score >= 80) weak.delete(drill.id);
          else weak.add(drill.id);
          return {
            ...s,
            xp: s.xp + (scored.score >= 80 ? 8 : 3),
            pronunciation: {
              ...s.pronunciation,
              [drill.id]: { best: Math.max(prev?.best ?? 0, scored.score), attempts: (prev?.attempts ?? 0) + 1 },
            },
            weakSounds: Array.from(weak),
          };
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Não consegui analisar o áudio. Tente novamente.");
      } finally {
        setBusy(false);
      }
      return;
    }

    try {
      recorderRef.current = await startRecording();
      setResult(null);
      setRecording(true);
    } catch {
      setError("Preciso da permissão do microfone para avaliar sua pronúncia.");
    }
  }

  const feedback = result ? feedbackFor(result.score) : null;

  return (
    <AppShell>
      <header className="mb-5">
        <h1 className="font-display text-3xl font-semibold">Treino de pronúncia</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Escute o modelo, grave sua voz e receba uma nota com as palavras que precisam de mais treino.
        </p>
      </header>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {PHONEME_DRILLS.map((d) => {
          const stat = state.pronunciation[d.id];
          const active = d.id === drillId;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => pick(d.id)}
              className={`shrink-0 rounded-2xl border px-4 py-2.5 text-left transition-colors ${
                active ? "border-primary bg-secondary" : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <span className="font-display block text-lg font-semibold">{d.symbol}</span>
              <span className="text-[11px] text-muted-foreground">{stat ? `melhor ${stat.best}%` : "não treinado"}</span>
            </button>
          );
        })}
      </div>

      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
        <h2 className="font-display text-xl font-semibold">{drill.title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{drill.tipPt}</p>
        <p className="mt-2 rounded-xl bg-secondary/60 p-3 text-sm">
          <strong>Português x Espanhol:</strong> {drill.contrastPt}
        </p>

        <div className="mt-5 rounded-2xl border border-border bg-background p-5 text-center">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Item {index + 1} de {items.length}
          </p>
          <p className="font-display mt-2 text-2xl font-semibold">{target}</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <Button variant="secondary" onClick={() => speakSpanish(target, variant)}>
              <Volume2 className="mr-2 h-4 w-4" /> Ouvir modelo
            </Button>
            <Button onClick={toggleRecord} disabled={busy} variant={recording ? "destructive" : "default"}>
              {busy ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : recording ? (
                <Square className="mr-2 h-4 w-4" />
              ) : (
                <Mic className="mr-2 h-4 w-4" />
              )}
              {busy ? "Analisando..." : recording ? "Parar e avaliar" : "Gravar minha voz"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setIndex((i) => (i + 1) % items.length);
                setResult(null);
              }}
            >
              Próximo
            </Button>
          </div>
          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
        </div>

        {result && feedback && (
          <div className="mt-5 rounded-2xl border border-border bg-background p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="font-display text-3xl font-semibold">{result.score}%</span>
              <span className={`text-sm font-semibold ${feedback.tone}`}>{feedback.label}</span>
            </div>
            <Progress value={result.score} className="mt-3" />
            <p className="mt-3 text-sm text-muted-foreground">
              <strong>Ouvi:</strong> “{result.heard || "—"}”
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {result.words.map((w, i) => (
                <span
                  key={`${w.word}-${i}`}
                  className={`rounded-full px-2.5 py-1 text-sm ${
                    w.ok ? "bg-emerald-500/15 text-emerald-700" : "bg-destructive/15 text-destructive"
                  }`}
                >
                  {w.word}
                </span>
              ))}
            </div>
            {result.weakWords.length > 0 && (
              <div className="mt-3 rounded-xl bg-secondary/60 p-3 text-sm">
                <strong>Treine novamente:</strong> {result.weakWords.join(", ")}
                <div className="mt-2 flex flex-wrap gap-2">
                  {result.weakWords.map((w) => (
                    <Button key={w} size="sm" variant="outline" onClick={() => speakSpanish(w, variant)}>
                      <Volume2 className="mr-1.5 h-3.5 w-3.5" /> {w}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            <p className="mt-3 text-sm text-muted-foreground">{feedback.tipPt}</p>
          </div>
        )}

        {drillStat && (
          <p className="mt-4 text-xs text-muted-foreground">
            Você já treinou este som {drillStat.attempts}x — melhor nota {drillStat.best}%.
          </p>
        )}
      </section>

      {state.weakSounds.length > 0 && (
        <section className="mt-5 rounded-3xl border border-border bg-card p-5">
          <h2 className="font-display text-lg font-semibold">Sons para revisar</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {state.weakSounds.map((id) => {
              const d = PHONEME_DRILLS.find((x) => x.id === id);
              if (!d) return null;
              return (
                <Button key={id} size="sm" variant="outline" onClick={() => pick(id)}>
                  {d.symbol}
                </Button>
              );
            })}
          </div>
        </section>
      )}
    </AppShell>
  );
}
