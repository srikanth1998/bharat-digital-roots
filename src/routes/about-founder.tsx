import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about-founder")({
  head: () => ({
    meta: [
      { title: "About the Founder — Vanya" },
      { name: "description", content: "Meet the founder behind Vanya — a movement empowering Indian farmers, rural entrepreneurs, and village communities." },
      { property: "og:title", content: "About the Founder — Vanya" },
      { property: "og:description", content: "The story behind Vanya's mission to bridge ancestral wisdom with modern entrepreneurship." },
    ],
  }),
  component: AboutFounder,
});

function AboutFounder() {
  return (
    <div className="min-h-screen bg-brand-paper">
      <div className="max-w-4xl mx-auto px-6 py-24">
        <Link to="/" className="text-sm text-brand-green/70 hover:text-brand-green">← Back to home</Link>
        <span className="mt-10 block text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-saffron">The Founder</span>
        <h1 className="mt-4 font-serif text-4xl md:text-6xl font-medium tracking-tight text-balance">
          A life between the <span className="italic text-brand-green">field</span> and the future.
        </h1>
        <div className="mt-12 grid md:grid-cols-[1fr_2fr] gap-12 items-start">
          <div className="aspect-[3/4] rounded-2xl bg-brand-paper-warm ring-1 ring-black/5 flex items-center justify-center text-[10px] uppercase tracking-[0.2em] text-brand-ink/30">
            Portrait
          </div>
          <div className="space-y-6 text-brand-ink/75 leading-relaxed text-lg">
            <p>
              Vanya was founded on a single conviction: India's villages are
              not a problem to be solved — they are a frontier to be unlocked.
            </p>
            <p>
              Raised on a small family farm and trained in technology across
              three continents, our founder returned home with one question —
              what would happen if the world's best tools were placed in the
              hands of those who feed the world?
            </p>
            <p>
              The answer became Vanya: a movement that honors tradition while
              opening doors to global markets, capital, and craft.
            </p>
            <blockquote className="border-l-2 border-brand-saffron pl-6 font-serif italic text-2xl text-brand-green">
              “We are not building for villages. We are building with them.”
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
}
