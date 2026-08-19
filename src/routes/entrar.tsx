import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Logo } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useProgress } from "@/lib/progress-store";

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { title: "Entrar na sua conta | Habla+ Espanhol" },
      {
        name: "description",
        content:
          "Acesse sua conta do Habla+ Espanhol e continue de onde parou: XP, sequência, aulas e vocabulário salvos na nuvem.",
      },
      { property: "og:title", content: "Entrar | Habla+ Espanhol" },
      { property: "og:description", content: "Seu progresso de espanhol salvo na nuvem, em qualquer aparelho." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EntrarPage,
});

const schema = z.object({
  email: z.string().trim().email("E-mail inválido").max(120),
  password: z.string().min(6, "A senha precisa de ao menos 6 caracteres").max(72),
});

function EntrarPage() {
  const navigate = useNavigate();
  const { userId } = useProgress();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) navigate({ to: "/", replace: true });
  }, [userId, navigate]);

  async function submit() {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword(parsed.data);
        if (error) throw error;
        toast.success("Bem-vindo de volta! ¡Hola de nuevo!");
      } else {
        const { data, error } = await supabase.auth.signUp({
          ...parsed.data,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (!data.session) {
          toast.info("Confirme seu e-mail para ativar a conta.");
          return;
        }
        toast.success("Conta criada! Seu progresso agora fica salvo na nuvem.");
      }
      navigate({ to: "/", replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível entrar";
      toast.error(
        message.includes("Invalid login credentials")
          ? "E-mail ou senha incorretos."
          : message.includes("already registered")
            ? "Este e-mail já tem conta. Faça login."
            : message,
      );
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      toast.error("Não foi possível entrar com Google.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/", replace: true });
  }

  return (
    <div className="bg-soft flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Logo />
        <div className="shadow-soft mt-6 rounded-3xl border border-border bg-card p-6">
          <h1 className="text-2xl font-semibold">{mode === "login" ? "Entrar na sua conta" : "Criar conta"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Seu progresso, XP e sequência ficam salvos e voltam sempre que você entrar.
          </p>

          <Button variant="outline" className="mt-5 w-full" onClick={() => void google()}>
            Continuar com Google
          </Button>
          <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> ou com e-mail <span className="h-px flex-1 bg-border" />
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>E-mail</Label>
              <Input
                type="email"
                value={form.email}
                maxLength={120}
                placeholder="voce@email.com"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errors['email'] && <p className="text-xs text-destructive">{errors['email']}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Senha</Label>
              <Input
                type="password"
                value={form.password}
                maxLength={72}
                placeholder="mínimo 6 caracteres"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && void submit()}
              />
              {errors['password'] && <p className="text-xs text-destructive">{errors['password']}</p>}
            </div>
            <Button className="w-full" disabled={loading} onClick={() => void submit()}>
              {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
            </Button>
          </div>

          <button
            type="button"
            className="mt-4 w-full text-center text-sm text-muted-foreground underline-offset-4 hover:underline"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
          >
            {mode === "login" ? "Não tem conta? Criar agora" : "Já tenho conta. Entrar"}
          </button>

          <p className="mt-3 text-center text-sm">
            <Link to="/esqueci-senha" className="text-primary underline-offset-4 hover:underline">
              Esqueci minha senha
            </Link>
          </p>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Primeira vez por aqui?{" "}
            <Link to="/comecar" className="text-primary underline-offset-4 hover:underline">
              Fazer o teste de nivelamento
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
