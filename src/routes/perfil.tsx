import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Flame, GraduationCap, Languages, Target, Trophy } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { LEVELS } from "@/lib/course-data";
import { useProgress, usePlan } from "@/lib/progress-store";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Meu perfil e progresso | Habla+ Espanhol" },
      {
        name: "description",
        content: "Veja seu nível, XP, sequência de dias, vocabulário aprendido e seu plano de estudos personalizado.",
      },
      { property: "og:title", content: "Meu perfil e progresso | Habla+" },
      { property: "og:description", content: "Acompanhe nível, XP, streak e vocabulário aprendido em espanhol." },
    ],
  }),
  component: PerfilPage,
});

function PerfilPage() {
  const { state, reset } = useProgress();
  const { percent } = usePlan();
  const navigate = useNavigate();
  const levelInfo = LEVELS.find((l) => l.id === state.profile.level);

  return (
    <AppShell>
      <div className="shadow-soft flex flex-col items-center gap-4 rounded-3xl border border-border bg-card p-6 text-center sm:flex-row sm:text-left">
        <div className="bg-sun flex h-20 w-20 items-center justify-center overflow-hidden rounded-full text-primary-foreground">
          {state.profile.photo ? (
            <img src={state.profile.photo} alt="Foto de perfil" className="h-full w-full object-cover" />
          ) : (
            <span className="font-display text-3xl">{(state.profile.name || "?").charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">{state.profile.name || "Aluno(a)"}</h1>
          <p className="text-sm text-muted-foreground">{state.profile.email || "sem e-mail cadastrado"}</p>
          <p className="mt-2 text-sm">
            Nível <strong>{state.profile.level}</strong> — {levelInfo?.name} · {percent}% do plano concluído
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Info icon={Trophy} label="XP acumulado" value={`${state.xp} XP`} />
        <Info icon={Flame} label="Sequência" value={`${state.streak} dias`} />
        <Info icon={GraduationCap} label="Aulas concluídas" value={`${state.completedLessons.length}`} />
      </div>

      <section className="shadow-soft mt-5 rounded-3xl border border-border bg-card p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Target className="h-5 w-5 text-primary" /> Plano personalizado
        </h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <Row label="Objetivo principal" value={state.profile.goal} />
          <Row label="Meta diária" value={`${state.profile.minutesPerDay} min`} />
          <Row label="Já estudou espanhol?" value={state.profile.studiedBefore === "no" ? "Não" : "Sim"} />
          <Row
            label="Variante preferida"
            value={state.profile.variant === "espanha" ? "Espanhol da Espanha" : "Espanhol latino-americano"}
          />
          {state.profile.motivation && <Row label="Motivação" value={state.profile.motivation} />}
        </dl>
      </section>

      <section className="shadow-soft mt-5 rounded-3xl border border-border bg-card p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Languages className="h-5 w-5 text-primary" /> Vocabulário aprendido ({state.learnedWords.length})
        </h2>
        {state.learnedWords.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">Complete uma aula para começar sua lista de palavras.</p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {state.learnedWords.map((w) => (
              <span key={w} className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                {w}
              </span>
            ))}
          </div>
        )}
      </section>

      <section className="shadow-soft mt-5 grid gap-3 rounded-3xl border border-border bg-card p-6 sm:grid-cols-3">
        <Button variant="outline" onClick={() => navigate({ to: "/certificados" })}>
          Meus certificados
        </Button>
        <Button variant="outline" onClick={() => navigate({ to: "/lembretes" })}>
          Lembretes
        </Button>
        <Button onClick={() => navigate({ to: "/premium" })}>Plano: {premiumLabel(state)}</Button>
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="outline" onClick={() => navigate({ to: "/comecar" })}>
          Refazer teste de nivelamento
        </Button>
        <Button
          variant="ghost"
          className="text-destructive"
          onClick={() => {
            reset();
            navigate({ to: "/comecar" });
          }}
        >
          Apagar meus dados
        </Button>
      </div>
    </AppShell>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Trophy;
  label: string;
  value: string;
}) {
  return (
    <div className="shadow-soft rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
        <Icon className="h-4 w-4" /> {label}
      </div>
      <p className="font-display mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-secondary/60 px-3 py-2">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium capitalize">{value}</dd>
    </div>
  );
}
