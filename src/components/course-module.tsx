import { useState } from "react";
import { Volume2 } from "lucide-react";
import { AiChat } from "@/components/ai-chat";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/lib/progress-store";
import { speakSpanish } from "@/lib/speech";
import type { CourseSituation } from "@/lib/courses";

function PhraseRow({ es, pt, tip, variant }: { es: string; pt: string; tip?: string; variant: "latino" | "espanha" }) {
  return (
    <li className="flex items-start justify-between gap-3 rounded-xl bg-secondary/50 px-3 py-2">
      <span>
        <span className="block text-sm font-medium">{es}</span>
        <span className="block text-xs text-muted-foreground">{pt}</span>
        {tip && <span className="mt-0.5 block text-[11px] text-primary">{tip}</span>}
      </span>
      <button
        type="button"
        aria-label={`Ouvir: ${es}`}
        className="mt-0.5 shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-primary"
        onClick={() => speakSpanish(es, variant)}
      >
        <Volume2 className="h-4 w-4" />
      </button>
    </li>
  );
}

export function CourseModule({
  situations,
  eyebrow,
  title,
  description,
}: {
  situations: CourseSituation[];
  eyebrow: string;
  title: string;
  description: string;
}) {
  const { state, addXp } = useProgress();
  const [activeId, setActiveId] = useState(situations[0]!.id);
  const [simulating, setSimulating] = useState(false);
  const active = situations.find((s) => s.id === activeId)!;
  const variant = state.profile.variant;

  return (
    <>
      <header className="mb-5">
        <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold text-secondary-foreground">
          {eyebrow}
        </span>
        <h1 className="font-display mt-2 text-3xl font-semibold">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </header>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {situations.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              setActiveId(s.id);
              setSimulating(false);
            }}
            className={`rounded-2xl border px-3 py-3 text-left transition-colors ${
              s.id === activeId ? "border-primary bg-secondary" : "border-border hover:bg-secondary/60"
            }`}
          >
            <span className="text-lg">{s.emoji}</span>
            <span className="mt-1 block text-sm font-medium leading-tight">{s.label}</span>
          </button>
        ))}
      </div>

      <section className="shadow-soft mt-5 rounded-3xl border border-border bg-card p-6">
        <h2 className="font-display text-xl font-semibold">
          {active.emoji} {active.label}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{active.summary}</p>

        <h3 className="mt-5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Frases essenciais</h3>
        <ul className="mt-2 space-y-2">
          {active.phrases.map((p) => (
            <PhraseRow key={p.es} es={p.es} pt={p.pt} tip={p.tip} variant={variant} />
          ))}
        </ul>

        <h3 className="mt-5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Vocabulário-chave</h3>
        <ul className="mt-2 grid gap-2 sm:grid-cols-2">
          {active.vocab.map((p) => (
            <PhraseRow key={p.es} es={p.es} pt={p.pt} variant={variant} />
          ))}
        </ul>
      </section>

      <section className="shadow-soft mt-5 rounded-3xl border border-border bg-card p-6">
        <h3 className="font-display text-lg font-semibold">Simulação interativa</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Missão:</span> {active.mission ?? active.simulation.mission}
        </p>
        {!simulating ? (
          <Button
            className="mt-4"
            onClick={() => {
              setSimulating(true);
              addXp(10, { minutes: 2, kind: "conversa" });
            }}
          >
            Iniciar simulação em espanhol
          </Button>
        ) : (
          <AiChat
            key={active.id}
            className="mt-4"
            scenario={`${title} — ${active.label}`}
            scenarioPrompt={active.simulation.prompt}
            opener={active.simulation.opener}
          />
        )}
      </section>
    </>
  );
}
