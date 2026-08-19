import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

let deferredPrompt: InstallPromptEvent | null = null;

/** Captura o evento de instalação do Chrome/Android e expõe o estado para a UI. */
export function useInstallApp() {
  const [available, setAvailable] = useState(Boolean(deferredPrompt));
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setInstalled(window.matchMedia("(display-mode: standalone)").matches);

    function onPrompt(event: Event) {
      event.preventDefault();
      deferredPrompt = event as InstallPromptEvent;
      setAvailable(true);
    }
    function onInstalled() {
      deferredPrompt = null;
      setAvailable(false);
      setInstalled(true);
    }

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install() {
    if (!deferredPrompt) return "unavailable" as const;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    deferredPrompt = null;
    setAvailable(false);
    return choice.outcome;
  }

  return { available, installed, install };
}

export function InstallAppCard() {
  const { available, installed, install } = useInstallApp();
  const [hint, setHint] = useState(false);

  if (installed) return null;

  return (
    <div className="shadow-soft rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 font-semibold">
        <Download className="h-4 w-4 text-primary" /> Instalar o Habla+ no celular
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Tenha o app na tela inicial, abrindo em tela cheia como um aplicativo nativo.
      </p>
      <Button
        size="sm"
        className="mt-3"
        onClick={async () => {
          const result = await install();
          if (result === "unavailable") setHint(true);
        }}
      >
        {available ? "Instalar aplicativo" : "Como instalar"}
      </Button>
      {(hint || !available) && (
        <p className="mt-2 text-[11px] text-muted-foreground">
          No Android (Chrome): menu ⋮ → “Instalar aplicativo”. No iPhone (Safari): compartilhar → “Adicionar à Tela de Início”.
        </p>
      )}
    </div>
  );
}
