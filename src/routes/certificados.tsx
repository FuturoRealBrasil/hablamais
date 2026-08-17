import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Lock, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CertificateCard } from "@/components/certificate-card";
import { Button } from "@/components/ui/button";
import { buildCode, certificateFor, levelProgress } from "@/lib/certificates";
import { isPremium } from "@/lib/premium";
import { useProgress } from "@/lib/progress-store";

export const Route = createFileRoute("/certificados")({
  head: () => ({
    meta: [
      { title: "Certificados digitais de espanhol | Habla+" },
      {
        name: "description",
        content:
          "Emita seu certificado digital ao concluir cada nível de espanhol (A1 a C2) com nome, data, carga horária, código de validação e QR Code.",
      },
      { property: "og:title", content: "Certificados digitais de espanhol | Habla+" },
      { property: "og:description", content: "Certificados A1 a C2 com código de validação e QR Code de autenticidade." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CertificatesPage,
});

function CertificatesPage() {
  const { state, setState } = useProgress();
  const levels = levelProgress(state);
  const premium = isPremium(state);

  function emit(level: (typeof levels)[number]) {
    const date = new Date().toISOString().slice(0, 10);
    setState((s) => ({
      ...s,
      certificates: { ...(s.certificates ?? {}), [level.level]: { code: buildCode(level.level, date), date, hours: level.hours } },
    }));
  }

  return (
    <AppShell>
      <header>
        <h1 className="font-display flex items-center gap-2 text-2xl font-semibold">
          <Award className="h-6 w-6 text-primary" /> Certificados
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Conclua todas as aulas de um nível para emitir o certificado digital com código de validação e QR Code.
        </p>
      </header>

      {!premium && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/40 bg-secondary/50 p-4">
          <p className="text-sm">
            <Lock className="mr-1 inline h-4 w-4 text-primary" /> A emissão de certificados faz parte do plano Premium.
          </p>
          <Button size="sm" asChild>
            <Link to="/premium">Ver planos</Link>
          </Button>
        </div>
      )}

      <div className="mt-5 space-y-4">
        {levels.map((lv) => {
          const cert = certificateFor(state, lv.level);
          return (
            <section key={lv.level} className="shadow-soft rounded-3xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-semibold">
                    Nível {lv.level} — {lv.name}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {lv.done}/{lv.total} aulas concluídas · {lv.hours} horas
                  </p>
                </div>
                {cert ? (
                  <span className="text-sm font-semibold text-success">Certificado emitido ✔</span>
                ) : (
                  <Button size="sm" disabled={!lv.completed || !premium} onClick={() => emit(lv)}>
                    {lv.completed ? "Emitir certificado" : "Conclua o nível"}
                  </Button>
                )}
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="bg-sun h-full transition-all" style={{ width: `${lv.percent}%` }} />
              </div>
              {cert && (
                <div className="mt-4">
                  <CertificateCard data={cert} />
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => window.print()}>
                      Imprimir / salvar em PDF
                    </Button>
                    <Button size="sm" variant="ghost" asChild>
                      <Link to="/validar" search={{ c: cert.code }}>
                        <ShieldCheck className="mr-1 h-4 w-4" /> Validar
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}
