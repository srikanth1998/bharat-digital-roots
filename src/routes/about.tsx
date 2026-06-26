import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Feathers Community Forum" },
      {
        name: "description",
        content:
          "Feathers Community Forum is a purpose-driven platform empowering individuals and communities through entrepreneurship, skills, service, sustainability, and heritage revival.",
      },
      { property: "og:title", content: "About Feathers Community Forum" },
      {
        property: "og:description",
        content:
          "Who we are, our vision, mission, values and story — building empowered, compassionate and culturally rooted communities.",
      },
    ],
  }),
  component: AboutPage,
});

const values = [
  { title: "Empowerment", body: "We equip individuals and communities with the knowledge, confidence, and opportunities they need to grow and succeed." },
  { title: "Service", body: "We are committed to compassionate, people-centered action that responds to real community needs with dignity and purpose." },
  { title: "Integrity", body: "We uphold honesty, accountability, transparency, and trust in all our programs, relationships, and engagements." },
  { title: "Inclusiveness", body: "We create spaces where everyone — regardless of age, gender, background, or social status — has the opportunity to participate and benefit." },
  { title: "Innovation", body: "We encourage creative thinking and practical solutions that address social and economic challenges effectively." },
  { title: "Sustainability", body: "We are committed to protecting the environment, strengthening communities, and preserving cultural heritage for future generations." },
  { title: "Collaboration", body: "We believe shared effort creates deeper impact. We work with individuals, groups, institutions, and partners to achieve common goals." },
];

const differentiators = [
  "A community-first and people-centered approach",
  "A blend of empowerment, service, and sustainability",
  "Programs that combine practical support with long-term capacity building",
  "A platform that connects individuals to opportunities and action",
  "Strong emphasis on cultural identity, heritage, and belonging",
  "Partnership-friendly and volunteer-driven model",
];

const audiences = [
  "Youth and students",
  "Women and girls",
  "Entrepreneurs and small business owners",
  "Job seekers and young professionals",
  "Vulnerable individuals and families",
  "Community volunteers and grassroots leaders",
  "Creatives, artisans, and cultural advocates",
  "Environmentally conscious citizens and changemakers",
];

const howWeWork = [
  "Community training and workshops",
  "Mentorship and coaching",
  "Outreach campaigns and social support initiatives",
  "Environmental and civic engagement programs",
  "Opportunity sharing and referral networks",
  "Heritage events and cultural preservation activities",
  "Strategic partnerships and volunteer engagement",
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-saffron">
      <span className="size-1.5 rounded-full bg-brand-saffron" />
      {children}
    </span>
  );
}

