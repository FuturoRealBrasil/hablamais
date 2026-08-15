import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { CourseModule } from "@/components/course-module";
import { WORK_SITUATIONS } from "@/lib/courses";

export const Route = createFileRoute("/profissional")({
  head: () => ({
    meta: [
      { title: "Espanhol Profissional — Entrevistas, Reuniões, E-mails | Habla+" },
      {
        name: "description",
        content:
          "Módulo de espanhol para o trabalho: entrevista de emprego, e-mails, reuniões, apresentações, atendimento, negociação e vocabulário empresarial.",
      },
      { property: "og:title", content: "Espanhol Profissional | Habla+ Espanhol" },
      {
        property: "og:description",
        content: "Treine entrevistas, reuniões e negociações em espanhol com simulações guiadas por IA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfissionalPage,
});

function ProfissionalPage() {
  return (
    <AppShell>
      <CourseModule
        situations={WORK_SITUATIONS}
        eyebrow="💼 Curso temático"
        title="Espanhol Profissional"
        description="Do currículo à negociação: frases prontas, vocabulário empresarial e simulações de situações do trabalho."
      />
    </AppShell>
  );
}
