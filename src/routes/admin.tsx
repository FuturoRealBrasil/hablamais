import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { fetchStudents, useIsAdmin, type StudentRow } from "@/lib/admin";
import { useProgress } from "@/lib/progress-store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel do administrador | Habla+ Espanhol" },
      {
        name: "description",
        content: "Área protegida do Habla+ Espanhol: acompanhe alunos, progresso, assinaturas, certificados e avisos.",
      },
      { property: "og:title", content: "Painel do administrador | Habla+ Espanhol" },
      { property: "og:description", content: "Gestão de alunos e conteúdo do Habla+ Espanhol." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Announcement = { id: string; title: string; message: string; audience: string; active: boolean };

function AdminPage() {
  const { userId } = useProgress();
  const { isAdmin, checked } = useIsAdmin(userId);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [draft, setDraft] = useState({ title: "", message: "" });

  useEffect(() => {
    if (!isAdmin) return;
    let active = true;
    void (async () => {
      const rows = await fetchStudents();
      const { data } = await supabase
        .from("admin_announcements")
        .select("id, title, message, audience, active")
        .order("created_at", { ascending: false });
      if (!active) return;
      setStudents(rows);
      setAnnouncements((data ?? []) as Announcement[]);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [isAdmin]);

  const stats = useMemo(() => {
    const total = students.length;
    const actives = students.filter((s) => s.lastStudy && s.lastStudy >= new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10)).length;
    const premium = students.filter((s) => s.plan !== "free").length;
    const certs = students.reduce((a, s) => a + s.certificates, 0);
    const xp = students.reduce((a, s) => a + s.xp, 0);
    return { total, actives, premium, certs, xp };
  }, [students]);

  const filtered = students.filter(
    (s) => !query || s.name.toLowerCase().includes(query.toLowerCase()) || s.email.toLowerCase().includes(query.toLowerCase()),
  );

  async function publishAnnouncement() {
    if (draft.title.trim().length < 3 || draft.message.trim().length < 3) {
      toast.error("Preencha título e mensagem.");
      return;
    }
    const { data, error } = await supabase
      .from("admin_announcements")
      .insert({ title: draft.title.trim(), message: draft.message.trim(), created_by: userId })
      .select("id, title, message, audience, active")
      .single();
    if (error) {
      toast.error("Não foi possível publicar o aviso.");
      return;
    }
    setAnnouncements((prev) => [data as Announcement, ...prev]);
    setDraft({ title: "", message: "" });
    toast.success("Aviso publicado para os alunos.");
  }

  async function toggleAnnouncement(a: Announcement) {
    const { error } = await supabase.from("admin_announcements").update({ active: !a.active }).eq("id", a.id);
    if (error) {
      toast.error("Não foi possível atualizar.");
      return;
    }
    setAnnouncements((prev) => prev.map((x) => (x.id === a.id ? { ...x, active: !x.active } : x)));
  }

  if (!checked) {
    return (
      <AppShell>
        <p className="text-sm text-muted-foreground">Verificando permissões...</p>
      </AppShell>
    );
  }

  if (!isAdmin) {
    return (
      <AppShell>
        <div className="shadow-soft rounded-3xl border border-border bg-card p-6">
          <h1 className="text-xl font-semibold">Área restrita</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Esta página é exclusiva para administradores do Habla+. Entre com uma conta de administrador para acessar.
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <h1 className="font-display text-2xl font-semibold">Painel do administrador</h1>
      <p className="mt-1 text-sm text-muted-foreground">Alunos, progresso, assinaturas, certificados e avisos.</p>

      <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          { label: "Alunos", value: stats.total },
          { label: "Ativos (7 dias)", value: stats.actives },
          { label: "Premium", value: stats.premium },
          { label: "Certificados", value: stats.certs },
          { label: "XP total", value: stats.xp },
        ].map((card) => (
          <div key={card.label} className="shadow-soft rounded-2xl border border-border bg-card p-4">
            <div className="text-2xl font-semibold">{card.value}</div>
            <div className="text-xs text-muted-foreground">{card.label}</div>
          </div>
        ))}
      </section>

      <section className="shadow-soft mt-5 rounded-3xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-semibold">Alunos</h2>
          <Input
            className="max-w-[220px]"
            placeholder="Buscar por nome ou e-mail"
            value={query}
            maxLength={80}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {loading ? (
          <p className="mt-3 text-sm text-muted-foreground">Carregando alunos...</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="py-2">Aluno</th>
                  <th>Nível</th>
                  <th>XP</th>
                  <th>Sequência</th>
                  <th>Aulas</th>
                  <th>Palavras</th>
                  <th>Plano</th>
                  <th>Certificados</th>
                  <th>Último estudo</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-t border-border/70">
                    <td className="py-2">
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-muted-foreground">{s.email}</div>
                    </td>
                    <td>{s.level}</td>
                    <td>{s.xp}</td>
                    <td>{s.streak}</td>
                    <td>{s.lessons}</td>
                    <td>{s.words}</td>
                    <td className="capitalize">{s.plan}</td>
                    <td>{s.certificates}</td>
                    <td>{s.lastStudy ?? "—"}</td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr>
                    <td colSpan={9} className="py-4 text-sm text-muted-foreground">
                      Nenhum aluno encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="shadow-soft mt-5 rounded-3xl border border-border bg-card p-4">
        <h2 className="font-semibold">Enviar aviso aos alunos</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Título</Label>
            <Input
              value={draft.title}
              maxLength={80}
              placeholder="Nova aula disponível"
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Mensagem</Label>
            <Input
              value={draft.message}
              maxLength={200}
              placeholder="Hoje liberamos o módulo de entrevistas!"
              onChange={(e) => setDraft({ ...draft, message: e.target.value })}
            />
          </div>
        </div>
        <Button className="mt-3" onClick={() => void publishAnnouncement()}>
          Publicar aviso
        </Button>

        <ul className="mt-4 space-y-2">
          {announcements.map((a) => (
            <li key={a.id} className="flex items-center justify-between gap-3 rounded-2xl border border-border p-3">
              <div>
                <div className="text-sm font-medium">{a.title}</div>
                <div className="text-xs text-muted-foreground">{a.message}</div>
              </div>
              <Button size="sm" variant="outline" onClick={() => void toggleAnnouncement(a)}>
                {a.active ? "Desativar" : "Ativar"}
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}
