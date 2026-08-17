import { LESSONS, LEVELS, type Level } from "./course-data";
import type { AppState } from "./progress-store";

export type CertificateData = {
  level: Level;
  levelName: string;
  student: string;
  date: string; // ISO yyyy-mm-dd
  hours: number;
  code: string;
};

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function hash4(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let out = "";
  let n = Math.abs(h);
  for (let i = 0; i < 4; i++) {
    out += ALPHABET[n % ALPHABET.length];
    n = Math.floor(n / ALPHABET.length);
  }
  return out;
}

/** HB-<NIVEL>-<AAMMDD>-<checksum> */
export function buildCode(level: Level, date: string) {
  const compact = date.replaceAll("-", "").slice(2);
  return `HB-${level}-${compact}-${hash4(`${level}|${compact}|habla+`)}`;
}

export function verifyCode(code: string): { valid: boolean; level?: Level; date?: string } {
  const parts = code.trim().toUpperCase().split("-");
  if (parts.length !== 4 || parts[0] !== "HB") return { valid: false };
  const level = parts[1] ?? "";
  const compact = parts[2] ?? "";
  const sum = parts[3] ?? "";
  if (!LEVELS.some((l) => l.id === level)) return { valid: false };
  if (!/^\d{6}$/.test(compact)) return { valid: false };
  if (hash4(`${level}|${compact}|habla+`) !== sum) return { valid: false };
  const date = `20${compact.slice(0, 2)}-${compact.slice(2, 4)}-${compact.slice(4, 6)}`;
  return { valid: true, level: level as Level, date };
}

export function levelHours(level: Level) {
  const minutes = LESSONS.filter((l) => l.level === level).reduce((acc, l) => acc + l.minutes, 0);
  return Math.max(10, Math.round(minutes / 60) * 10);
}

export type LevelProgress = {
  level: Level;
  name: string;
  total: number;
  done: number;
  percent: number;
  completed: boolean;
  hours: number;
};

export function levelProgress(state: AppState): LevelProgress[] {
  return LEVELS.map(({ id, name }) => {
    const lessons = LESSONS.filter((l) => l.level === id);
    const done = lessons.filter((l) => state.completedLessons.includes(l.id)).length;
    const total = lessons.length;
    return {
      level: id,
      name,
      total,
      done,
      percent: total ? Math.round((done / total) * 100) : 0,
      completed: total > 0 && done === total,
      hours: levelHours(id),
    };
  });
}

export function certificateFor(state: AppState, level: Level): CertificateData | null {
  const issued = state.certificates?.[level];
  if (!issued) return null;
  return {
    level,
    levelName: LEVELS.find((l) => l.id === level)?.name ?? "",
    student: state.profile.name || "Aluno(a)",
    date: issued.date,
    hours: issued.hours,
    code: issued.code,
  };
}

export function verifyUrl(code: string) {
  const origin = typeof window === "undefined" ? "https://hablamais.lovable.app" : window.location.origin;
  return `${origin}/validar?c=${encodeURIComponent(code)}`;
}
