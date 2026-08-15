import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { CourseModule } from "@/components/course-module";
import { TRAVEL_SITUATIONS } from "@/lib/courses";

export const Route = createFileRoute("/viagens")({
  head: () => ({
    meta: [
      { title: "Espanhol para Viajar — Aeroporto, Hotel, Táxi | Habla+" },
      {
        name: "description",
        content:
          "Curso de espanhol para viagens: aeroporto, imigração, hotel, táxi, restaurante, mercado, compras, emergências, direções e transporte, com simulações interativas.",
      },
      { property: "og:title", content: "Espanhol para Viajar | Habla+ Espanhol" },
      {
        property: "og:description",
        content: "Frases essenciais, áudio e simulações com IA para todas as situações da sua viagem.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ViagensPage,
});

function ViagensPage() {
  return (
    <AppShell>
      <CourseModule
        situations={TRAVEL_SITUATIONS}
        eyebrow="🧳 Curso temático"
        title="Espanhol para Viajar"
        description="Dez situações reais de viagem com frases, áudio, vocabulário e simulação interativa com o professor de IA."
      />
    </AppShell>
  );
}
