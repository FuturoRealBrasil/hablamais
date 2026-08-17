import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, ShieldX } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LEVELS } from "@/lib/course-data";
import { verifyCode } from "@/lib/certificates";

type Search = { c: string };

export const Route = createFileRoute("/validar")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    c: typeof search["c"] === "string" ? (search["c"] as string) : "",
  }),
  head: () => ({
    meta: [
      { title: "Validar certificado de espanhol | Habla+" },
      {
        name: "description",
        content: "Verifique a autenticidade de um certificado Habla+ Espanhol informando o código de validação impresso no documento.",
      },
      { property: "og:title", content: "Validar certificado | Habla+ Espanhol" },
      { property: "og:description", content: "Confira a autenticidade de certificados Habla+ pelo código de validação." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ValidatePage,
});

function ValidatePage() {
  const { c } = Route.useSearch();
  const navigate = useNavigate();
  const [code, setCode] = useState(c ?? "");
  const result = c ? verifyCode(c) : null;

  return (
    <AppShell>
      <h1 className="font-display text-2xl font-semibold">Validar certificado</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Digite o código impresso no certificado (ex.: HB-A1-260817-XXXX) ou escaneie o QR Code.
      </p>

      <form
        className="mt-5 flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void navigate({ to: "/validar", search: { c: code.trim().toUpperCase() } });
        }}
      >
        <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="HB-A1-260817-XXXX" className="max-w-xs font-mono" />
        <Button type="submit">Verificar</Button>
      </form>

      {result && (
        <section
          className={`shadow-soft mt-6 rounded-3xl border p-6 ${result.valid ? "border-success/50" : "border-destructive/50"}`}
        >
          {result.valid ? (
            <>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-success">
                <ShieldCheck className="h-5 w-5" /> Certificado autêntico
              </h2>
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-muted-foreground">Nível concluído</dt>
                  <dd className="font-medium">
                    {result.level} — {LEVELS.find((l) => l.id === result.level)?.name}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Data de emissão</dt>
                  <dd className="font-medium">{new Date(`${result.date}T12:00:00`).toLocaleDateString("pt-BR")}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs text-muted-foreground">Código</dt>
                  <dd className="font-mono font-medium">{c}</dd>
                </div>
              </dl>
            </>
          ) : (
            <h2 className="flex items-center gap-2 text-lg font-semibold text-destructive">
              <ShieldX className="h-5 w-5" /> Código inválido ou não reconhecido
            </h2>
          )}
        </section>
      )}
    </AppShell>
  );
}
