import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import heroGrain from "@/assets/hero-grain.jpg";
import heroFounder from "@/assets/hero-founder-kids.jpeg.asset.json";
import feathersLogo from "@/assets/feathers-logo-black.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Feathers Community Forum — Empowering People, Building Bharat" },
      {
        name: "description",
        content:
          "Feathers Community Forum, founded by AKR Kali, is a platform for entrepreneurship, training, networking, and community service across India.",
      },
      { property: "og:title", content: "Feathers Community Forum" },
      {
        property: "og:description",
        content:
          "A platform to discuss, promote, and collaborate on entrepreneurial ventures, community service, and skill-building initiatives.",
      },
      { property: "og:image", content: heroGrain },
      { name: "twitter:image", content: heroGrain },
    ],
  }),
  component: Index,
});

function Logo() {
  return (
    <Link to="/" className="flex items-center group" aria-label="Feathers Community Forum International — Home">
      <img
        src={feathersLogo.url}
        alt="Feathers Community Forum International"
        className="h-32 w-auto md:h-40 object-contain transition-opacity group-hover:opacity-90"
      />
    </Link>
  );
}

const navLinks = [
  { to: "/about", label: "About Us" },
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
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        className="text-sm font-medium transition-colors inline-flex items-center gap-1 text-brand-ink/60 hover:text-brand-ink"
      >
        Home Page
        <span aria-hidden className="text-[10px] opacity-60">
          ▾
        </span>
      </button>
      <div
        className={`absolute left-1/2 -translate-x-1/2 top-full pt-3 w-72 transition-all duration-200 z-50 ${
          open ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-1"
        }`}
      >
        <div className="bg-brand-paper/95 backdrop-blur-xl ring-1 ring-black/10 rounded-2xl shadow-2xl shadow-brand-ink/15 p-2">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-brand-paper-warm transition-colors"
          >
            <p className="text-sm font-medium text-brand-ink/80">Home Page</p>
          </Link>
          {homeModules.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl hover:bg-brand-paper-warm focus:bg-brand-paper-warm focus:outline-none transition-colors group/item"
            >
              <div>
                <p className="font-serif text-lg font-semibold text-brand-green leading-none">{m.code}</p>
                <p className="text-xs text-brand-ink/55 mt-1">{m.desc}</p>
              </div>
              <span
                aria-hidden
                className="text-brand-saffron opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all"
              >
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const close = () => setMobileOpen(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-brand-paper/75 backdrop-blur-md border-b border-zinc-950/5">
      <div className="max-w-7xl mx-auto px-6 h-36 md:h-44 flex items-center justify-between gap-6">
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

        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="hidden md:inline-flex text-sm font-medium bg-brand-green text-brand-paper px-5 py-2 rounded-full ring-1 ring-brand-green hover:bg-brand-green-deep transition-all hover:-translate-y-0.5"
          >
            Login Portal
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="md:hidden inline-flex items-center justify-center size-10 -mr-2 rounded-lg text-brand-ink hover:bg-brand-paper-warm transition-colors"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {mobileOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <>
                  <path d="M3 6h18" />
                  <path d="M3 12h18" />
                  <path d="M3 18h18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-zinc-950/5 bg-brand-paper/95 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col">
            <Link
              to="/"
              onClick={close}
              className="py-2.5 text-sm font-medium text-brand-ink/80 hover:text-brand-green"
            >
              Home Page
            </Link>
            {homeModules.map((m) => (
              <Link
                key={m.to}
                to={m.to}
                onClick={close}
                className="py-2.5 pl-4 text-sm text-brand-ink/70 hover:text-brand-green"
              >
                <span className="font-semibold text-brand-green">{m.code}</span> · {m.desc}
              </Link>
            ))}
            {navLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={close}
                className="py-2.5 text-sm font-medium text-brand-ink/80 hover:text-brand-green"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={close}
              className="mt-3 inline-flex items-center justify-center text-sm font-medium bg-brand-green text-brand-paper px-5 py-2.5 rounded-full hover:bg-brand-green-deep transition-colors"
            >
              Login Portal
            </Link>
          </div>
        </div>
      )}
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
              Welcome to Feathers Community Forum
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-balance font-medium tracking-tight">
              Empowering People.
              <br />
              Building Communities.
              <br />
              Reviving <span className="italic text-brand-green">Heritage.</span>
            </h1>
            <div className="space-y-5 text-base lg:text-lg text-brand-ink/70 max-w-[58ch] text-pretty leading-relaxed">
              <p>
                Feathers Community Forum is a community-driven platform dedicated to empowering individuals and
                transforming communities through innovation, service, sustainability, and cultural renewal. We bring
                together people, ideas, and action to create meaningful opportunities, support vulnerable groups,
                strengthen livelihoods, protect the environment, and preserve the heritage that shapes our identity.
              </p>
              <p>
                We believe strong communities are built when people are equipped with the right skills, connected to
                opportunities, inspired to serve, and rooted in values that sustain collective progress — building a
                future that is more inclusive, resilient, compassionate, and self-reliant.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <Link
                to="/membership"
                className="inline-flex items-center gap-2 bg-brand-saffron text-white py-3 px-6 rounded-full font-medium text-sm ring-1 ring-brand-saffron hover:shadow-xl hover:shadow-brand-saffron/20 hover:-translate-y-0.5 transition-all"
              >
                Join the Forum
                <span aria-hidden>→</span>
              </Link>
              <Link
                to="/about-founder"
                className="text-sm font-medium text-brand-ink/70 hover:text-brand-green border-b border-brand-ink/20 hover:border-brand-green pb-0.5 transition-colors"
              >
                Meet the Founder →
              </Link>
            </div>
          </div>
          <div className="relative animate-fade-in">
            <img
              src={heroFounder.url}
              alt="AKR Kali planting a sapling with two children holding the Feathers Community Forum sign"
              width={1088}
              height={1240}
              className="w-full aspect-[7/8] object-cover object-top rounded-2xl shadow-2xl shadow-brand-ink/10 ring-1 ring-black/5"
            />
            <div className="absolute -bottom-6 -left-6 bg-brand-paper/80 backdrop-blur-xl p-6 ring-1 ring-black/5 rounded-xl max-w-xs hidden md:block shadow-xl">
              <p className="font-serif italic text-brand-green text-lg leading-snug">
                “We rise by lifting the community we belong to.”
              </p>
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-ink/60">
                — AKR Kali, Founder
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
    swatch: "bg-brand-saffron",
    bg: "bg-brand-saffron/10",
    title: "Entrepreneurship Development",
    tag: "FEA",
    body: "Supporting aspiring entrepreneurs, startups, and small businesses with mentorship, business learning, and innovation support.",
  },
  {
    swatch: "bg-brand-green",
    bg: "bg-brand-green/5",
    title: "Skills Development",
    tag: "FESH",
    body: "Equipping youth, women, and community members with practical, professional, and life skills for growth and self-reliance.",
  },
  {
    swatch: "bg-brand-gold",
    bg: "bg-brand-gold/10",
    title: "Opportunities Hub",
    tag: "FESY",
    body: "Connecting people to scholarships, jobs, grants, internships, training, fellowships, and leadership opportunities.",
  },
  {
    swatch: "bg-brand-saffron",
    bg: "bg-brand-saffron/10",
    title: "Charity & Community Support",
    tag: "FESWA",
    body: "Providing practical support to vulnerable individuals and families through outreach, donations, and community care initiatives.",
  },
  {
    swatch: "bg-brand-green",
    bg: "bg-brand-green/5",
    title: "Earth Conservation",
    tag: "FESWA",
    body: "Promoting environmental awareness, tree planting, clean-up campaigns, and sustainable community practices.",
  },
  {
    swatch: "bg-brand-gold",
    bg: "bg-brand-gold/10",
    title: "Citizen-Centric Services",
    tag: "FESWA",
    body: "Creating people-first support systems through civic awareness, community information, engagement, and access to essential services.",
  },
  {
    swatch: "bg-brand-saffron",
    bg: "bg-brand-saffron/10",
    title: "Heritage Revival",
    tag: "FESWA",
    body: "Preserving and celebrating culture, traditions, local stories, arts, and community identity for present and future generations.",
  },
];


function Pillars() {
  return (
    <section id="pillars" className="py-24 bg-brand-paper-warm/60 border-y border-zinc-950/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-ink/60">What We Do</span>
          <h2 className="mt-4 font-serif text-2xl md:text-4xl font-medium tracking-tight text-balance">
            Our work is centered around seven key areas of community transformation.
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-200/70 ring-1 ring-zinc-950/5 rounded-2xl overflow-hidden">
          {pillars.map((p, i) => (
            <div
              key={p.title}
              className="bg-brand-paper p-10 space-y-6 group hover:bg-brand-paper-warm/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className={`size-10 ${p.bg} rounded-full flex items-center justify-center`}>
                  <div className={`size-4 ${p.swatch} rounded-sm`} />
                </div>
                <span className="font-serif text-sm text-brand-ink/30 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="font-serif text-2xl font-medium tracking-tight">{p.title}</h3>
              <p className="text-sm leading-relaxed text-brand-ink/60 max-w-[40ch] text-pretty">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const metrics = [
  { value: "7,000+", label: "Training Hours", color: "text-brand-green" },
  { value: "10+", label: "Companies", color: "text-brand-saffron" },
  { value: "1,800+", label: "Opportunities", color: "text-brand-gold" },
  { value: "₹20 Cr", label: "Charity", color: "text-brand-ink" },
];

function Metrics() {
  return (
    <section id="impact" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 w-full text-center md:text-left">
          {metrics.map((m) => (
            <div key={m.label} className="space-y-2">
              <span className={`block font-serif text-5xl md:text-6xl ${m.color} font-medium tracking-tight`}>
                {m.value}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-ink/60">{m.label}</span>
            </div>
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
          Be part of a community that builds, mentors, and lifts.
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/membership"
            className="w-full sm:w-auto bg-brand-green text-brand-paper px-8 py-3.5 rounded-full font-medium ring-1 ring-brand-green hover:shadow-xl hover:shadow-brand-green/20 hover:-translate-y-0.5 transition-all"
          >
            Become a Member
          </Link>
          <Link
            to="/contact"
            className="w-full sm:w-auto bg-transparent text-brand-ink px-8 py-3.5 rounded-full font-medium ring-1 ring-zinc-950/10 hover:bg-zinc-100 transition-colors"
          >
            Contact the Forum
          </Link>
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
          <p className="text-xs text-zinc-500 uppercase tracking-[0.2em]">© 2026 Feathers Community Forum.</p>
        </div>
        <div className="flex gap-8 text-sm font-medium text-zinc-500">
          <Link to="/about-founder" className="hover:text-brand-green transition-colors"></Link>
          <Link to="/membership" className="hover:text-brand-green transition-colors"></Link>
          <Link to="/contact" className="hover:text-brand-green transition-colors"></Link>
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
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
