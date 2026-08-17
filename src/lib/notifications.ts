import type { AppState } from "./progress-store";
import { BADGES, rankFromXp } from "./gamification";

export type ReminderKind = "aula" | "conquista" | "revisao";

export const FREQUENCIES: { id: AppState["reminders"]["frequency"]; label: string }[] = [
  { id: "diario", label: "Todos os dias" },
  { id: "dias-uteis", label: "Segunda a sexta" },
  { id: "semanal", label: "Uma vez por semana (segunda)" },
];

export function frequencyMatchesToday(freq: AppState["reminders"]["frequency"], date = new Date()) {
  const day = date.getDay(); // 0 dom
  if (freq === "diario") return true;
  if (freq === "dias-uteis") return day >= 1 && day <= 5;
  return day === 1;
}

/** Mensagem mais relevante para o momento, ou null se não há nada a lembrar. */
export function reminderMessage(state: AppState): { kind: ReminderKind; title: string; body: string } | null {
  const types = state.reminders?.types ?? { aula: true, conquista: true, revisao: true };

  if (types.conquista) {
    const rank = rankFromXp(state.xp);
    if (rank.next !== null && rank.next - state.xp <= 10) {
      return {
        kind: "conquista",
        title: "Falta pouquinho!",
        body: `Você está a apenas ${rank.next - state.xp} XP da próxima conquista.`,
      };
    }
    const nearBadge = BADGES.find((b) => {
      const pct = badgePercent(state, b);
      return pct >= 80 && pct < 100;
    });
    if (nearBadge) {
      return { kind: "conquista", title: "Quase lá!", body: `Você está perto de conquistar a medalha "${nearBadge.name}".` };
    }
  }

  const dueReviews = Object.values(state.srs ?? {}).filter(
    (c) => (c as { due?: string }).due && (c as { due: string }).due <= new Date().toISOString().slice(0, 10),
  ).length;
  if (types.revisao && dueReviews > 0 && state.dailyReviews === 0) {
    return { kind: "revisao", title: "Revisão pendente", body: `Hoje você ainda não fez sua revisão (${dueReviews} cartões esperando).` };
  }

  if (types.aula && state.minutesToday < state.profile.minutesPerDay) {
    return { kind: "aula", title: "Habla+ Espanhol", body: "Está na hora da sua aula de espanhol." };
  }

  return null;
}

function badgePercent(state: AppState, badge: (typeof BADGES)[number]) {
  if (badge.earned(state)) return 100;
  const { current, target } = badge.progress(state);
  return target ? Math.min(100, Math.round((current / target) * 100)) : 0;
}

export function canNotify() {
  return typeof window !== "undefined" && "Notification" in window;
}

export async function requestPermission() {
  if (!canNotify()) return "unsupported" as const;
  return Notification.requestPermission();
}

export function showNotification(title: string, body: string) {
  if (!canNotify() || Notification.permission !== "granted") return false;
  new Notification(title, { body, icon: "/favicon.ico" });
  return true;
}

/** Retorna true quando o relógio passou de algum horário configurado e ainda não disparou hoje. */
export function shouldFireNow(state: AppState, now = new Date()) {
  const r = state.reminders;
  if (!r?.enabled || !frequencyMatchesToday(r.frequency, now)) return false;
  const stamp = now.toISOString().slice(0, 10);
  const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const slot = [...r.times].sort().filter((t) => t <= hhmm).pop();
  if (!slot) return false;
  return r.lastFired !== `${stamp}T${slot}`;
}

export function fireKey(state: AppState, now = new Date()) {
  const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const slot = [...(state.reminders?.times ?? [])].sort().filter((t) => t <= hhmm).pop();
  return `${now.toISOString().slice(0, 10)}T${slot ?? "00:00"}`;
}
