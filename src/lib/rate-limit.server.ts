// Rate limiting server-only (janela deslizante em memória por instância).
// Protege as rotas de IA contra abuso/custo, mesmo sem login.
import { getRequestHeader, getRequestIP } from "@tanstack/react-start/server";

type Bucket = { hits: number[] };

const buckets = new Map<string, Bucket>();
const MAX_KEYS = 5000;

export function clientKey(scope: string): string {
  const ip =
    getRequestIP({ xForwardedFor: true }) ??
    getRequestHeader("cf-connecting-ip") ??
    getRequestHeader("x-real-ip") ??
    "anon";
  // Diferencia sessões do mesmo IP quando há token de autenticação.
  const auth = getRequestHeader("authorization") ?? "";
  const suffix = auth ? auth.slice(-24) : "";
  return `${scope}:${ip}:${suffix}`;
}

/** Lança erro RATE_LIMIT quando o limite da janela é excedido. */
export function enforceRateLimit(scope: string, limit: number, windowMs: number): void {
  const key = clientKey(scope);
  const now = Date.now();
  const bucket = buckets.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => now - t < windowMs);

  if (bucket.hits.length >= limit) {
    buckets.set(key, bucket);
    throw new Error("RATE_LIMIT");
  }

  bucket.hits.push(now);
  buckets.set(key, bucket);

  if (buckets.size > MAX_KEYS) {
    for (const [k, v] of buckets) {
      if (v.hits.every((t) => now - t >= windowMs)) buckets.delete(k);
      if (buckets.size <= MAX_KEYS) break;
    }
  }
}

/** Versão booleana, para handlers HTTP que respondem 429. */
export function allowRequest(scope: string, limit: number, windowMs: number): boolean {
  try {
    enforceRateLimit(scope, limit, windowMs);
    return true;
  } catch {
    return false;
  }
}
