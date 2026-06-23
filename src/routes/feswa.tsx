import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/module-page";
import { corporateSections, welfareMissionSection } from "@/lib/module-content";
import heroImg from "@/assets/group-community.jpg";

export const Route = createFileRoute("/feswa")({
  head: () => ({
    meta: [
      { title: "FESWA — Vanya" },
      { name: "description", content: "FESWA: Federation for Social Welfare & Advocacy — advancing community well-being, equity, and empowerment." },
      { property: "og:title", content: "FESWA — Vanya" },
      { property: "og:description", content: "A federation championing social welfare, equity, and community empowerment." },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: () => (
    <ModulePage
      code="FESWA"
      fullName="Federation for Social Welfare."
      tagline="Championing community well-being, equity, and empowerment — through advocacy, programs, and partnership with the people we serve."
      heroImage={heroImg}
      accent="saffron"
      sections={[welfareMissionSection, ...corporateSections]}
    />
  ),
});
