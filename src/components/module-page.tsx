import { Link } from "@tanstack/react-router";

export type ModuleSection =
  | { kind: "rich"; heading: string; lead?: string; paragraphs?: string[] }
  | { kind: "values"; heading: string; items: { title: string; body: string }[] }
  | { kind: "list"; heading: string; lead?: string; items: string[] }
  | { kind: "mission"; heading: string; lead: string; items: { title: string; body: string }[] };

export interface ModulePageProps {
  code: string;
  fullName: string;
  tagline: string;
  heroImage: string;
  accent: "green" | "saffron" | "gold";
  sections: ModuleSection[];
}

const accentClasses = {
  green: {
    chip: "text-brand-green bg-brand-green/10",
    title: "text-brand-green",
    rule: "bg-brand-green",
    bullet: "bg-brand-green",
  },
  saffron: {
    chip: "text-brand-saffron bg-brand-saffron/10",
    title: "text-brand-saffron",
    rule: "bg-brand-saffron",
    bullet: "bg-brand-saffron",
  },
  gold: {
    chip: "text-brand-gold bg-brand-gold/10",
    title: "text-brand-green",
    rule: "bg-brand-gold",
    bullet: "bg-brand-gold",
  },
};

export function ModulePage({ code, fullName, tagline, heroImage, accent, sections }: ModulePageProps) {
  const a = accentClasses[accent];

  return (
    <div className="min-h-screen bg-brand-paper">
      {/* Hero */}
      <section className="relative px-6 pt-16 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="text-sm text-brand-green/70 hover:text-brand-green">
            ← Back to home
          </Link>

          <div className="mt-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            <div className="space-y-6 animate-reveal-up">
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] ${a.chip}`}>
                <span className={`size-1.5 rounded-full ${a.rule}`} />
                {code}
              </span>
              <h1 className="font-serif text-5xl md:text-7xl font-medium tracking-tight leading-[1.02] text-balance">
                {fullName}
              </h1>
              <p className="text-lg md:text-xl text-brand-ink/70 max-w-[52ch] leading-relaxed text-pretty">
                {tagline}
              </p>
            </div>
            <div className="relative">
              <img
                src={heroImage}
                alt={`${code} hero`}
                width={1280}
                height={800}
                className="w-full aspect-[4/3] object-cover rounded-2xl shadow-2xl shadow-brand-ink/15 ring-1 ring-black/5"
              />
              <div className={`absolute -bottom-6 -right-6 font-serif text-[7rem] leading-none italic ${a.title} opacity-15 select-none hidden md:block`}>
                {code}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sections */}
      <div className="max-w-5xl mx-auto px-6 py-16 space-y-24">
        {sections.map((s, i) => (
          <Section key={i} section={s} accent={accent} index={i} />
        ))}
      </div>

      {/* Footer CTA */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto rounded-2xl bg-brand-ink text-brand-paper p-12 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight leading-snug text-balance">
            Be part of the <span className="italic">{code}</span> chapter.
          </h2>
          <p className="mt-4 text-brand-paper/60 max-w-xl mx-auto">
            Join a movement that builds tomorrow's Bharat through excellence, integrity, and community.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/membership"
              className="w-full sm:w-auto bg-brand-saffron text-white px-8 py-3 rounded-full font-medium hover:shadow-xl hover:shadow-brand-saffron/20 hover:-translate-y-0.5 transition-all"
            >
              Register as Member
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto bg-transparent text-brand-paper px-8 py-3 rounded-full font-medium ring-1 ring-white/20 hover:bg-white/5 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Section({ section, accent, index }: { section: ModuleSection; accent: ModulePageProps["accent"]; index: number }) {
  const a = accentClasses[accent];

  const header = (
    <div className="flex items-baseline gap-4 mb-8">
      <span className="font-serif text-sm text-brand-ink/30 tabular-nums">0{index + 1}</span>
      <span className={`h-px flex-1 ${a.rule} opacity-30`} />
      <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight">{section.heading}</h2>
    </div>
  );

  if (section.kind === "rich") {
    return (
      <section>
        {header}
        {section.lead && <p className="font-serif italic text-xl text-brand-green/90 leading-relaxed mb-6 max-w-3xl">{section.lead}</p>}
        {section.paragraphs?.map((p, i) => (
          <p key={i} className="text-brand-ink/75 leading-relaxed text-lg mb-5 max-w-3xl">{p}</p>
        ))}
      </section>
    );
  }

  if (section.kind === "values") {
    return (
      <section>
        {header}
        <div className="grid md:grid-cols-2 gap-px bg-zinc-200/60 ring-1 ring-zinc-950/5 rounded-2xl overflow-hidden">
          {section.items.map((it) => (
            <div key={it.title} className="bg-brand-paper p-8 space-y-3">
              <h3 className={`font-serif text-xl font-medium ${a.title}`}>{it.title}</h3>
              <p className="text-brand-ink/70 leading-relaxed text-sm">{it.body}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (section.kind === "list") {
    return (
      <section>
        {header}
        {section.lead && <p className="text-brand-ink/70 leading-relaxed text-lg mb-8 max-w-3xl">{section.lead}</p>}
        <ul className="grid md:grid-cols-2 gap-3">
          {section.items.map((it) => (
            <li key={it} className="flex items-center gap-3 bg-brand-paper-warm/50 ring-1 ring-black/5 rounded-xl px-5 py-4">
              <span className={`size-2 rounded-full ${a.bullet}`} />
              <span className="text-brand-ink/85 font-medium">{it}</span>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  // mission
  return (
    <section>
      {header}
      <p className="font-serif italic text-xl text-brand-green/90 leading-relaxed mb-8 max-w-3xl">{section.lead}</p>
      <div className="space-y-5">
        {section.items.map((it) => (
          <div key={it.title} className="border-l-2 pl-6 max-w-3xl" style={{ borderColor: "color-mix(in oklab, var(--color-brand-saffron) 60%, transparent)" }}>
            <h4 className="font-serif text-lg font-medium text-brand-green">{it.title}</h4>
            <p className="mt-1 text-brand-ink/70 leading-relaxed">{it.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
