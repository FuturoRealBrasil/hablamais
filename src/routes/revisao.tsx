import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AlertTriangle, BrainCircuit, Mic, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ExercisePlayer } from "@/components/exercise-player";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/lib/progress-store";
import { buildReview } from "@/lib/review";

const AREA_LABEL: Record<string, string> = {
  vocabulario: "Palavras esquecidas",
  gramatica: "Gramática fraca",
  pronuncia: "Pronúncia",
  erros: "Erros frequentes",
  conteudo: "Conteúdo não dominado",
};

const SEVERITY_CLASS: Record<string, string> = {
  alta: "border-destructive/50 bg-destructive/10",
  media: "border-amber-500/50 bg-amber-500/10",
  baixa: "border-border bg-muted/50",
};

export const Route = createFileRoute("/revisao")({
  head: () => ({
    meta: [
      { title: "Revisão Inteligente | Habla+ Espanhol" },
      {
        name: "description",
        content:
          "A IA analisa seus erros, palavras esquecidas, gramática fraca e pronúncia para montar uma sessão de revisão personalizada de espanhol.",
      },
      { property: "og:title", content: "Revisão Inteligente | Habla+ Espanhol" },
      { property: "og:description", content: "Sessão de revisão personalizada com base nos seus pontos fracos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReviewPage,
});

function ReviewPage() {
  const { state } = useProgress();
  const [started, setStarted] = useState(false);
  const review = useMemo(() => buildReview(state), [started]);

  return (
    <AppShell>
      <header className="bg-sun shadow-lift rounded-3xl p-6 text-primary-foreground">
        <p className="flex items-center gap-2 text-sm opacity-90">
          <BrainCircuit className="h-4 w-4" /> Revisão Inteligente
        </p>
        <h1 className="font-display mt-1 text-3xl font-semibold">Seu plano de recuperação de hoje</h1>
        <p className="mt-2 max-w-lg text-sm opacity-90">
          Analisamos suas palavras esquecidas, erros repetidos, gramática com baixo desempenho e sons difíceis para
          montar uma sessão sob medida.
        </p>
      </header>

      {started ? (
        <div className="mt-6 space-y-4">
          <Button variant="ghost" onClick={() => setStarted(false)}>
            ← Voltar ao diagnóstico
          </Button>
          <ExercisePlayer items={review.items} kind="revisao" />
        </div>
      ) : (
        <>
          <section className="mt-6 space-y-3">
            <h2 className="font-display text-xl font-semibold">Diagnóstico</h2>
            {review.diagnostics.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Ainda não há pontos fracos registrados. Faça algumas aulas e exercícios — a revisão fica mais precisa a
                cada resposta sua.
              </p>
            )}
            {review.diagnostics.map((d) => (
              <div key={d.id} className={`rounded-2xl border p-4 ${SEVERITY_CLASS[d.severity]}`}>
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <AlertTriangle className="h-4 w-4" /> {AREA_LABEL[d.area]} · prioridade {d.severity}
                </p>
                <p className="mt-1 font-medium">{d.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{d.detail}</p>
              </div>
            ))}
          </section>

          <section className="shadow-soft mt-6 rounded-3xl border border-border bg-card p-5">
            <h2 className="font-display text-lg font-semibold">Sessão personalizada</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {review.items.length} exercícios selecionados a partir do seu histórico. Ao concluir você ganha +25 XP de
              bônus de revisão.
            </p>
            <Button className="mt-4" onClick={() => setStarted(true)} disabled={!review.items.length}>
              <Sparkles className="h-4 w-4" /> Iniciar revisão
            </Button>
          </section>

          {review.drills.length > 0 && (
            <section className="mt-6">
              <h2 className="font-display text-lg font-semibold">Treino de pronúncia recomendado</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {review.drills.map((d) => (
                  <Link
                    key={d.id}
                    to="/pronuncia"
                    className="shadow-soft rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary"
                  >
                    <p className="flex items-center gap-2 font-medium">
                      <Mic className="h-4 w-4 text-primary" /> Som {d.symbol}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{d.tipPt}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {review.weakLessons.length > 0 && (
            <section className="mt-6">
              <h2 className="font-display text-lg font-semibold">Aulas para refazer</h2>
              <div className="mt-3 space-y-2">
                {review.weakLessons.map((h) => (
                  <Link
                    key={h.lessonId}
                    to="/aula/$lessonId"
                    params={{ lessonId: h.lessonId }}
                    className="shadow-soft flex items-center justify-between rounded-2xl border border-border bg-card p-4 hover:border-primary"
                  >
                    <span className="font-medium">{h.title}</span>
                    <span className="text-sm text-muted-foreground">{h.accuracy}% de acerto</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </AppShell>
  );
}
