import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/redefinir-senha")({
  head: () => ({
    meta: [
      { title: "Criar nova senha | Habla+ Espanhol" },
      {
        name: "description",
        content: "Defina uma nova senha para a sua conta do Habla+ Espanhol e volte a estudar de onde parou.",
      },
      { property: "og:title", content: "Criar nova senha | Habla+ Espanhol" },
      { property: "og:description", content: "Defina uma nova senha para a sua conta Habla+ Espanhol." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    void supabase.auth.getSession().then(({ data }) => {
      if (active && data.session) setReady(true);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function submit() {
    if (password.length < 6) {
      toast.error("A senha precisa de ao menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      toast.error("As senhas não são iguais.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error("Não foi possível alterar a senha. Peça um novo link.");
      return;
    }
    toast.success("Senha alterada! Bem-vindo de volta.");
    navigate({ to: "/", replace: true });
  }

  return (
    <div className="bg-soft flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Logo />
        <div className="shadow-soft mt-6 rounded-3xl border border-border bg-card p-6">
          <h1 className="text-2xl font-semibold">Criar nova senha</h1>
          {!ready ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Abra esta página pelo link enviado no seu e-mail para poder alterar a senha.{" "}
              <Link to="/esqueci-senha" className="text-primary underline-offset-4 hover:underline">
                Pedir novo link
              </Link>
            </p>
          ) : (
            <div className="mt-5 space-y-3">
              <div className="space-y-1.5">
                <Label>Nova senha</Label>
                <Input
                  type="password"
                  maxLength={72}
                  value={password}
                  placeholder="mínimo 6 caracteres"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Confirmar senha</Label>
                <Input
                  type="password"
                  maxLength={72}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && void submit()}
                />
              </div>
              <Button className="w-full" disabled={loading} onClick={() => void submit()}>
                {loading ? "Salvando..." : "Salvar nova senha"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
