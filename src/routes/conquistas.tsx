import { createFileRoute, Link } from "@tanstack/react-router";
import { Crown, Flame, Gift, Medal, Target, Trophy, Zap } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/lib/progress-store";
import { BADGES, CHALLENGES, dailyMissions, leaderboard, rankFromXp, weeklyGoals, type Mission } from "@/lib/gamification";

export const Route = createFileRoute("/conquistas")({
  head: () => ({
    meta: [
      { title: "Conquistas, Missões e Ranking | Habla+ Espanhol" },
      {
        name: "description",
        content:
          "Acompanhe XP, níveis, medalhas, sequência diária, missões, metas semanais, desafios e ranking do seu aprendizado de espanhol.",
      },
      { property: "og:title", content: "Conquistas, Missões e Ranking | Habla+ Espanhol" },
      { property: "og:description", content: "XP, medalhas, missões diárias, metas semanais e ranking no Habla+." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AchievementsPage,
});

function MissionRow({ mission, claimed, onClaim }: { mission: Mission; claimed: boolean; onClaim: () => void }) {
  const done = mission.current >= mission.target;
  const pct = Math.min(100, Math.round((mission.current / mission.target) * 100));
  return (
    <div className="shadow-soft rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">{mission.title}</p>
        <span className="text-xs text-muted-foreground">+{mission.reward} XP</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className="bg-sun h-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {Math.min(mission.current, mission.target)} / {mission.target}
        </span>
        {claimed ? (
          <span className="text-xs font-medium text-emerald-600">Recompensa recebida ✓</span>
        ) : (
          <Button size="sm" variant={done ? "default" : "secondary"} disabled={!done} onClick={onClaim}>
            <Gift className="h-3.5 w-3.5" /> Resgatar
          </Button>
        )}
      </div>
    </div>
  );
}

function AchievementsPage() {
  const { state, setState, addXp } = useProgress();
  const rank = rankFromXp(state.xp);
  const toNext = rank.next ? rank.next - state.xp : 0;
  const rankPct = rank.next ? Math.round(((state.xp - rank.min) / (rank.next - rank.min)) * 100) : 100;
  const earned = BADGES.filter((b) => b.earned(state));
  const board = leaderboard(state);

  function claim(id: string, reward: number) {
    if (state.claimed.includes(id)) return;
    setState((s) => ({ ...s, claimed: [...s.claimed, id] }));
    addXp(reward);
  }

  return (
    <AppShell>
      <header className="bg-sun shadow-lift rounded-3xl p-6 text-primary-foreground">
        <p className="text-sm opacity-90">Nível {rank.level} · {rank.name}</p>
        <h1 className="font-display mt-1 text-3xl font-semibold">{state.xp} XP</h1>
        <div className="mt-4 max-w-md">
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-primary-foreground/25">
            <div className="h-full rounded-full bg-primary-foreground transition-all" style={{ width: `${rankPct}%` }} />
          </div>
          <p className="mt-1.5 text-xs opacity-90">
            {rank.next ? `Faltam ${toNext} XP para o nível ${rank.level + 1}` : "Nível máximo alcançado!"}
          </p>
        </div>
      </header>

      {state.streak >= 7 && (
        <div className="mt-4 rounded-2xl border border-amber-500/50 bg-amber-500/10 p-4">
          <p className="font-medium">🔥 Você estudou {state.streak} dias consecutivos!</p>
          <p className="text-sm text-muted-foreground">
            Parabéns! Você desbloqueou a medalha <strong>Primeira Semana</strong>.
          </p>
        </div>
      )}

      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        <StatCard icon={Flame} label="Sequência" value={`${state.streak} dias`} hint="Estude todo dia para manter" />
        <StatCard icon={Trophy} label="Medalhas" value={`${earned.length}/${BADGES.length}`} />
        <StatCard icon={Zap} label="XP da semana" value={`${state.weeklyXp}`} />
        <StatCard icon={Target} label="Acerto" value={`${state.exercises.total ? Math.round((state.exercises.correct / state.exercises.total) * 100) : 0}%`} hint={`${state.exercises.total} exercícios`} />
      </div>

      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold">Missões diárias</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {dailyMissions(state).map((m) => (
            <MissionRow key={m.id} mission={m} claimed={state.claimed.includes(m.id)} onClaim={() => claim(m.id, m.reward)} />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold">Metas semanais</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {weeklyGoals(state).map((m) => (
            <MissionRow key={m.id} mission={m} claimed={state.claimed.includes(m.id)} onClaim={() => claim(m.id, m.reward)} />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold">Desafios</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {CHALLENGES.map((c) => (
            <Link
              key={c.id}
              to={c.to}
              className="shadow-soft rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary"
            >
              <p className="font-medium">{c.title}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{c.description}</p>
              <p className="mt-2 text-xs font-medium text-primary">Recompensa: {c.xp} XP</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold">Medalhas e conquistas</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {BADGES.map((b) => {
            const has = b.earned(state);
            const p = b.progress(state);
            return (
              <div
                key={b.id}
                className={`shadow-soft rounded-2xl border p-4 ${has ? "border-primary bg-secondary" : "border-border bg-card opacity-80"}`}
              >
                <p className="text-3xl">{has ? b.emoji : "🔒"}</p>
                <p className="mt-2 flex items-center gap-1.5 font-medium">
                  <Medal className="h-4 w-4 text-primary" /> {b.name}
                </p>
                <p className="text-xs text-muted-foreground">{b.description}</p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="bg-sun h-full" style={{ width: `${Math.min(100, (p.current / p.target) * 100)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display flex items-center gap-2 text-xl font-semibold">
          <Crown className="h-5 w-5 text-primary" /> Ranking da semana
        </h2>
        <div className="shadow-soft mt-3 divide-y divide-border rounded-2xl border border-border bg-card">
          {board.map((p, i) => (
            <div
              key={`${p.name}-${i}`}
              className={`flex items-center justify-between px-4 py-3 ${p.isMe ? "bg-secondary font-semibold" : ""}`}
            >
              <span className="flex items-center gap-3">
                <span className="w-6 text-sm text-muted-foreground">{i + 1}º</span>
                {p.name}
              </span>
              <span className="text-sm">{p.xp} XP</span>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
