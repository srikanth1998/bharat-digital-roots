import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import founderAsset from "@/assets/founder-akr-kali.png.asset.json";

function FounderImage({ src }: { src: string }) {
  const [errored, setErrored] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  // SSR gotcha: if the image 404s before React hydrates, the onError event is missed.
  // On mount, detect an already-broken image (loaded but zero intrinsic size).
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setErrored(true);
  }, []);
  if (errored) {
    return (
      <div
        role="img"
        aria-label="Anand Kumar Kali, Founder of Feathers Community Forum"
        className="w-full aspect-[3/4] rounded-2xl ring-1 ring-black/5 bg-brand-green/10 flex items-center justify-center"
      >
        <span className="font-serif text-7xl text-brand-green/70 select-none">AK</span>
      </div>
    );
  }
  return (
    <img
      ref={ref}
      src={src}
      alt="Anand Kumar Kali, Founder of Feathers Community Forum"
      className="w-full aspect-[3/4] object-cover rounded-2xl ring-1 ring-black/5"
      onError={() => setErrored(true)}
    />
  );
}

export const Route = createFileRoute("/about-founder")({
  head: () => ({
    meta: [
      { title: "About AKR Kali — Founder, Feathers Community Forum" },
      { name: "description", content: "Anand Kumar Kali (AKR Kali) — Founder of Feathers Community Forum and FEA Business Corporations. Entrepreneur, trainer, and civil servant empowering students and professionals." },
      { property: "og:title", content: "About AKR Kali — Founder, Feathers Community Forum" },
      { property: "og:description", content: "The story of Anand Kumar Kali — entrepreneur, IT mentor, and founder of Feathers Community Forum." },
      { property: "og:image", content: founderAsset.url },
    ],
  }),
  component: AboutFounder,
});

const pillars = [
  "Training Programs",
  "Skills Development",
  "Opportunities",
  "Entrepreneurship",
  "Networking",
  "Community Services",
  "Awareness & Advocacy",
];

function AboutFounder() {
  return (
    <div className="min-h-screen bg-brand-paper">
      <div className="max-w-5xl mx-auto px-6 py-24">
        <Link to="/" className="text-sm text-brand-green/70 hover:text-brand-green">← Back to home</Link>

        <span className="mt-10 block text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-saffron">
          The Founder
        </span>
        <h1 className="mt-4 font-serif text-4xl md:text-6xl font-medium tracking-tight text-balance">
          About <span className="italic text-brand-green">AKR Kali</span>
        </h1>
        <p className="mt-4 text-brand-ink/60 text-lg">
          Anand Kumar Kali IFS — alias AKR Kali. Founder of Feathers Community
          Forum, Founder of FEA Business Corporations and FEA Companies.
        </p>

        <div className="mt-12 grid md:grid-cols-[1fr_2fr] gap-12 items-start">
          <FounderImage src={founderAsset.url} />

          <div className="space-y-6 text-brand-ink/75 leading-relaxed text-lg">
            <p>
              In his career spanning over 10 years as an entrepreneur, 5 years
              in the IT industry, and 5 years as a civil servant, he has
              conducted more than <strong className="text-brand-ink">7,000 hours</strong> of high-end
              technology and interpersonal skills training for college students
              and corporate clients. As a career guidance expert, he has striven
              to always keep himself within the reach of students.
            </p>
            <p>
              The brain and voice behind the mega hit{" "}
              <em>“IT TIPS BY BE-PRACTICAL”</em> for career guidance, people
              have always thronged at his seminars and lecture sessions.
              Developing his team into a world-class team of technical and
              non-technical talent is his passion, and over the years he has
              pursued it by conducting several mentoring sessions for employees
              on Management, Team Building, and Leadership. An avid reader with
              a spiritual bend, he exudes superior people management and
              analytical skills.
            </p>
            <p>
              Natural charisma and the honesty in his approach have made him a
              noted figure in the IT circles of Chennai and Bangalore. He won
              the <strong className="text-brand-ink">“Udhyog Rathan” Award in 2007</strong> for his
              entrepreneurial ventures, instituted by the Indian Institute of
              Economics, New Delhi, along with several awards from various
              social and industrial bodies.
            </p>
          </div>
        </div>

        <div className="mt-24 border-t border-black/10 pt-16">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-saffron">
            The Forum
          </span>
          <h2 className="mt-4 font-serif text-3xl md:text-4xl font-medium tracking-tight max-w-3xl">
            Feathers Community Forum
          </h2>
          <p className="mt-6 text-brand-ink/75 leading-relaxed text-lg max-w-3xl">
            A platform where individuals can discuss, promote, and collaborate
            on entrepreneurial ventures, community services, initiatives, and
            volunteer opportunities.
          </p>

          <ul className="mt-10 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {pillars.map((p) => (
              <li
                key={p}
                className="rounded-xl bg-brand-paper-warm ring-1 ring-black/5 px-5 py-4 text-sm font-medium text-brand-ink"
              >
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
