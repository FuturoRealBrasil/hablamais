import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Level, Track } from "./course-data";
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
};

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
};

type Ctx = {
  state: AppState;
  hydrated: boolean;
  setState: (updater: (s: AppState) => AppState) => void;
  completeLesson: (args: {
    lessonId: string;
    title: string;
    xp: number;
    minutes: number;
    accuracy: number;
    words: string[];
  }) => void;
  reset: () => void;
};

const ProgressContext = createContext<Ctx | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setRaw] = useState<AppState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = { ...defaultState, ...(JSON.parse(stored) as AppState) };
        if (parsed.todayDate !== today()) {
          parsed.todayDate = today();
          parsed.minutesToday = 0;
        }
        setRaw(parsed);
      }
    } catch {
      /* ignore corrupted storage */
    }
    setHydrated(true);
  }, []);

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
    () => ({ state, hydrated, setState, completeLesson, reset }),
    [state, hydrated, setState, completeLesson, reset],
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
