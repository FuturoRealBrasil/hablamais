import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { type CertificateData, verifyUrl } from "@/lib/certificates";

export function CertificateCard({ data }: { data: CertificateData }) {
  const [qr, setQr] = useState<string | null>(null);
  const url = verifyUrl(data.code);

  useEffect(() => {
    let alive = true;
    void QRCode.toDataURL(url, { margin: 1, width: 220 }).then((d) => {
      if (alive) setQr(d);
    });
    return () => {
      alive = false;
    };
  }, [url]);

  return (
    <article className="shadow-lift relative overflow-hidden rounded-3xl border-2 border-primary/30 bg-card p-6 print:shadow-none sm:p-8">
      <div className="bg-sun absolute inset-x-0 top-0 h-1.5" />
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Certificado de conclusão</p>
      <h3 className="font-display mt-3 text-2xl font-semibold sm:text-3xl">{data.student}</h3>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        concluiu com aproveitamento o nível <strong className="text-foreground">{data.level} — {data.levelName}</strong> do
        curso Habla+ Espanhol, com carga horária de <strong className="text-foreground">{data.hours} horas</strong>.
      </p>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted-foreground">Data de emissão</dt>
            <dd className="font-medium">{new Date(`${data.date}T12:00:00`).toLocaleDateString("pt-BR")}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Carga horária</dt>
            <dd className="font-medium">{data.hours} horas</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs text-muted-foreground">Código de validação</dt>
            <dd className="font-mono text-base font-semibold tracking-wider">{data.code}</dd>
          </div>
        </dl>
        <div className="text-center">
          {qr ? (
            <img src={qr} alt={`QR Code de validação do certificado ${data.code}`} className="h-28 w-28 rounded-lg border border-border" />
          ) : (
            <div className="h-28 w-28 animate-pulse rounded-lg bg-muted" />
          )}
          <p className="mt-1 text-[10px] text-muted-foreground">Escaneie para validar</p>
        </div>
      </div>
    </article>
  );
}
