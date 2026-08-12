import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000),
});

const TeacherInput = z.object({
  level: z.string().min(2).max(2),
  variant: z.enum(["latino", "espanha"]),
  scenario: z.string().min(1).max(80),
  scenarioPrompt: z.string().min(1).max(600),
  studentName: z.string().max(60).optional(),
  messages: z.array(MessageSchema).max(40),
});

export type TeacherTurn = {
  reply: string;
  replyPt: string;
  correction: null | {
    wrong: string;
    correct: string;
    whyPt: string;
    betterPt: string;
  };
  scores: { vocabulario: number; gramatica: number; fluencia: number };
  tipPt: string;
};

const FALLBACK: TeacherTurn = {
  reply: "Perdona, ahora mismo no puedo responder. ¿Lo intentamos otra vez?",
  replyPt: "Desculpe, não consigo responder agora. Vamos tentar de novo?",
  correction: null,
  scores: { vocabulario: 0, gramatica: 0, fluencia: 0 },
  tipPt: "Tente enviar sua mensagem novamente em alguns segundos.",
};

export const teacherReply = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => TeacherInput.parse(input))
  .handler(async ({ data }): Promise<TeacherTurn> => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const accent = data.variant === "espanha" ? "espanhol da Espanha (vosotros, ceceo)" : "espanhol latino-americano (ustedes)";

    const system = `Você é "Profe", um professor de espanhol para falantes de português do Brasil.
Nível do aluno: ${data.level}. Variante: ${accent}.
Cenário/roleplay: ${data.scenario}. ${data.scenarioPrompt}
Interprete o personagem do cenário e converse NATURALMENTE em espanhol, adaptando a dificuldade ao nível ${data.level}:
- A1/A2: frases muito curtas e vocabulário básico.
- B1/B2: frases médias, conectores, perguntas de opinião.
- C1/C2: ritmo nativo, expressões idiomáticas, ironia e nuance.
Sempre termine sua fala com UMA pergunta para manter a conversa.
Se a última mensagem do aluno tiver erro de gramática, vocabulário, ortografia ou naturalidade, preencha "correction":
explique EM PORTUGUÊS por que estava errado, mostre a frase correta em espanhol e sugira uma forma melhor/mais natural de responder.
Nunca apenas entregue a resposta pronta sem explicar o motivo.
Se não houver erro, "correction" deve ser null.
Avalie de 0 a 100 vocabulário, gramática e fluência da última mensagem do aluno (0 se ainda não houver mensagem do aluno).
"tipPt" é uma dica curta em português para o aluno evoluir.
Responda SOMENTE com JSON válido no formato:
{"reply":"fala em espanhol","replyPt":"tradução em português","correction":null ou {"wrong":"","correct":"","whyPt":"","betterPt":""},"scores":{"vocabulario":0,"gramatica":0,"fluencia":0},"tipPt":""}`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "google/gemini-3.6-flash",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          ...(data.messages.length
            ? data.messages
            : [{ role: "user" as const, content: "(o aluno acabou de entrar na conversa, comece você)" }]),
        ],
      }),
    });

    if (res.status === 429) throw new Error("RATE_LIMIT");
    if (res.status === 402) throw new Error("NO_CREDITS");
    if (!res.ok) return FALLBACK;

    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = json.choices?.[0]?.message?.content;
    if (!content) return FALLBACK;
    try {
      const parsed = JSON.parse(content) as TeacherTurn;
      return {
        reply: parsed.reply || FALLBACK.reply,
        replyPt: parsed.replyPt || "",
        correction: parsed.correction ?? null,
        scores: {
          vocabulario: Number(parsed.scores?.vocabulario ?? 0),
          gramatica: Number(parsed.scores?.gramatica ?? 0),
          fluencia: Number(parsed.scores?.fluencia ?? 0),
        },
        tipPt: parsed.tipPt || "",
      };
    } catch {
      return FALLBACK;
    }
  });
