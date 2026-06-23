import { createFileRoute, Link } from "@tanstack/react-router";
import heroGrain from "@/assets/hero-grain.jpg";
import storyAnanya from "@/assets/story-ananya.jpg";
import storyKala from "@/assets/story-kala.jpg";
import storyRajbir from "@/assets/story-rajbir.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vanya — Rooted in Indian Soil, Bound by Global Prosperity" },
      {
        name: "description",
        content:
          "A movement empowering Indian farmers, rural entrepreneurs, and village communities — bridging ancestral wisdom with world-class technology.",
      },
      { property: "og:title", content: "Vanya — Rooted in Indian Soil" },
      {
        property: "og:description",
        content:
          "Bridging ancestral village wisdom with modern entrepreneurship across Bharat.",
      },
      { property: "og:image", content: heroGrain },
      { name: "twitter:image", content: heroGrain },
    ],
  }),
  component: Index,
});

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <span
        aria-hidden
        className="inline-block size-2.5 rounded-full bg-brand-saffron ring-4 ring-brand-saffron/15 transition-all group-hover:ring-brand-saffron/30"
      />
      <span className="font-serif text-xl tracking-tight text-brand-green font-semibold">
        Vanya
      </span>
    </Link>
  );
}

const navLinks = [
  { to: "/about-founder", label: "About Founder" },
  { to: "/contact", label: "Contact Us" },
  { to: "/membership", label: "Membership Registration" },
] as const;

const homeModules = [
  { to: "/fea", code: "FEA", desc: "Group of Companies" },
  { to: "/feswa", code: "FESWA", desc: "Social Welfare Federation" },
  { to: "/fesya", code: "FESYA", desc: "Youth & Enterprise" },
] as const;

