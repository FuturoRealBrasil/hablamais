import { Link, useNavigate } from "@tanstack/react-router";
import { BarChart3, BookMarked, BookOpen, Briefcase, CalendarClock, Dumbbell, GraduationCap, HelpCircle, Home, Layers, LogIn, LogOut, MessagesSquare, Mic, Plane, SpellCheck, Sparkles, Trophy, User } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/lib/progress-store";


export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="bg-sun flex h-9 w-9 items-center justify-center rounded-xl text-primary-foreground shadow-lift">
        <span className="font-display text-lg leading-none">H</span>
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="font-display block text-lg font-semibold">Habla+ Espanhol</span>
          <span className="block text-[11px] text-muted-foreground">Seu professor de espanhol com IA</span>
        </span>
      )}
    </Link>
  );
}

const NAV = [
  { to: "/", label: "Início", icon: Home },
  { to: "/aulas", label: "Aulas", icon: BookOpen },
  { to: "/exercicios", label: "Exercícios", icon: Dumbbell },
  { to: "/revisao", label: "Revisão", icon: Sparkles },
  { to: "/conversar", label: "Conversar", icon: MessagesSquare },
  { to: "/professor", label: "Professor", icon: HelpCircle },
  { to: "/dicionario", label: "Dicionário", icon: BookMarked },
  { to: "/plano", label: "Plano", icon: CalendarClock },
  { to: "/relatorio", label: "Relatório", icon: BarChart3 },
  { to: "/viagens", label: "Viagens", icon: Plane },
  { to: "/profissional", label: "Trabalho", icon: Briefcase },
  { to: "/conquistas", label: "Conquistas", icon: Trophy },
  { to: "/pronuncia", label: "Pronúncia", icon: Mic },
  { to: "/vocabulario", label: "Vocabulário", icon: Layers },
  { to: "/gramatica", label: "Gramática", icon: SpellCheck },
  { to: "/nivelamento", label: "Nível", icon: GraduationCap },
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

const MOBILE_KEYS = ["/", "/aulas", "/exercicios", "/revisao", "/conquistas", "/perfil"] as string[];
const MOBILE_NAV = NAV.filter((item) => MOBILE_KEYS.includes(item.to));


export function AccountButton() {
  const { userId, authEmail, syncing, signOut } = useProgress();
  const navigate = useNavigate();

  if (!userId) {
    return (
      <Button size="sm" variant="outline" className="shrink-0 gap-1" onClick={() => navigate({ to: "/entrar" })}>
        <LogIn className="h-4 w-4" /> Entrar
      </Button>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-2">
      <span className="hidden max-w-[140px] truncate text-xs text-muted-foreground md:block">
        {syncing ? "Sincronizando..." : authEmail}
      </span>
      <Button
        size="sm"
        variant="ghost"
        className="gap-1"
        onClick={async () => {
          await signOut();
          navigate({ to: "/entrar", replace: true });
        }}
      >
        <LogOut className="h-4 w-4" /> Sair
      </Button>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="bg-soft min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-3">
          <Logo />
          <nav className="hidden max-w-[55%] items-center gap-0.5 overflow-x-auto sm:flex">
            {NAV.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: to === "/" }}
                activeProps={{ className: "bg-secondary text-secondary-foreground" }}
                className="flex shrink-0 items-center gap-1 rounded-full px-2 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
          <AccountButton />
        </div>
      </header>


      <main className="mx-auto max-w-5xl px-4 pb-28 pt-6 sm:pb-14">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur sm:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {MOBILE_NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              activeProps={{ className: "text-primary" }}
              className="flex flex-1 flex-col items-center gap-1 rounded-lg py-1 text-[11px] font-medium text-muted-foreground"
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
