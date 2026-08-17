import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, BellRing, Plus, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FREQUENCIES, canNotify, reminderMessage, requestPermission, showNotification } from "@/lib/notifications";
import { useProgress } from "@/lib/progress-store";

export const Route = createFileRoute("/lembretes")({
  head: () => ({
    meta: [
      { title: "Lembretes de estudo de espanhol | Habla+" },
      {
        name: "description",
        content:
          "Configure horários e frequência dos lembretes: hora da aula, conquistas próximas e revisão pendente no Habla+ Espanhol.",
      },
      { property: "og:title", content: "Lembretes de estudo | Habla+ Espanhol" },
      { property: "og:description", content: "Escolha horário e frequência dos avisos para manter sua sequência de estudos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RemindersPage,
});

function RemindersPage() {
  const { state, setState } = useProgress();
  const r = state.reminders;
  const [newTime, setNewTime] = useState("19:00");
  const [permission, setPermission] = useState<string>(canNotify() ? Notification.permission : "unsupported");
  const preview = reminderMessage(state);

  function patch(partial: Partial<typeof r>) {
    setState((s) => ({ ...s, reminders: { ...s.reminders, ...partial } }));
  }

  return (
    <AppShell>
      <h1 className="font-display flex items-center gap-2 text-2xl font-semibold">
        <Bell className="h-6 w-6 text-primary" /> Lembretes
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Receba avisos para não perder a sequência: hora da aula, conquistas próximas e revisão pendente.
      </p>

      <section className="shadow-soft mt-5 rounded-3xl border border-border bg-card p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-medium">Ativar lembretes</h2>
            <p className="text-xs text-muted-foreground">
              {permission === "granted"
                ? "Notificações permitidas neste aparelho."
                : permission === "unsupported"
                  ? "Este navegador não suporta notificações."
                  : "Permita as notificações do navegador para receber os avisos."}
            </p>
          </div>
          <Switch
            checked={r.enabled}
            onCheckedChange={async (v) => {
              if (v && canNotify() && Notification.permission !== "granted") {
                const res = await requestPermission();
                setPermission(String(res));
              }
              patch({ enabled: v });
            }}
          />
        </div>
      </section>

      <section className="shadow-soft mt-4 rounded-3xl border border-border bg-card p-6">
        <h2 className="font-medium">Horários</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {r.times.map((t) => (
            <span key={t} className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
              {t}
              <button
                type="button"
                aria-label={`Remover horário ${t}`}
                onClick={() => patch({ times: r.times.filter((x) => x !== t) })}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
          {r.times.length === 0 && <p className="text-sm text-muted-foreground">Nenhum horário definido.</p>}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="max-w-[140px]" />
          <Button
            variant="outline"
            onClick={() => {
              if (newTime && !r.times.includes(newTime)) patch({ times: [...r.times, newTime].sort() });
            }}
          >
            <Plus className="mr-1 h-4 w-4" /> Adicionar horário
          </Button>
        </div>
      </section>

      <section className="shadow-soft mt-4 rounded-3xl border border-border bg-card p-6">
        <h2 className="font-medium">Frequência</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {FREQUENCIES.map((f) => (
            <Button
              key={f.id}
              size="sm"
              variant={r.frequency === f.id ? "default" : "outline"}
              onClick={() => patch({ frequency: f.id })}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </section>

      <section className="shadow-soft mt-4 rounded-3xl border border-border bg-card p-6">
        <h2 className="font-medium">Tipos de lembrete</h2>
        <div className="mt-3 space-y-3 text-sm">
          <ToggleRow
            label="Está na hora da sua aula de espanhol."
            checked={r.types.aula}
            onChange={(v) => patch({ types: { ...r.types, aula: v } })}
          />
          <ToggleRow
            label="Você está a poucos XP da próxima conquista."
            checked={r.types.conquista}
            onChange={(v) => patch({ types: { ...r.types, conquista: v } })}
          />
          <ToggleRow
            label="Hoje você ainda não fez sua revisão."
            checked={r.types.revisao}
            onChange={(v) => patch({ types: { ...r.types, revisao: v } })}
          />
        </div>
      </section>

      <section className="shadow-soft mt-4 rounded-3xl border border-border bg-card p-6">
        <h2 className="flex items-center gap-2 font-medium">
          <BellRing className="h-4 w-4 text-primary" /> Próximo aviso
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {preview ? `“${preview.body}”` : "Tudo em dia por hoje — nenhum lembrete pendente."}
        </p>
        <Button
          className="mt-3"
          size="sm"
          variant="outline"
          onClick={async () => {
            if (canNotify() && Notification.permission !== "granted") setPermission(String(await requestPermission()));
            const msg = preview ?? { title: "Habla+ Espanhol", body: "Está na hora da sua aula de espanhol." };
            showNotification(msg.title, msg.body);
          }}
        >
          Testar notificação
        </Button>
      </section>
    </AppShell>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-secondary/50 px-3 py-2">
      <span>{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
