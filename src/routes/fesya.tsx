import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/module-page";
import { corporateSections } from "@/lib/module-content";
import heroImg from "@/assets/group-youth.jpg";

export const Route = createFileRoute("/fesya")({
  head: () => ({
    meta: [
      { title: "FESYA — Vanya" },
      { name: "description", content: "FESYA: Empowering youth and enterprise through excellence, innovation, collaboration, and sustainability." },
      { property: "og:title", content: "FESYA — Vanya" },
      { property: "og:description", content: "Excellence, innovation, and sustainability — for the next generation of Bharat." },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: () => (
    <ModulePage
      code="FESYA"
      fullName="FESYA Group of Companies."
      tagline="Empowering the next generation of enterprise — strategic, collaborative, and built for sustainable global excellence."
      heroImage={heroImg}
      accent="gold"
      sections={corporateSections}
    />
  ),
});
