import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type StudentRow = {
  id: string;
  name: string;
  email: string;
  level: string;
  createdAt: string;
  xp: number;
  streak: number;
  lessons: number;
  words: number;
  plan: string;
  certificates: number;
  lastStudy: string | null;
};

type CloudState = {
  xp?: number;
  streak?: number;
  completedLessons?: string[];
  learnedWords?: string[];
  lastStudyDate?: string | null;
  certificates?: Record<string, unknown>;
  subscription?: { plan?: string };
  profile?: { name?: string; level?: string };
};

export function useIsAdmin(userId: string | null) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let active = true;
    if (!userId) {
      setIsAdmin(false);
      setChecked(true);
      return;
    }
    setChecked(false);
    void supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        setIsAdmin(Boolean(data));
        setChecked(true);
      });
    return () => {
      active = false;
    };
  }, [userId]);

  return { isAdmin, checked };
}

/** Lista alunos combinando perfis e progresso (só funciona para administradores por RLS). */
export async function fetchStudents(): Promise<StudentRow[]> {
  const [{ data: profiles }, { data: progress }] = await Promise.all([
    supabase.from("profiles").select("id, name, email, level, created_at").order("created_at", { ascending: false }),
    supabase.from("progress").select("user_id, state, updated_at"),
  ]);

  const byUser = new Map<string, CloudState>();
  for (const row of progress ?? []) byUser.set(row.user_id, (row.state ?? {}) as CloudState);

  return (profiles ?? []).map((p) => {
    const s = byUser.get(p.id) ?? {};
    return {
      id: p.id,
      name: p.name || s.profile?.name || "—",
      email: p.email || "—",
      level: s.profile?.level || p.level || "A1",
      createdAt: p.created_at,
      xp: s.xp ?? 0,
      streak: s.streak ?? 0,
      lessons: s.completedLessons?.length ?? 0,
      words: s.learnedWords?.length ?? 0,
      plan: s.subscription?.plan ?? "free",
      certificates: Object.keys(s.certificates ?? {}).length,
      lastStudy: s.lastStudyDate ?? null,
    };
  });
}
