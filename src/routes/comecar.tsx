import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { z } from "zod";
import { Logo } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { LEVELS, PLACEMENT_QUESTIONS, levelFromScore } from "@/lib/course-data";
import { useProgress } from "@/lib/progress-store";

export const Route = createFileRoute("/comecar")({
  head: () => ({
    meta: [
      { title: "Comece agora: teste de nivelamento | Habla+ Espanhol" },
      {
        name: "description",
        content:
          "Crie sua conta, faça o teste de nivelamento de espanhol e receba um plano de estudos personalizado em minutos.",
      },
      { property: "og:title", content: "Teste de nivelamento de espanhol | Habla+" },
      { property: "og:description", content: "Descubra seu nível de espanhol e receba um plano de estudos sob medida." },
    ],
  }),
  component: ComecarPage,
});

const accountSchema = z.object({
  name: z.string().trim().min(2, "Digite seu nome").max(60),
  email: z.string().trim().email("E-mail inválido").max(120),
  password: z.string().min(6, "A senha precisa de ao menos 6 caracteres").max(72),
});

const STEPS = ["Conta", "Objetivos", "Nivelamento", "Plano"];

function ComecarPage() {
  const navigate = useNavigate();
  const { setState } = useProgress();
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [prefs, setPrefs] = useState({
    motivation: "",
    minutesPerDay: 15,
    studiedBefore: "no",
    goal: "conversacao",
    variant: "latino" as "latino" | "espanha",
  });
  const [answers, setAnswers] = useState<number[]>(Array(PLACEMENT_QUESTIONS.length).fill(-1));
  const [qIndex, setQIndex] = useState(0);

  const score = answers.reduce((acc, a, i) => acc + (a === PLACEMENT_QUESTIONS[i]!.answer ? 1 : 0), 0);
  const level = levelFromScore(score);

  function submitAccount() {
    const parsed = accountSchema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    setStep(1);
  }

  function finish() {
    setState((s) => ({
      ...s,
      onboarded: true,
      profile: {
        ...s.profile,
        name: form.name.trim(),
        email: form.email.trim(),
        level,
        motivation: prefs.motivation.trim().slice(0, 200),
        minutesPerDay: prefs.minutesPerDay,
        studiedBefore: prefs.studiedBefore,
        goal: prefs.goal,
        variant: prefs.variant,
      },
    }));
    toast.success("Plano de estudos criado! ¡Vamos allá!");
    navigate({ to: "/" });
  }

  return (
    <div className="bg-soft min-h-screen px-4 py-8">
      <div className="mx-auto max-w-xl">
        <Logo />

        <div className="mt-6">
          <Progress value={((step + 1) / STEPS.length) * 100} className="h-2" />
          <div className="mt-2 flex justify-between text-[11px] uppercase tracking-wide text-muted-foreground">
            {STEPS.map((s, i) => (
              <span key={s} className={i <= step ? "font-semibold text-primary" : ""}>
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="shadow-soft mt-5 rounded-3xl border border-border bg-card p-6">
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-semibold">Crie sua conta</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Comece grátis e aprenda espanhol do zero ao avançado.
                </p>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => toast.info("Login com Google chega na próxima etapa, com backend ativado.")}
              >
                Continuar com Google
              </Button>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" /> ou com e-mail <span className="h-px flex-1 bg-border" />
              </div>

              <Field label="Nome" error={errors['name']}>
                <Input
                  value={form.name}
                  maxLength={60}
                  placeholder="Como quer ser chamado(a)?"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </Field>
              <Field label="E-mail" error={errors['email']}>
                <Input
                  type="email"
                  value={form.email}
                  maxLength={120}
                  placeholder="voce@email.com"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </Field>
              <Field label="Senha" error={errors['password']}>
                <Input
                  type="password"
                  value={form.password}
                  maxLength={72}
                  placeholder="mínimo 6 caracteres"
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </Field>

              <Button className="w-full" onClick={submitAccount}>
                Continuar <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-semibold">Vamos personalizar seu plano</h1>
                <p className="mt-1 text-sm text-muted-foreground">Quatro perguntas rápidas.</p>
              </div>

              <Field label="Por que deseja aprender espanhol?">
                <Input
                  value={prefs.motivation}
                  maxLength={200}
                  placeholder="Ex.: quero viajar pela América Latina"
                  onChange={(e) => setPrefs({ ...prefs, motivation: e.target.value })}
                />
              </Field>

              <Choice
                label="Quanto tempo pode estudar por dia?"
                value={String(prefs.minutesPerDay)}
                options={[
                  { value: "5", label: "5 min" },
                  { value: "15", label: "15 min" },
                  { value: "30", label: "30 min" },
                  { value: "60", label: "1 hora" },
                ]}
                onChange={(v) => setPrefs({ ...prefs, minutesPerDay: Number(v) })}
              />

              <Choice
                label="Já estudou espanhol?"
                value={prefs.studiedBefore}
                options={[
                  { value: "no", label: "Nunca estudei" },
                  { value: "little", label: "Um pouco" },
                  { value: "yes", label: "Sim, já estudei" },
                ]}
                onChange={(v) => setPrefs({ ...prefs, studiedBefore: v })}
              />

              <Choice
                label="Seu foco principal"
                value={prefs.goal}
                options={[
                  { value: "conversacao", label: "Conversação" },
                  { value: "viagem", label: "Viagem" },
                  { value: "trabalho", label: "Trabalho" },
                  { value: "estudo", label: "Provas / estudo" },
                ]}
                onChange={(v) => setPrefs({ ...prefs, goal: v })}
              />

              <Choice
                label="Qual variante prefere?"
                value={prefs.variant}
                options={[
                  { value: "latino", label: "Latino-americano" },
                  { value: "espanha", label: "Da Espanha" },
                ]}
                onChange={(v) => setPrefs({ ...prefs, variant: v as "latino" | "espanha" })}
              />

              <Button className="w-full" onClick={() => setStep(2)}>
                Ir para o teste de nivelamento
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-semibold">Teste de nivelamento</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pergunta {qIndex + 1} de {PLACEMENT_QUESTIONS.length} · sem pressa, responda o que souber.
                </p>
              </div>

              <p className="font-display text-lg">{PLACEMENT_QUESTIONS[qIndex]!.question}</p>
              <div className="grid gap-2">
                {PLACEMENT_QUESTIONS[qIndex]!.options.map((opt, i) => (
                  <button
                    key={opt}
                    onClick={() => {
                      const next = [...answers];
                      next[qIndex] = i;
                      setAnswers(next);
                      if (qIndex < PLACEMENT_QUESTIONS.length - 1) setQIndex(qIndex + 1);
                      else setStep(3);
                    }}
                    className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors hover:border-primary hover:bg-secondary ${
                      answers[qIndex] === i ? "border-primary bg-secondary" : "border-border bg-background"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" disabled={qIndex === 0} onClick={() => setQIndex(qIndex - 1)}>
                  Voltar
                </Button>
                <Button variant="ghost" onClick={() => setStep(3)}>
                  Pular teste
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 text-center">
              <span className="bg-sun mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-primary-foreground">
                <Sparkles className="h-7 w-7" />
              </span>
              <div>
                <h1 className="text-2xl font-semibold">Seu nível é {level}</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {LEVELS.find((l) => l.id === level)?.name} — você acertou {score} de {PLACEMENT_QUESTIONS.length}.
                </p>
              </div>

              <ul className="space-y-2 text-left text-sm">
                {[
                  `Trilha começando no nível ${level}`,
                  `Meta diária de ${prefs.minutesPerDay} minutos`,
                  `Foco em ${prefs.goal === "estudo" ? "provas" : prefs.goal}`,
                  `Áudio em espanhol ${prefs.variant === "espanha" ? "da Espanha" : "latino-americano"}`,
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 rounded-xl bg-secondary/60 px-3 py-2">
                    <Check className="mt-0.5 h-4 w-4 text-success" /> {item}
                  </li>
                ))}
              </ul>

              <Button className="w-full" onClick={finish}>
                Começar a estudar
              </Button>
              <p className="text-xs text-muted-foreground">
                Quer um diagnóstico completo (A1 a C2) com pontos fortes e fracos?{" "}
                <Link to="/nivelamento" className="text-primary underline-offset-2 hover:underline">
                  Faça o teste de nivelamento completo
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string | undefined; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Choice({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              value === o.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:bg-secondary"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
