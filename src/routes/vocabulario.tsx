import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { RotateCcw, Volume2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/stat-card";
import { VOCAB, VOCAB_CATEGORIES, dueWords, reviewCard, srsStats } from "@/lib/vocabulary";
import { speakSpanish } from "@/lib/speech";
import { useProgress } from "@/lib/progress-store";

export const Route = createFileRoute("/vocabulario")({
  head: () => ({
    meta: [
      { title: "Vocabulário e Flashcards de Espanhol | Habla+" },
      {
        name: "description",
        content:
          "Flashcards de espanhol com áudio, pronúncia, exemplo e frase contextual, usando repetição espaçada para fixar as palavras difíceis.",
      },
      { property: "og:title", content: "Vocabulário e Flashcards de Espanhol | Habla+" },
      { property: "og:description", content: "Aprenda palavras em espanhol com repetição espaçada, áudio e contexto real." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VocabularioPage,
});

function VocabularioPage() {
  const { state, setState } = useProgress();
  const [category, setCategory] = useState<string>("todas");
  const [flipped, setFlipped] = useState(false);

  const pool = useMemo(
    () => (category === "todas" ? VOCAB : VOCAB.filter((w) => w.category === category)),
    [category],
  );
  const queue = useMemo(() => dueWords(state.srs, pool), [state.srs, pool]);
  const card = queue[0];
  const stats = srsStats(state.srs);
  const variant = state.profile.variant;

  function answer(quality: "esqueci" | "dificil" | "facil") {
    if (!card) return;
    setFlipped(false);
    setState((s) => ({
      ...s,
      xp: s.xp + (quality === "facil" ? 6 : quality === "dificil" ? 4 : 2),
      srs: { ...s.srs, [card.id]: reviewCard(s.srs[card.id], quality) },
      learnedWords:
        quality === "esqueci" ? s.learnedWords : Array.from(new Set([...s.learnedWords, card.es])),
    }));
  }

  return (
    <AppShell>
      <header className="mb-5">
        <h1 className="font-display text-3xl font-semibold">Vocabulário inteligente</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Flashcards com repetição espaçada: as palavras que você erra voltam mais cedo.
        </p>
      </header>

      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={RotateCcw} label="Para revisar hoje" value={String(queue.length)} />
        <StatCard icon={RotateCcw} label="Dominadas" value={String(stats.mastered)} />
        <StatCard icon={RotateCcw} label="Difíceis" value={String(stats.difficult)} />
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {["todas", ...VOCAB_CATEGORIES].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => {
              setCategory(c);
              setFlipped(false);
            }}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm capitalize transition-colors ${
              c === category ? "border-primary bg-secondary" : "border-border bg-card text-muted-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <section className="mt-5">
        {card ? (
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {card.category} · {card.level}
              </span>
              <span>{queue.length} na fila</span>
            </div>

            <button
              type="button"
              onClick={() => setFlipped((f) => !f)}
              className="mt-4 block w-full rounded-2xl border border-border bg-background p-6 text-center transition-colors hover:border-primary/40"
            >
              <span className="block text-5xl" aria-hidden>
                {card.emoji}
              </span>
              <span className="font-display mt-3 block text-2xl font-semibold">{card.es}</span>
              <span className="mt-1 block text-sm text-muted-foreground">[{card.phonetic}]</span>
              {flipped ? (
                <span className="mt-4 block space-y-2 text-left">
                  <span className="block text-lg font-medium">{card.pt}</span>
                  <span className="block text-sm">
                    <strong>Exemplo:</strong> {card.example}
                  </span>
                  <span className="block text-sm text-muted-foreground">{card.examplePt}</span>
                  <span className="block rounded-xl bg-secondary/60 p-3 text-sm">{card.context}</span>
                </span>
              ) : (
                <span className="mt-4 block text-sm text-muted-foreground">Toque para ver a tradução</span>
              )}
            </button>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button variant="secondary" onClick={() => speakSpanish(card.es, variant)}>
                <Volume2 className="mr-2 h-4 w-4" /> Palavra
              </Button>
              <Button variant="ghost" onClick={() => speakSpanish(card.example, variant)}>
                <Volume2 className="mr-2 h-4 w-4" /> Frase
              </Button>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <Button variant="destructive" onClick={() => answer("esqueci")}>
                Esqueci
              </Button>
              <Button variant="outline" onClick={() => answer("dificil")}>
                Difícil
              </Button>
              <Button onClick={() => answer("facil")}>Fácil</Button>
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              “Esqueci” traz a palavra de volta hoje; “Fácil” adia por vários dias.
            </p>
          </div>
        ) : (
          <div className="rounded-3xl border border-border bg-card p-8 text-center">
            <p className="font-display text-xl font-semibold">¡Muy bien! Nada para revisar agora.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Volte amanhã — a repetição espaçada já agendou as próximas palavras.
            </p>
          </div>
        )}
      </section>

      <section className="mt-6">
        <h2 className="font-display mb-3 text-lg font-semibold">Minhas palavras</h2>
        <Progress value={VOCAB.length ? (stats.studied / VOCAB.length) * 100 : 0} />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {pool.map((w) => {
            const srs = state.srs[w.id];
            return (
              <article key={w.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg font-semibold">
                      <span className="mr-2" aria-hidden>
                        {w.emoji}
                      </span>
                      {w.es}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {w.pt} · [{w.phonetic}]
                    </p>
                  </div>
                  <Button size="icon" variant="ghost" aria-label={`Ouvir ${w.es}`} onClick={() => speakSpanish(w.es, variant)}>
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-2 text-sm">{w.example}</p>
                <p className="text-xs text-muted-foreground">{w.examplePt}</p>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  {srs ? `Próxima revisão: ${srs.due} · erros: ${srs.lapses}` : "Ainda não estudada"}
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}
