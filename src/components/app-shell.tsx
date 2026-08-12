import { Link } from "@tanstack/react-router";
import { BookOpen, Home, User } from "lucide-react";
import type { ReactNode } from "react";

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
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="bg-soft min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Logo />
          <nav className="hidden items-center gap-1 sm:flex">
            {NAV.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: to === "/" }}
                activeProps={{ className: "bg-secondary text-secondary-foreground" }}
                className="flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-28 pt-6 sm:pb-14">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur sm:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {NAV.map(({ to, label, icon: Icon }) => (
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
