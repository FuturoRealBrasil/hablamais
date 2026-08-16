import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Search, Volume2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { dictionaryLookup, type DictEntry } from "@/lib/ai.functions";
import { speakSpanish } from "@/lib/speech";
import { useProgress } from "@/lib/progress-store";

export const Route = createFileRoute("/dicionario")({
  head: () => ({
    meta: [
      { title: "Dicionário Espanhol-Português com Áudio | Habla+" },
      {
        name: "description",
        content:
          "Pesquise qualquer palavra em espanhol ou português: tradução, pronúncia, classe gramatical, exemplos, sinônimos, antônimos e frases com áudio.",
      },
      { property: "og:title", content: "Dicionário Espanhol-Português com Áudio | Habla+" },
      { property: "og:description", content: "Tradução, pronúncia, sinônimos, antônimos e frases de uso real em espanhol." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DicionarioPage,
});

const SUGGESTIONS = ["pedir", "la cuenta", "saudade", "ahorita", "embarazada", "el pasillo"];

function DicionarioPage() {
  const { state } = useProgress();
  const variant = state.profile.variant;
  const [term, setTerm] = useState("");
  const [entry, setEntry] = useState<DictEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function search(value: string) {
    const q = value.trim();
    if (!q) return;
    setTerm(q);
    setLoading(true);
    setError("");
    try {
      const data = await dictionaryLookup({ data: { term: q, variant } });
      setEntry(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      setError(
        msg === "RATE_LIMIT"
          ? "Muitas buscas seguidas. Espere alguns segundos."
          : msg === "NO_CREDITS"
            ? "Os créditos de IA acabaram."
            : "Não consegui buscar agora. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <header className="mb-5">
        <h1 className="font-display text-3xl font-semibold">Dicionário</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pesquise em espanhol ou português e veja tradução, pronúncia, exemplos e frases com áudio.
        </p>
      </header>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void search(term);
        }}
      >
        <Input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Ex.: pedir, la cuenta, saudade..."
          aria-label="Palavra para pesquisar"
        />
        <Button type="submit" disabled={loading} className="gap-1">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Buscar
        </Button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => void search(s)}
            className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {s}
          </button>
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      {entry && !entry.notFound && (
        <article className="shadow-soft mt-6 space-y-5 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-semibold">
                {entry.gender ? `${entry.gender} ` : ""}
                {entry.word}
              </h2>
              <p className="text-sm text-muted-foreground">
                {entry.phonetic && <span>[{entry.phonetic}]</span>} {entry.wordClass && <span>· {entry.wordClass}</span>}
              </p>
              <p className="mt-1 text-base font-medium text-primary">{entry.translation}</p>
            </div>
            <Button size="icon" variant="secondary" aria-label="Ouvir pronúncia" onClick={() => speakSpanish(entry.word, variant)}>
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>

          {entry.falseFriendPt && (
            <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">⚠️ {entry.falseFriendPt}</p>
          )}

          {entry.meanings.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Significados</h3>
              <ul className="mt-2 space-y-1 text-sm">
                {entry.meanings.map((m, i) => (
                  <li key={i}>
                    {i + 1}. {m.pt} {m.note && <span className="text-muted-foreground">— {m.note}</span>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {entry.examples.length > 0 && (
            <Section title="Exemplos" items={entry.examples} variant={variant} />
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <WordList title="Sinônimos" words={entry.synonyms} variant={variant} />
            <WordList title="Antônimos" words={entry.antonyms} variant={variant} />
          </div>

          {entry.phrases.length > 0 && <Section title="Frases úteis" items={entry.phrases} variant={variant} />}
        </article>
      )}

      {entry?.notFound && (
        <p className="mt-6 rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
          Não encontrei essa palavra. Confira a grafia e tente novamente.
        </p>
      )}
    </AppShell>
  );
}

function Section({
  title,
  items,
  variant,
}: {
  title: string;
  items: { es: string; pt: string }[];
  variant: "latino" | "espanha";
}) {
  return (
    <section>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3>
      <ul className="mt-2 space-y-2">
        {items.map((it, i) => (
          <li key={i} className="flex items-start justify-between gap-3 rounded-xl bg-secondary/50 px-3 py-2">
            <span>
              <span className="block text-sm font-medium">{it.es}</span>
              <span className="block text-xs text-muted-foreground">{it.pt}</span>
            </span>
            <button
              type="button"
              aria-label={`Ouvir: ${it.es}`}
              className="mt-0.5 shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-primary"
              onClick={() => speakSpanish(it.es, variant)}
            >
              <Volume2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function WordList({ title, words, variant }: { title: string; words: string[]; variant: "latino" | "espanha" }) {
  return (
    <section>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3>
      {words.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">—</p>
      ) : (
        <div className="mt-2 flex flex-wrap gap-2">
          {words.map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => speakSpanish(w, variant)}
              className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
            >
              {w}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
