import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf, Users, Heart } from "lucide-react";

export const Route = createFileRoute("/wings")({
  head: () => ({
    meta: [
      { title: "Our Three Wings — Feathers Community Forum" },
      {
        name: "description",
        content:
          "Explore FEA, FESYA, and FESWA — the three wings of Feathers Community Forum driving entrepreneurship, youth empowerment, and social welfare.",
      },
      { property: "og:title", content: "Our Three Wings — Feathers Community Forum" },
      {
        property: "og:description",
        content:
          "FEA, FESYA, and FESWA — empowering entrepreneurs, youth, and social workers across India.",
      },
    ],
  }),
  component: WingsPage,
});

const wings = [
  {
    code: "FEA",
    name: "Feathers Entrepreneurs Association",
    desc: "Dedicated to nurturing entrepreneurs, startups, business owners, and aspiring innovators. It provides a platform for networking, mentorship, collaboration, and business growth.",
    icon: Leaf,
    accent: "green" as const,
    focus: [
      "Startup incubation and mentoring",
      "Business networking",
      "Leadership development",
      "Investment and funding guidance",
      "Business collaboration",
      "Innovation and enterprise development",
    ],
    link: "/fea",
  },
  {
    code: "FESYA",
    name: "Feathers Students & Youth Association",
    desc: "Empowers students and young professionals by providing opportunities for learning, leadership, career development, and social engagement.",
    icon: Users,
    accent: "gold" as const,
    focus: [
      "Student leadership",
      "Career guidance",
      "Internship opportunities",
      "Skill enhancement",
      "Innovation challenges",
      "Youth empowerment programs",
    ],
    link: "/fesya",
  },
  {
    code: "FESWA",
    name: "Feathers Social Workers Association",
    desc: "Brings together individuals committed to serving society through volunteerism, community welfare, environmental initiatives, and humanitarian activities.",
    icon: Heart,
    accent: "saffron" as const,
    focus: [
      "Community outreach",
      "Volunteer programs",
      "Disaster relief support",
      "Public awareness campaigns",
      "Social welfare initiatives",
      "Sustainable community development",
    ],
    link: "/feswa",
  },
];

const accentClasses = {
  green: {
    chip: "text-brand-green bg-brand-green/10",
    rule: "bg-brand-green",
    icon: "text-brand-green",
    button: "bg-brand-green text-brand-paper hover:bg-brand-green-deep",
  },
  saffron: {
    chip: "text-brand-saffron bg-brand-saffron/10",
    rule: "bg-brand-saffron",
    icon: "text-brand-saffron",
    button: "bg-brand-saffron text-white hover:bg-brand-saffron-soft",
  },
  gold: {
    chip: "text-brand-gold bg-brand-gold/10",
    rule: "bg-brand-gold",
    icon: "text-brand-gold",
    button: "bg-brand-gold text-brand-ink hover:bg-brand-gold/90",
  },
};

function WingsPage() {
  return (
    <div className="min-h-screen bg-brand-paper">
      <section className="px-6 pt-16 pb-24">
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="text-sm text-brand-green/70 hover:text-brand-green">
            ← Back to home
          </Link>

          <div className="mt-10 max-w-3xl animate-reveal-up">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-saffron">
              <span className="size-1.5 rounded-full bg-brand-saffron" />
              Our Wings
            </span>
            <h1 className="mt-6 font-serif text-5xl md:text-6xl font-medium tracking-tight leading-[1.05] text-balance">
              Our Three Wings
            </h1>
            <p className="mt-6 text-lg md:text-xl text-brand-ink/70 max-w-[60ch] leading-relaxed text-pretty">
              Feathers Community Forum operates through three specialized wings — each focused on a unique mission, yet united by a shared purpose: empowering people and transforming communities.
            </p>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-6">
            {wings.map((wing) => {
              const a = accentClasses[wing.accent];
              const Icon = wing.icon;
              return (
                <div
                  key={wing.code}
                  className="group bg-white rounded-2xl ring-1 ring-black/5 p-8 shadow-xl shadow-brand-ink/5 hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] ${a.chip}`}>
                      <span className={`size-1.5 rounded-full ${a.rule}`} />
                      {wing.code}
                    </span>
                    <Icon className={`w-6 h-6 ${a.icon}`} strokeWidth={1.5} />
                  </div>

                  <h2 className="font-serif text-2xl md:text-3xl font-medium tracking-tight text-brand-ink mb-4">
                    {wing.name}
                  </h2>
                  <p className="text-brand-ink/70 leading-relaxed mb-8 flex-grow">
                    {wing.desc}
                  </p>

                  <div className="mb-6">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-ink/50 mb-3">
                      Focus Areas
                    </h3>
                    <ul className="space-y-2">
                      {wing.focus.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-brand-ink/80">
                          <span className={`mt-1.5 size-1.5 rounded-full ${a.rule} shrink-0`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to={wing.link}
                    className={`inline-flex items-center justify-center w-full px-6 py-3 rounded-full font-medium transition-all ${a.button}`}
                  >
                    Know more
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