function AboutPage() {
  return (
    <main className="bg-brand-paper text-brand-ink">
      {/* Hero */}
      <section className="px-6 py-16 lg:py-24">
        <div className="max-w-5xl mx-auto space-y-8 animate-reveal-up">
          <Link to="/" className="inline-block text-sm text-brand-green/70 hover:text-brand-green">← Back to home</Link>
          <SectionLabel>About Feathers Community Forum</SectionLabel>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight font-medium text-balance">
            A community built on{" "}
            <span className="italic text-brand-green">purpose</span>,
            service, and shared heritage.
          </h1>
          <p className="text-base lg:text-lg text-brand-ink/70 max-w-[68ch] leading-relaxed">
            Feathers Community Forum is a purpose-driven community platform
            committed to empowering individuals and transforming communities
            through entrepreneurship, skills development, opportunities,
            charity, environmental conservation, citizen-centered support, and
            heritage revival.
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="px-6 py-12 lg:py-20 border-t border-zinc-950/5">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[0.4fr_1fr] gap-10 lg:gap-16">
          <h2 className="font-serif text-3xl lg:text-4xl text-brand-green font-medium">Who We Are</h2>
          <div className="space-y-5 text-base lg:text-lg text-brand-ink/75 leading-relaxed max-w-[64ch]">
            <p>
              We exist to create a space where people are not only inspired to
              dream, but are equipped to act, lead, and contribute meaningfully
              to society. Our forum brings together youth, entrepreneurs,
              professionals, volunteers, local leaders, and community members
              who share a common desire to build stronger, more inclusive, and
              sustainable communities.
            </p>
            <p>
              At the heart of our work is a belief that communities grow when
              people are given the tools, support, and opportunities to shape
              their own future. That is why we focus on practical empowerment,
              collective action, and long-term impact.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="px-6 py-12 lg:py-20 border-t border-zinc-950/5">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-brand-green text-brand-paper p-8 lg:p-10 ring-1 ring-brand-green-deep/20">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-gold">Our Vision</p>
            <p className="font-serif text-2xl lg:text-3xl leading-snug mt-4">
              To build empowered, compassionate, innovative, and culturally
              rooted communities where people thrive through opportunity,
              service, sustainability, and shared responsibility.
            </p>
          </div>
          <div className="rounded-2xl bg-brand-paper-warm p-8 lg:p-10 ring-1 ring-black/5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-saffron">Our Mission</p>
            <p className="font-serif text-2xl lg:text-3xl leading-snug mt-4 text-brand-ink">
              To strengthen communities by promoting entrepreneurship, skills
              development, access to opportunities, charity and social
              support, environmental stewardship, citizen-centered services,
              and heritage preservation through collaboration, education, and
              action.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="px-6 py-12 lg:py-20 border-t border-zinc-950/5">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mb-12 space-y-4">
            <SectionLabel>Our Core Values</SectionLabel>
            <h2 className="font-serif text-3xl lg:text-4xl font-medium">
              The principles that anchor every program and partnership.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-950/5 ring-1 ring-zinc-950/5 rounded-2xl overflow-hidden">
            {values.map((v, i) => (
              <div key={v.title} className="bg-brand-paper p-7 lg:p-8 flex flex-col gap-3">
                <span className="font-serif text-xs text-brand-saffron tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif text-xl text-brand-green font-medium">{v.title}</h3>
                <p className="text-sm text-brand-ink/70 leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="px-6 py-12 lg:py-20 border-t border-zinc-950/5">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[0.4fr_1fr] gap-10 lg:gap-16">
          <h2 className="font-serif text-3xl lg:text-4xl text-brand-green font-medium">Our Story</h2>
          <div className="space-y-5 text-base lg:text-lg text-brand-ink/75 leading-relaxed max-w-[64ch]">
            <p>
              Feathers Community Forum was born out of the desire to create a
              platform where people, purpose, and progress come together. In
              many communities, talent exists but opportunities are limited,
              needs are visible but support systems are weak, and cultural
              values are fading under the pressure of change. Feathers
              Community Forum was created to respond to these realities.
            </p>
            <p>
              We are building a forum where entrepreneurship is nurtured,
              skills are strengthened, opportunities are shared, vulnerable
              groups are supported, the environment is protected, citizens are
              informed and empowered, and heritage is preserved with pride.
              Our work is rooted in the understanding that real transformation
              happens when people are connected, equipped, and inspired to act
              together.
            </p>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="px-6 py-12 lg:py-20 border-t border-zinc-950/5">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="max-w-3xl space-y-4">
            <SectionLabel>What Makes Us Different</SectionLabel>
            <h2 className="font-serif text-3xl lg:text-4xl font-medium">
              A holistic approach to community development.
            </h2>
            <p className="text-base text-brand-ink/70 leading-relaxed">
              Rather than focusing on one issue in isolation, we recognize
              that people and communities need support across multiple
              dimensions of life — economic, social, environmental, civic,
              and cultural.
            </p>
          </div>
          <ul className="grid md:grid-cols-2 gap-x-10 gap-y-4">
            {differentiators.map((d) => (
              <li key={d} className="flex gap-3 text-brand-ink/80">
                <span aria-hidden className="mt-2 size-1.5 rounded-full bg-brand-saffron shrink-0" />
                <span className="leading-relaxed">{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Who We Serve + How We Work */}
      <section className="px-6 py-12 lg:py-20 border-t border-zinc-950/5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 lg:gap-16">
          <div className="space-y-6">
            <SectionLabel>Who We Serve</SectionLabel>
            <h3 className="font-serif text-2xl lg:text-3xl font-medium">Our work is designed to benefit:</h3>
            <ul className="space-y-3">
              {audiences.map((a) => (
                <li key={a} className="flex gap-3 text-brand-ink/80">
                  <span aria-hidden className="mt-2 size-1.5 rounded-full bg-brand-green shrink-0" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-6">
            <SectionLabel>How We Work</SectionLabel>
            <h3 className="font-serif text-2xl lg:text-3xl font-medium">We deliver our impact through:</h3>
            <ul className="space-y-3">
              {howWeWork.map((a) => (
                <li key={a} className="flex gap-3 text-brand-ink/80">
                  <span aria-hidden className="mt-2 size-1.5 rounded-full bg-brand-gold shrink-0" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 lg:py-24 border-t border-zinc-950/5">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <SectionLabel>Be Part of the Movement</SectionLabel>
          <h2 className="font-serif text-3xl lg:text-5xl font-medium leading-tight text-balance">
            Building a future where communities are{" "}
            <span className="italic text-brand-green">empowered, connected,</span>{" "}
            and proud of their heritage.
          </h2>
          <p className="text-base lg:text-lg text-brand-ink/70 max-w-[60ch] mx-auto leading-relaxed">
            Join us as a member, volunteer, partner, donor, or supporter — and
            help shape stronger communities, together.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              to="/membership"
              className="inline-flex items-center gap-2 text-sm font-medium bg-brand-green text-brand-paper px-6 py-3 rounded-full hover:bg-brand-green-deep transition-all hover:-translate-y-0.5"
            >
              Become a Member
              <span aria-hidden>→</span>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-sm font-medium px-6 py-3 rounded-full ring-1 ring-brand-ink/15 hover:ring-brand-ink/30 transition-all"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
