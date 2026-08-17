import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import type { Level, Track } from "./course-data";
import type { SrsMap } from "./vocabulary";
import { LESSONS, lessonsForLevel } from "./course-data";

export type Profile = {
  name: string;
  email: string;
  photo?: string;
  level: Level;
  goal: string;
  motivation: string;
  minutesPerDay: number;
  studiedBefore: string;
  variant: "latino" | "espanha";
};

export type AppState = {
  onboarded: boolean;
  profile: Profile;
  xp: number;
  streak: number;
  lastStudyDate: string | null;
  minutesToday: number;
  todayDate: string;
  completedLessons: string[];
  learnedWords: string[];
  history: { lessonId: string; title: string; accuracy: number; date: string }[];
  srs: SrsMap;
  pronunciation: Record<string, { best: number; attempts: number }>;
  weakSounds: string[];
  grammarDone: string[];
  exercises: { total: number; correct: number; byType: Record<string, { total: number; correct: number }> };
  mistakes: { id: string; type: string; skill: string; question: string; given: string; correct: string; date: string }[];
  grammarScores: Record<string, number>;
  claimed: string[];
  weekStart: string;
  weeklyXp: number;
  weeklyMinutes: number;
  dailyXp: number;
  dailyExercises: number;
  dailyReviews: number;
  dailyConversations: number;
  dailyWords: number;
  reviewSessions: number;
  xpLog: Record<string, number>;
  minutesLog: Record<string, number>;
  planMinutes: number;
  certificates: Partial<Record<Level, { code: string; date: string; hours: number }>>;
  reminders: {
    enabled: boolean;
    times: string[];
    frequency: "diario" | "dias-uteis" | "semanal";
    types: { aula: boolean; conquista: boolean; revisao: boolean };
    lastFired: string | null;
  };
  subscription: { plan: "free" | "mensal" | "trimestral" | "anual"; since: string | null; until: string | null };
};

export function weekStartOf(date = new Date()) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // segunda = 0
  d.setDate(d.getDate() - day);
  return d.toISOString().slice(0, 10);
}

const STORAGE_KEY = "hablamas-state-v1";

const today = () => new Date().toISOString().slice(0, 10);

export const defaultState: AppState = {
  onboarded: false,
  profile: {
    name: "",
    email: "",
    level: "A1",
    goal: "conversacao",
    motivation: "",
    minutesPerDay: 15,
    studiedBefore: "no",
    variant: "latino",
  },
  xp: 0,
  streak: 0,
  lastStudyDate: null,
  minutesToday: 0,
  todayDate: today(),
  completedLessons: [],
  learnedWords: [],
  history: [],
  srs: {},
  pronunciation: {},
  weakSounds: [],
  grammarDone: [],
  exercises: { total: 0, correct: 0, byType: {} },
  mistakes: [],
  grammarScores: {},
  claimed: [],
  weekStart: weekStartOf(),
  weeklyXp: 0,
  weeklyMinutes: 0,
  dailyXp: 0,
  dailyExercises: 0,
  dailyReviews: 0,
  dailyConversations: 0,
  dailyWords: 0,
  reviewSessions: 0,
  xpLog: {},
  minutesLog: {},
  planMinutes: 0,
  certificates: {},
  reminders: {
    enabled: false,
    times: ["19:00"],
    frequency: "diario",
    types: { aula: true, conquista: true, revisao: true },
    lastFired: null,
  },
  subscription: { plan: "free", since: null, until: null },
};

type Ctx = {
  state: AppState;
  hydrated: boolean;
  userId: string | null;
  authEmail: string | null;
  syncing: boolean;
  signOut: () => Promise<void>;
  setState: (updater: (s: AppState) => AppState) => void;
  completeLesson: (args: {
    lessonId: string;
    title: string;
    xp: number;
    minutes: number;
    accuracy: number;
    words: string[];
  }) => void;
  addXp: (xp: number, opts?: { minutes?: number; kind?: "exercicio" | "revisao" | "conversa" }) => void;
  recordExercise: (entry: {
    id: string;
    type: string;
    skill: string;
    question: string;
    given: string;
    correct: string;
    isCorrect: boolean;
  }) => void;
  reset: () => void;
};

const ProgressContext = createContext<Ctx | null>(null);

