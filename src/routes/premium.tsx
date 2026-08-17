import { createFileRoute } from "@tanstack/react-router";
import { Check, Crown, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { activatePlan, FREE_FEATURES, isPremium, PLANS, PREMIUM_FEATURES, premiumLabel } from "@/lib/premium";
import { useProgress } from "@/lib/progress-store";

export const Route = createFileRoute("/premium")({
  head: () => ({
    meta: [
      { title: "Planos Premium — curso completo de espanhol | Habla+" },
      {
        name: "description",
        content:
          "Compare o plano gratuito e o Premium do Habla+: curso completo A1–C2, IA ilimitada, pronúncia, revisão inteligente, certificados e relatórios. Planos mensal, trimestral e anual.",
      },
      { property: "og:title", content: "Planos Premium do Habla+ Espanhol" },
      { property: "og:description", content: "Curso completo A1–C2, IA ilimitada, certificados e relatórios avançados." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PremiumPage,
});

const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function PremiumPage() {
  const { state, setState } = useProgress();
  const premium = isPremium(state);

  return (
    <AppShell>
      <header className="text-center">
        <h1 className="font-display flex items-center justify-center gap-2 text-2xl font-semibold sm:text-3xl">
          <Crown className="h-6 w-6 text-primary" /> Habla+ Premium
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
          Seu plano atual: <strong className="text-foreground">{premiumLabel(state)}</strong>
          {premium && state.subscription.until ? ` · válido até ${new Date(`${state.subscription.until}T12:00:00`).toLocaleDateString("pt-BR")}` : ""}
        </p>
      </header>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <section className="shadow-soft rounded-3xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold">Gratuito</h2>
          <p className="text-sm text-muted-foreground">Para experimentar o método</p>
          <ul className="mt-4 space-y-2 text-sm">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" /> {f}
              </li>
            ))}
          </ul>
        </section>

        <section className="shadow-lift rounded-3xl border-2 border-primary/40 bg-card p-6">
          <h2 className="font-display flex items-center gap-2 text-lg font-semibold">
            <Sparkles className="h-5 w-5 text-primary" /> Premium
          </h2>
          <p className="text-sm text-muted-foreground">Todo o curso, sem limites</p>
          <ul className="mt-4 space-y-2 text-sm">
            {PREMIUM_FEATURES.map((f) => (
              <li key={f} className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {f}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <h2 className="font-display mt-8 text-xl font-semibold">Escolha seu plano</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {PLANS.map((plan) => {
          const active = state.subscription.plan === plan.id && premium;
          return (
            <div
              key={plan.id}
              className={`shadow-soft relative rounded-3xl border bg-card p-5 ${plan.badge ? "border-primary" : "border-border"}`}
            >
              {plan.badge && (
                <span className="bg-sun absolute -top-3 left-5 rounded-full px-3 py-1 text-[11px] font-semibold text-primary-foreground">
                  {plan.badge}
                </span>
              )}
              <h3 className="font-display text-lg font-semibold">{plan.name}</h3>
              <p className="font-display mt-2 text-3xl font-semibold">{brl(plan.price)}</p>
              <p className="text-xs text-muted-foreground">
                {plan.months === 1 ? "por mês" : `${brl(plan.perMonth)}/mês · cobrado a cada ${plan.months} meses`}
              </p>
              {plan.save && <p className="mt-1 text-xs font-semibold text-success">{plan.save}</p>}
              <Button
                className="mt-4 w-full"
                variant={plan.badge ? "default" : "outline"}
                disabled={active}
                onClick={() => setState((s) => ({ ...s, subscription: activatePlan(plan) }))}
              >
                {active ? "Plano atual" : "Assinar"}
              </Button>
            </div>
          );
        })}
      </div>

      {premium && (
        <Button
          variant="ghost"
          className="mt-4 text-destructive"
          onClick={() => setState((s) => ({ ...s, subscription: { plan: "free", since: null, until: null } }))}
        >
          Cancelar assinatura
        </Button>
      )}

      <p className="mt-6 text-xs text-muted-foreground">
        Pagamentos ainda não estão conectados a uma operadora — a ativação aqui libera os recursos para você testar.
      </p>
    </AppShell>
  );
}
