import { useEffect } from "react";
import { fireKey, reminderMessage, shouldFireNow, showNotification } from "@/lib/notifications";
import { useProgress } from "@/lib/progress-store";

/** Verifica a cada minuto se algum lembrete configurado deve disparar. */
export function ReminderRunner() {
  const { state, hydrated, setState } = useProgress();

  useEffect(() => {
    if (!hydrated || !state.reminders?.enabled) return;
    const tick = () => {
      if (!shouldFireNow(state)) return;
      const msg = reminderMessage(state);
      if (!msg) return;
      showNotification(msg.title, msg.body);
      const key = fireKey(state);
      setState((s) => ({ ...s, reminders: { ...s.reminders, lastFired: key } }));
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [hydrated, state, setState]);

  return null;
}
