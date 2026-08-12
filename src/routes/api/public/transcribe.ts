import { createFileRoute } from "@tanstack/react-router";

const MAX_BYTES = 8 * 1024 * 1024;

export const Route = createFileRoute("/api/public/transcribe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("Transcrição indisponível", { status: 503 });

        let form: FormData;
        try {
          form = await request.formData();
        } catch {
          return new Response("Envio inválido", { status: 400 });
        }
        const file = form.get("file");
        if (!(file instanceof File)) return new Response("Arquivo de áudio ausente", { status: 400 });
        if (file.size < 2048) return new Response("Gravação muito curta — tente novamente.", { status: 400 });
        if (file.size > MAX_BYTES) return new Response("Áudio muito longo", { status: 413 });

        const upstream = new FormData();
        upstream.append("model", "openai/gpt-4o-mini-transcribe");
        upstream.append("file", file, "recording.wav");
        upstream.append("language", "es");

        const res = await fetch("https://ai.gateway.lovable.dev/v1/audio/transcriptions", {
          method: "POST",
          headers: { Authorization: `Bearer ${key}` },
          body: upstream,
        });
        if (!res.ok) {
          const body = await res.text().catch(() => "");
          return new Response(body || "Falha na transcrição", { status: res.status });
        }
        const data = (await res.json()) as { text?: string };
        return Response.json({ text: data.text ?? "" });
      },
    },
  },
});
