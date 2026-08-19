import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Award, BookOpen, Briefcase, Clock, Crown, Flame, Languages, LogIn, Plane, Target, Trophy } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LEVELS } from "@/lib/course-data";
import { premiumLabel } from "@/lib/premium";
import { challengeClaimId, challengeStatus } from "@/lib/daily-challenge";
import { useProgress, usePlan } from "@/lib/progress-store";
import { InstallAppCard } from "@/lib/pwa-install";
import { NextStepCard } from "@/components/next-step";



export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Habla+ — Seu Professor de Espanhol com IA" },
      {
        name: "description",
        content:
          "Aprenda espanhol do zero ao avançado: aulas guiadas, conversação, pronúncia, vocabulário e um plano de estudos personalizado.",
      },
      { property: "og:title", content: "Habla+ — Seu Professor de Espanhol com IA" },
      {
        property: "og:description",
        content: "Aprenda espanhol do zero ao avançado: aulas guiadas, conversação, pronúncia, vocabulário e um plano de estudos personalizado.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { state, hydrated, userId, authEmail, addXp, setState } = useProgress();
  const { percent, plan } = usePlan();
  const navigate = useNavigate();

  useEffect(() => {
    if (hydrated && !state.onboarded) navigate({ to: "/comecar" });
  }, [hydrated, state.onboarded, navigate]);

  const levelName = LEVELS.find((l) => l.id === state.profile.level)?.name ?? "";
  const goalPercent = Math.min(100, Math.round((state.minutesToday / state.profile.minutesPerDay) * 100));
  const daily = challengeStatus(state);

  function claimDaily() {
    const id = challengeClaimId();
    if (state.claimed.includes(id)) return;
    setState((s) => ({ ...s, claimed: [...s.claimed, id] }));
    addXp(daily.challenge.xp);
  }



  return (
    <AppShell>
      <section className="bg-sun shadow-lift relative overflow-hidden rounded-3xl p-6 text-primary-foreground sm:p-8">
        <p className="text-sm opacity-90">¡Hola, {state.profile.name || "estudante"}!</p>
        <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">
          Nível {state.profile.level} · {levelName}
        </h1>
        <div className="mt-5 max-w-md">
          <div className="flex justify-between text-xs opacity-90">
            <span>Progresso do plano</span>
            <span>{percent}%</span>
          </div>
          <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-primary-foreground/25">
            <div className="h-full rounded-full bg-primary-foreground transition-all" style={{ width: `${percent}%` }} />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5">
            <Flame className="h-4 w-4" /> {state.streak} dias seguidos
          </span>
          <span className="flex items-center gap-1.5">
            <Trophy className="h-4 w-4" /> {state.xp} XP
          </span>
          <span className="flex items-center gap-1.5">
            <Languages className="h-4 w-4" /> {state.learnedWords.length} palavras
          </span>
        </div>
      </section>

      {hydrated && !userId ? (
        <section className="shadow-soft mt-5 rounded-3xl border border-primary/40 bg-card p-6">
          <h2 className="font-display flex items-center gap-2 text-lg font-semibold">
            <LogIn className="h-5 w-5 text-primary" /> Entre na sua conta
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Faça login com e-mail ou Google para salvar XP, sequência, aulas e vocabulário na nuvem e continuar em
            qualquer aparelho.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={() => navigate({ to: "/entrar" })}>Entrar ou criar conta</Button>
            <Button variant="outline" onClick={() => navigate({ to: "/comecar" })}>
              Fazer o teste de nivelamento
            </Button>
          </div>
        </section>
      ) : (
        hydrated && (
          <p className="mt-3 text-xs text-muted-foreground">
            Progresso sincronizado na nuvem{authEmail ? ` · ${authEmail}` : ""}.
          </p>
        )
      )}

      <div className="mt-5">
        <NextStepCard />
      </div>

      <div className="mt-5">
        <InstallAppCard />
      </div>



      <section className="shadow-soft bg-sun/10 mt-5 rounded-3xl border border-primary/30 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Desafio do dia</p>
            <h2 className="font-display mt-1 text-xl font-semibold">
              {daily.challenge.emoji} {daily.challenge.title}
            </h2>
            <p className="text-sm text-muted-foreground">{daily.challenge.description}</p>
          </div>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
            +{daily.challenge.xp} XP
          </span>
        </div>
        <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="bg-sun h-full transition-all" style={{ width: `${daily.percent}%` }} />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">
            {daily.current}/{daily.challenge.target} concluído
          </span>
          {daily.claimed ? (
            <span className="text-sm font-semibold text-success">Recompensa resgatada ✔</span>
          ) : daily.done ? (
            <Button size="sm" onClick={claimDaily}>
              Resgatar {daily.challenge.xp} XP
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={() => navigate({ to: daily.challenge.to })}>
              {daily.challenge.ctaLabel}
            </Button>
          )}
        </div>
      </section>

      <section className="mt-5 grid gap-3 sm:grid-cols-2">
        <Link
          to="/viagens"
          className="shadow-soft rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary"
        >
          <p className="font-display flex items-center gap-2 text-base font-semibold">
            <Plane className="h-4 w-4 text-primary" /> Espanhol para Viajar
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Aeroporto, hotel, táxi, restaurante e emergências com simulações
          </p>
        </Link>
        <Link
          to="/profissional"
          className="shadow-soft rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary"
        >
          <p className="font-display flex items-center gap-2 text-base font-semibold">
            <Briefcase className="h-4 w-4 text-primary" /> Espanhol Profissional
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Entrevistas, reuniões, e-mails, negociação e atendimento
          </p>
        </Link>
      </section>

      <section className="mt-3 grid gap-3 sm:grid-cols-2">
        <Link
          to="/certificados"
          className="shadow-soft rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary"
        >
          <p className="font-display flex items-center gap-2 text-base font-semibold">
            <Award className="h-4 w-4 text-primary" /> Certificados
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Conclua um nível e emita o certificado com código e QR Code
          </p>
        </Link>
        <Link
          to="/premium"
          className="shadow-soft rounded-2xl border border-primary/40 bg-card p-4 transition-colors hover:border-primary"
        >
          <p className="font-display flex items-center gap-2 text-base font-semibold">
            <Crown className="h-4 w-4 text-primary" /> {premiumLabel(state)}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Curso completo A1–C2, IA ilimitada, certificados e relatórios
          </p>
        </Link>
      </section>


      <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Trophy} label="Pontuação" value={`${state.xp} pts`} hint="XP acumulado no app" />
        <StatCard
          icon={BookOpen}
          label="Aulas"
          value={`${state.completedLessons.length}/${plan.length}`}
          hint="concluídas no seu plano"
        />
        <StatCard
          icon={Clock}
          label="Hoje"
          value={`${state.minutesToday} min`}
          hint={`meta de ${state.profile.minutesPerDay} min`}
        />
        <StatCard icon={Languages} label="Vocabulário" value={`${state.learnedWords.length}`} hint="palavras aprendidas" />
      </section>

      <section className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          { to: "/exercicios", title: "Exercícios", text: "10 formatos com correção imediata" },
          { to: "/revisao", title: "Revisão Inteligente", text: "Sessão montada pelos seus pontos fracos" },
          { to: "/conquistas", title: "Conquistas & Ranking", text: "Missões, medalhas e metas semanais" },
          { to: "/professor", title: "Pergunte ao Professor", text: "Tire dúvidas com explicação e exercícios" },
          { to: "/dicionario", title: "Dicionário", text: "Tradução, pronúncia, sinônimos e frases" },
          { to: "/plano", title: "Plano de estudos", text: "Rotina automática pelo seu tempo diário" },
          { to: "/relatorio", title: "Relatório", text: "Evolução por semana, mês e total" },
        ].map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="shadow-soft rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary"
          >
            <p className="font-display text-base font-semibold">{c.title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{c.text}</p>
          </Link>
        ))}
      </section>


      <section className="shadow-soft mt-5 rounded-3xl border border-border bg-card p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Target className="h-5 w-5 text-primary" /> Meta diária
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {state.minutesToday} de {state.profile.minutesPerDay} minutos estudados hoje.
        </p>
        <Progress value={goalPercent} className="mt-3 h-2.5" />
      </section>

      <section className="shadow-soft mt-5 rounded-3xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Desempenho recente</h2>
          <Link to="/aulas" className="text-sm text-primary underline-offset-2 hover:underline">
            Ver trilha
          </Link>
        </div>
        {state.history.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Ainda não há histórico. Conclua sua primeira aula para ver seu desempenho aqui.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {state.history.map((h, i) => (
              <li
                key={`${h.lessonId}-${i}`}
                className="flex items-center justify-between rounded-xl bg-secondary/60 px-3 py-2 text-sm"
              >
                <span>
                  <span className="block font-medium">{h.title}</span>
                  <span className="block text-xs text-muted-foreground">{h.date}</span>
                </span>
                <span className={h.accuracy >= 70 ? "font-semibold text-success" : "font-semibold text-primary"}>
                  {h.accuracy}%
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  );
}
