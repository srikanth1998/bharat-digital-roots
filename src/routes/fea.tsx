import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/module-page";
import { corporateSections, welfareMissionSection } from "@/lib/module-content";
import heroImg from "@/assets/group-collab.jpg";

export const Route = createFileRoute("/fea")({
  head: () => ({
    meta: [
      { title: "FEA — Vanya" },
      { name: "description", content: "FEA: A globally recognized group of companies committed to excellence, innovation, and sustainable growth across industries." },
      { property: "og:title", content: "FEA — Vanya" },
      { property: "og:description", content: "Excellence, innovation, sustainability — across every industry we serve." },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: () => (
    <ModulePage
      code="FEA"
      fullName="FEA Group of Companies."
      tagline="A globally recognized collective driving excellence, innovation, and sustainable growth — across every industry we touch."
      heroImage={heroImg}
      accent="green"
      sections={[...corporateSections, welfareMissionSection]}
    />
  ),
});