function rollDates(parsed: AppState): AppState {
  const next = { ...defaultState, ...parsed };
  if (next.todayDate !== today()) {
    next.todayDate = today();
    next.minutesToday = 0;
    next.dailyXp = 0;
    next.dailyExercises = 0;
    next.dailyReviews = 0;
    next.dailyConversations = 0;
    next.dailyWords = 0;
    next.claimed = (next.claimed ?? []).filter((c) => !c.startsWith("d:"));
  }
  if (next.weekStart !== weekStartOf()) {
    next.weekStart = weekStartOf();
    next.weeklyXp = 0;
    next.weeklyMinutes = 0;
  }
  return next;
}

function mergeLogs(a: Record<string, number> = {}, b: Record<string, number> = {}) {
  const out: Record<string, number> = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = Math.max(out[k] ?? 0, v);
  return out;
}

/** A nuvem é a fonte de verdade quando tem mais progresso; senão mantém o local. */
function mergeStates(local: AppState, cloud: AppState): AppState {
  const base = cloud.xp >= local.xp ? cloud : local;
  const other = base === cloud ? local : cloud;
  return {
    ...base,
    onboarded: base.onboarded || other.onboarded,
    xp: Math.max(local.xp, cloud.xp),
    streak: Math.max(local.streak, cloud.streak),
    completedLessons: Array.from(new Set([...local.completedLessons, ...cloud.completedLessons])),
    learnedWords: Array.from(new Set([...local.learnedWords, ...cloud.learnedWords])),
    grammarDone: Array.from(new Set([...(local.grammarDone ?? []), ...(cloud.grammarDone ?? [])])),
    srs: { ...local.srs, ...cloud.srs },
    xpLog: mergeLogs(local.xpLog, cloud.xpLog),
    minutesLog: mergeLogs(local.minutesLog, cloud.minutesLog),
    profile: base.profile.name || base.profile.email ? base.profile : other.profile,
    certificates: { ...(other.certificates ?? {}), ...(base.certificates ?? {}) },
    reminders: base.reminders ?? other.reminders ?? defaultState.reminders,
    subscription:
      (cloud.subscription?.plan ?? "free") !== "free" ? cloud.subscription : (local.subscription ?? defaultState.subscription),
  };
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setRaw] = useState<AppState>(defaultState);
  const [hydrated, setHydrated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [authEmail, setAuthEmail] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const stateRef = useRef(state);
  const cloudReady = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  stateRef.current = state;

  // 1) hidrata do armazenamento local
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setRaw(rollDates(JSON.parse(stored) as AppState));
    } catch {
      /* ignore corrupted storage */
    }
    setHydrated(true);
  }, []);

  // 2) escuta a sessão e carrega o progresso da nuvem
  useEffect(() => {
    let active = true;

    async function loadCloud(uid: string) {
      setSyncing(true);
      try {
        const { data } = await supabase.from("progress").select("state").eq("user_id", uid).maybeSingle();
        if (!active) return;
        if (data?.state) {
          const cloud = rollDates(data.state as unknown as AppState);
          const merged = mergeStates(stateRef.current, cloud);
          setRaw(merged);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          } catch {
            /* ignore */
          }
        }
        cloudReady.current = true;
      } finally {
        if (active) setSyncing(false);
      }
    }

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      setAuthEmail(session?.user?.email ?? null);
      cloudReady.current = false;
      if (uid) void loadCloud(uid);
    });

    void supabase.auth.getSession().then(({ data }) => {
      const uid = data.session?.user?.id ?? null;
      setUserId(uid);
      setAuthEmail(data.session?.user?.email ?? null);
      if (uid) void loadCloud(uid);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // 3) salva na nuvem com debounce
  useEffect(() => {
    if (!hydrated || !userId || !cloudReady.current) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void supabase
        .from("progress")
        .upsert(
          { user_id: userId, state: state as unknown as Json, updated_at: new Date().toISOString() },
          { onConflict: "user_id" },
        );
    }, 800);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [state, hydrated, userId]);

  const setState = useCallback((updater: (s: AppState) => AppState) => {
    setRaw((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  }, []);

  const signOut = useCallback(async () => {
    if (userId && cloudReady.current) {
      await supabase
        .from("progress")
        .upsert(
          { user_id: userId, state: stateRef.current as unknown as Json, updated_at: new Date().toISOString() },
          { onConflict: "user_id" },
        );
    }
    await supabase.auth.signOut();
    cloudReady.current = false;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setRaw(defaultState);
  }, [userId]);


  const completeLesson: Ctx["completeLesson"] = useCallback(
    ({ lessonId, title, xp, minutes, accuracy, words }) => {
      setState((s) => {
        const day = today();
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        let streak = s.streak;
        if (s.lastStudyDate !== day) {
          streak = s.lastStudyDate === yesterday ? s.streak + 1 : 1;
        }
        return {
          ...s,
          xp: s.xp + xp,
          streak,
          lastStudyDate: day,
          todayDate: day,
          minutesToday: (s.todayDate === day ? s.minutesToday : 0) + minutes,
          completedLessons: s.completedLessons.includes(lessonId)
            ? s.completedLessons
            : [...s.completedLessons, lessonId],
          learnedWords: Array.from(new Set([...s.learnedWords, ...words])),
          history: [{ lessonId, title, accuracy, date: day }, ...s.history].slice(0, 12),
          xpLog: { ...(s.xpLog ?? {}), [day]: ((s.xpLog ?? {})[day] ?? 0) + xp },
          minutesLog: { ...(s.minutesLog ?? {}), [day]: ((s.minutesLog ?? {})[day] ?? 0) + minutes },
        };
      });
    },
    [setState],
  );

  const addXp: Ctx["addXp"] = useCallback(
    (xp, opts = {}) => {
      const minutes = opts.minutes ?? 0;
      setState((s) => {
        const day = today();
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        let streak = s.streak;
        if (s.lastStudyDate !== day) streak = s.lastStudyDate === yesterday ? s.streak + 1 : 1;
        const sameDay = s.todayDate === day;
        const sameWeek = s.weekStart === weekStartOf();
        return {
          ...s,
          xp: s.xp + xp,
          streak,
          lastStudyDate: day,
          todayDate: day,
          minutesToday: (sameDay ? s.minutesToday : 0) + minutes,
          dailyXp: (sameDay ? s.dailyXp : 0) + xp,
          dailyReviews: (sameDay ? s.dailyReviews : 0) + (opts.kind === "revisao" ? 1 : 0),
          dailyConversations: (sameDay ? s.dailyConversations : 0) + (opts.kind === "conversa" ? 1 : 0),
          reviewSessions: s.reviewSessions + (opts.kind === "revisao" ? 1 : 0),
          weekStart: weekStartOf(),
          weeklyXp: (sameWeek ? s.weeklyXp : 0) + xp,
          weeklyMinutes: (sameWeek ? s.weeklyMinutes : 0) + minutes,
          xpLog: { ...(s.xpLog ?? {}), [day]: ((s.xpLog ?? {})[day] ?? 0) + xp },
          minutesLog: { ...(s.minutesLog ?? {}), [day]: ((s.minutesLog ?? {})[day] ?? 0) + minutes },
        };
      });
    },
    [setState],
  );

  const recordExercise: Ctx["recordExercise"] = useCallback(
    (entry) => {
      setState((s) => {
        const day = today();
        const prev = s.exercises.byType[entry.type] ?? { total: 0, correct: 0 };
        return {
          ...s,
          dailyExercises: (s.todayDate === day ? s.dailyExercises : 0) + 1,
          exercises: {
            total: s.exercises.total + 1,
            correct: s.exercises.correct + (entry.isCorrect ? 1 : 0),
            byType: {
              ...s.exercises.byType,
              [entry.type]: { total: prev.total + 1, correct: prev.correct + (entry.isCorrect ? 1 : 0) },
            },
          },
          mistakes: entry.isCorrect
            ? s.mistakes.filter((m) => m.id !== entry.id)
            : [
                { ...entry, date: day },
                ...s.mistakes.filter((m) => m.id !== entry.id),
              ].slice(0, 40),
        };
      });
    },
    [setState],
  );

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setRaw(defaultState);
  }, []);

  const value = useMemo(
    () => ({ state, hydrated, userId, authEmail, syncing, signOut, setState, completeLesson, addXp, recordExercise, reset }),
    [state, hydrated, userId, authEmail, syncing, signOut, setState, completeLesson, addXp, recordExercise, reset],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider");
  return ctx;
}

export function usePlan() {
  const { state } = useProgress();
  const plan = lessonsForLevel(state.profile.level);
  const done = state.completedLessons;
  const next = plan.find((l) => !done.includes(l.id)) ?? plan[0];
  const percent = plan.length ? Math.round((plan.filter((l) => done.includes(l.id)).length / plan.length) * 100) : 0;
  return { plan, next, percent, allLessons: LESSONS };
}

export const GOAL_LABEL: Record<string, Track> = {
  viagem: "viagem",
  trabalho: "trabalho",
  estudo: "provas",
  conversacao: "conversacao",
};
