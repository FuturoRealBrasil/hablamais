import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessagesSquare } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AiChat } from "@/components/ai-chat";
import { SCENARIOS } from "@/lib/scenarios";
import { useProgress } from "@/lib/progress-store";

export const Route = createFileRoute("/conversar")({
  head: () => ({
    meta: [
      { title: "Converse com seu Professor de IA | Habla+ Espanhol" },
      {
        name: "description",
        content:
          "Pratique espanhol em situações reais — restaurante, aeroporto, entrevista e mais — com um professor de IA que corrige e explica em português.",
      },
      { property: "og:title", content: "Converse com seu Professor de IA | Habla+" },
      {
        property: "og:description",
        content: "Roleplays em espanhol com correções, explicações em português e avaliação de fluência.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConversarPage,
});

function ConversarPage() {
  const { state } = useProgress();
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0]!.id);
  const scenario = SCENARIOS.find((s) => s.id === scenarioId)!;

  return (
    <AppShell>
      <header className="mb-5">
        <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold text-secondary-foreground">
          <MessagesSquare className="h-3.5 w-3.5" /> Nível {state.profile.level}
        </span>
        <h1 className="mt-2 text-2xl font-semibold">Converse com seu Professor de IA</h1>
        <p className="text-sm text-muted-foreground">
          Escolha uma situação. Toque no microfone e fale em espanhol: o professor entende sua voz, responde em áudio,
          corrige seus erros e explica tudo em português.
        </p>
      </header>

      <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => setScenarioId(s.id)}
            className={`rounded-2xl border px-3 py-3 text-left transition-colors ${
              s.id === scenarioId ? "border-primary bg-secondary" : "border-border hover:bg-secondary/60"
            }`}
          >
            <span className="text-lg">{s.emoji}</span>
            <span className="mt-1 block text-sm font-medium leading-tight">{s.label}</span>
            <span className="block text-[11px] text-muted-foreground">{s.description}</span>
          </button>
        ))}
      </div>

      <AiChat
        key={scenario.id}
        scenario={scenario.label}
        scenarioPrompt={scenario.prompt}
        opener={scenario.opener}
      />
    </AppShell>
  );
}
