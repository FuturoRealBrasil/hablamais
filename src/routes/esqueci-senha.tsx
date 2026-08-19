import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Logo } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/esqueci-senha")({
  head: () => ({
    meta: [
      { title: "Recuperar senha | Habla+ Espanhol" },
      {
        name: "description",
        content: "Esqueceu sua senha do Habla+ Espanhol? Receba um link por e-mail e crie uma nova senha em segundos.",
      },
      { property: "og:title", content: "Recuperar senha | Habla+ Espanhol" },
      { property: "og:description", content: "Redefina a senha da sua conta Habla+ Espanhol." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ForgotPage,
});

const schema = z.string().trim().email("E-mail inválido").max(120);

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit() {
    const parsed = schema.safeParse(email);
    if (!parsed.success) {
      toast.error("Informe um e-mail válido.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });
    setLoading(false);
    if (error) {
      toast.error("Não foi possível enviar o e-mail agora. Tente novamente.");
      return;
    }
    setSent(true);
    toast.success("Enviamos um link de recuperação para o seu e-mail.");
  }

  return (
    <div className="bg-soft flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Logo />
        <div className="shadow-soft mt-6 rounded-3xl border border-border bg-card p-6">
          <h1 className="text-2xl font-semibold">Esqueci minha senha</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Digite o e-mail da sua conta e enviaremos um link para criar uma nova senha.
          </p>

          {sent ? (
            <p className="mt-5 rounded-2xl bg-secondary p-4 text-sm">
              Verifique sua caixa de entrada (e o spam). O link abre a página para definir a nova senha.
            </p>
          ) : (
            <div className="mt-5 space-y-3">
              <div className="space-y-1.5">
                <Label>E-mail</Label>
                <Input
                  type="email"
                  value={email}
                  maxLength={120}
                  placeholder="voce@email.com"
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && void submit()}
                />
              </div>
              <Button className="w-full" disabled={loading} onClick={() => void submit()}>
                {loading ? "Enviando..." : "Enviar link de recuperação"}
              </Button>
            </div>
          )}

          <p className="mt-4 text-center text-sm text-muted-foreground">
            <Link to="/entrar" className="text-primary underline-offset-4 hover:underline">
              Voltar para o login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