function HomeMenu() {
  return (
    <div className="relative group">
      <Link
        to="/"
        activeOptions={{ exact: true }}
        activeProps={{ className: "text-brand-green" }}
        inactiveProps={{ className: "text-brand-ink/60 group-hover:text-brand-ink" }}
        className="text-sm font-medium transition-colors inline-flex items-center gap-1"
      >
        Home Page
        <span aria-hidden className="text-[10px] opacity-60">▾</span>
      </Link>
      {/* hover bridge */}
      <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-72 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
        <div className="bg-brand-paper/95 backdrop-blur-xl ring-1 ring-black/10 rounded-2xl shadow-2xl shadow-brand-ink/15 p-2">
          {homeModules.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl hover:bg-brand-paper-warm transition-colors group/item"
            >
              <div>
                <p className="font-serif text-lg font-semibold text-brand-green leading-none">{m.code}</p>
                <p className="text-xs text-brand-ink/55 mt-1">{m.desc}</p>
              </div>
              <span aria-hidden className="text-brand-saffron opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-brand-paper/75 backdrop-blur-md border-b border-zinc-950/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <Logo />
        <div className="hidden md:flex items-center gap-7">
          <HomeMenu />
          {navLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: true }}
              activeProps={{ className: "text-brand-green" }}
              inactiveProps={{ className: "text-brand-ink/60 hover:text-brand-ink" }}
              className="text-sm font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <Link
          to="/login"
          className="text-sm font-medium bg-brand-green text-brand-paper px-5 py-2 rounded-full ring-1 ring-brand-green hover:bg-brand-green-deep transition-all hover:-translate-y-0.5"
        >
          Login Portal
        </Link>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="py-12 lg:py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-16 items-end">
          <div className="space-y-8 animate-reveal-up">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-saffron">
              <span className="size-1.5 rounded-full bg-brand-saffron" />
              A Movement for Bharat
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl leading-[1.02] text-balance font-medium tracking-tight">
              Rooted in Indian Soil,
              <br />
              Bound by Global{" "}
              <span className="italic text-brand-green">Prosperity.</span>
            </h1>
            <p className="text-lg lg:text-xl text-brand-ink/70 max-w-[52ch] text-pretty leading-relaxed">
              We are bridge-builders between the ancestral wisdom of our
              villages and the frontier of modern entrepreneurship — empowering
              farmers, founders, and communities across India.
            </p>
            <div className="flex flex-wrap items-center gap-5">
              <a
                href="#story"
                className="inline-flex items-center gap-2 bg-brand-saffron text-white py-3 px-6 rounded-full font-medium text-sm ring-1 ring-brand-saffron hover:shadow-xl hover:shadow-brand-saffron/20 hover:-translate-y-0.5 transition-all"
              >
                Explore Our Story
                <span aria-hidden>→</span>
              </a>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-ink/40">
                Est. 2024 • Bharat
              </span>
            </div>
          </div>
          <div className="relative animate-fade-in">
            <img
              src={heroGrain}
              alt="Hands cupping wheat grain at sunset in a rural Indian field"
              width={1088}
              height={1344}
              className="w-full aspect-[4/5] object-cover rounded-2xl shadow-2xl shadow-brand-ink/10 ring-1 ring-black/5"
            />
            <div className="absolute -bottom-6 -left-6 bg-brand-paper/80 backdrop-blur-xl p-6 ring-1 ring-black/5 rounded-xl max-w-xs hidden md:block shadow-xl">
              <p className="font-serif italic text-brand-green text-lg leading-snug">
                “The future of innovation isn't just in our cities — it's in
                our soil.”
              </p>
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-ink/40">
                — Vanya Manifesto
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const pillars = [
  {
    swatch: "bg-brand-green",
    bg: "bg-brand-green/5",
    title: "Regenerative Agriculture",
    body: "Empowering 10,000+ farmers with climate-resilient techniques that preserve heritage seeds, soil, and seasonal wisdom.",
  },
  {
    swatch: "bg-brand-saffron",
    bg: "bg-brand-saffron/10",
    title: "Rural Micro-Ventures",
    body: "Scaling village-born startups through patient capital, world-class digital mentorship, and global market access.",
  },
  {
    swatch: "bg-brand-gold",
    bg: "bg-brand-gold/10",
    title: "Community Commons",
    body: "A trusted digital fabric for shared resources, collective trade, and the panchayat reborn for a connected era.",
  },
];

function Pillars() {
  return (
    <section
      id="agriculture"
      className="py-24 bg-brand-paper-warm/60 border-y border-zinc-950/5"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-ink/40">
            Three Pillars
          </span>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl font-medium tracking-tight text-balance">
            Where ancestral wisdom meets modern scaffolding.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-px bg-zinc-200/70 ring-1 ring-zinc-950/5 rounded-2xl overflow-hidden">
          {pillars.map((p, i) => (
            <div
              key={p.title}
              className="bg-brand-paper p-10 space-y-6 group hover:bg-brand-paper-warm/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`size-10 ${p.bg} rounded-full flex items-center justify-center`}
                >
                  <div className={`size-4 ${p.swatch} rounded-sm`} />
                </div>
                <span className="font-serif text-sm text-brand-ink/30 tabular-nums">
                  0{i + 1}
                </span>
              </div>
              <h3 className="font-serif text-2xl font-medium tracking-tight">
                {p.title}
              </h3>
              <p className="text-sm leading-relaxed text-brand-ink/60 max-w-[40ch] text-pretty">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const metrics = [
  { value: "124k", label: "Acres Restored", color: "text-brand-green" },
  { value: "₹12 Cr", label: "Capital Deployed", color: "text-brand-saffron" },
  { value: "850+", label: "Entrepreneurs", color: "text-brand-gold" },
  { value: "14", label: "States Reached", color: "text-brand-ink" },
];

function Metrics() {
  return (
    <section id="impact" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 w-full text-center md:text-left">
          {metrics.map((m) => (
            <div key={m.label} className="space-y-2">
              <span
                className={`block font-serif text-5xl md:text-6xl ${m.color} font-medium tracking-tight`}
              >
                {m.value}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-ink/40">
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const stories = [
  {
    img: storyAnanya,
    location: "Ananya, Telangana",
    title: "The Seed Guardian",
    body: "How Ananya revived three extinct millet varieties in her village — and built a co-op around them.",
  },
  {
    img: storyKala,
    location: "Kala Collective, Odisha",
    title: "Hyperlocal Commerce",
    body: "Bridging the gap between tribal weavers and global luxury markets, one block-print at a time.",
  },
  {
    img: storyRajbir,
    location: "Rajbir, Punjab",
    title: "Legacy Transformed",
    body: "Integrating IoT sensors into 50-year-old family farming traditions without losing the rhythm of the land.",
  },
];

function Stories() {
  return (
    <section id="story" className="py-24 px-6 bg-brand-ink text-brand-paper">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <h2 className="font-serif text-3xl md:text-5xl font-medium max-w-[15ch] leading-tight tracking-tight">
            Voices from the ground.
          </h2>
          <a
            href="#"
            className="text-sm font-medium border-b border-brand-paper/20 pb-1 hover:border-brand-paper transition-colors self-start md:self-auto"
          >
            View Archive →
          </a>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((s) => (
            <article key={s.title} className="group space-y-6">
              <div className="relative overflow-hidden rounded-xl ring-1 ring-white/10">
                <img
                  src={s.img}
                  alt={s.title}
                  width={800}
                  height={1024}
                  loading="lazy"
                  className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">
                    {s.location}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-serif text-xl font-medium">{s.title}</h4>
                <p className="text-sm text-brand-paper/60 text-pretty leading-relaxed">
                  {s.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="join" className="py-32 px-6">
      <div className="max-w-3xl mx-auto text-center space-y-10">
        <h2 className="font-serif text-4xl lg:text-5xl font-medium leading-tight text-balance italic text-brand-green">
          The journey of a thousand harvests begins with a single seed.
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#"
            className="w-full sm:w-auto bg-brand-green text-brand-paper px-8 py-3.5 rounded-full font-medium ring-1 ring-brand-green hover:shadow-xl hover:shadow-brand-green/20 hover:-translate-y-0.5 transition-all"
          >
            Become a Partner
          </a>
          <a
            href="#"
            className="w-full sm:w-auto bg-transparent text-brand-ink px-8 py-3.5 rounded-full font-medium ring-1 ring-zinc-950/10 hover:bg-zinc-100 transition-colors"
          >
            Read the Manifesto
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-zinc-950/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-4">
          <Logo />
          <p className="text-xs text-zinc-500 uppercase tracking-[0.2em]">
            © 2024 Vanya Collective. Built for Bharat.
          </p>
        </div>
        <div className="flex gap-8 text-sm font-medium text-zinc-500">
          <a href="#" className="hover:text-brand-green transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-brand-green transition-colors">
            Ethics
          </a>
          <a href="#" className="hover:text-brand-green transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-brand-paper font-sans text-brand-ink">
      <Nav />
      <main>
        <Hero />
        <Pillars />
        <Metrics />
        <Stories />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
