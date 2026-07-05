import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import founderAsset from "@/assets/founder-akr-kali.png.asset.json";

function FounderImage({ src }: { src: string }) {
  const [errored, setErrored] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
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
      { name: "description", content: "Anand Kumar Kali (AKR Kali), IFS — Founder of Feathers Community Forum and FEA Ventures. Entrepreneur, mentor, trainer, and civil servant empowering individuals and organizations." },
      { property: "og:title", content: "About AKR Kali — Founder, Feathers Community Forum" },
      { property: "og:description", content: "The story of Anand Kumar Kali — entrepreneur, IT mentor, and founder of Feathers Community Forum and FEA Ventures." },
      { property: "og:image", content: founderAsset.url },
    ],
  }),
  component: AboutFounder,
});

const expertise = [
  "Entrepreneurship & Business Development",
  "Leadership and Team Building",
  "Career Guidance and Student Mentoring",
  "Information Technology",
  "Corporate Training",
  "Organizational Development",
  "Public Service",
  "Strategic Management",
  "Communication & Interpersonal Skills",
];

const careerHighlights = [
  "Founder of Feathers Community Forum, a platform dedicated to empowering individuals through knowledge, mentorship, and community engagement.",
  "Founder of FEA Ventures, driving entrepreneurial growth and business excellence.",
  "Delivered 7,000+ hours of high-end technical and interpersonal skills training to college students, professionals, and corporate organizations.",
  "Mentored thousands of students in making informed career decisions through seminars, workshops, and one-on-one guidance.",
  "Built and developed high-performing technical and non-technical teams through leadership coaching and mentoring.",
  "Conducted numerous management development programs focusing on leadership, teamwork, motivation, and organizational effectiveness.",
];

const leadershipPhilosophy = [
  "Developing future leaders",
  "Building world-class teams",
  "Encouraging innovation and excellence",
  "Promoting ethical leadership",
  "Inspiring lifelong learning",
  "Strengthening interpersonal and management capabilities",
];

const personalAttributes = [
  "Inspirational Speaker",
  "Visionary Entrepreneur",
  "Strategic Thinker",
  "Leadership Mentor",
  "Career Coach",
  "Avid Reader",
  "Spiritually Inclined",
  "Strong Analytical Ability",
  "Exceptional People Management Skills",
];

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-16">
      <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-saffron">
        {eyebrow}
      </span>
      <h2 className="mt-4 font-serif text-2xl md:text-3xl font-medium tracking-tight max-w-3xl">
        {title}
      </h2>
      <div className="mt-6 text-brand-ink/75 leading-relaxed text-lg max-w-3xl">
        {children}
      </div>
    </div>
  );
}

function AboutFounder() {
  return (
    <div className="min-h-screen bg-brand-paper">
      <div className="max-w-5xl mx-auto px-6 py-24">
        <Link to="/" className="text-sm text-brand-green/70 hover:text-brand-green">
          ← Back to home
        </Link>

        <span className="mt-10 block text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-saffron">
          The Founder
        </span>
        <h1 className="mt-4 font-serif text-4xl md:text-6xl font-medium tracking-tight text-balance">
          About <span className="italic text-brand-green">AKR Kali</span>
        </h1>
        <p className="mt-4 text-brand-ink/60 text-lg max-w-3xl">
          Anand Kumar Kali, IFS — widely known as AKR Kali. Founder of Feathers Community Forum and Founder of FEA Ventures.
        </p>

        <div className="mt-12 grid md:grid-cols-[1fr_2fr] gap-12 items-start">
          <FounderImage src={founderAsset.url} />

          <div className="space-y-6 text-brand-ink/75 leading-relaxed text-lg">
            <p>
              Anand Kumar Kali, widely known as AKR Kali, is an accomplished entrepreneur, mentor, career guidance expert, trainer, and civil servant with a distinguished multidisciplinary career. His journey reflects a unique blend of entrepreneurship, public service, technology, leadership development, and community building.
            </p>
            <p>
              With over 10 years of entrepreneurial experience, 5 years in the IT industry, and 5 years of service as a civil servant, he has consistently worked towards empowering individuals and organizations through education, leadership, and innovation.
            </p>
          </div>
        </div>

        <Section eyebrow="Expertise" title="Areas of Expertise">
          <ul className="grid sm:grid-cols-2 gap-3">
            {expertise.map((item) => (
              <li
                key={item}
                className="rounded-xl bg-brand-paper-warm ring-1 ring-black/5 px-5 py-4 text-base font-medium text-brand-ink"
              >
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section eyebrow="Career Highlights" title="Key Milestones">
          <ul className="space-y-4">
            {careerHighlights.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-saffron" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section eyebrow="Career Guidance & Training" title="Inspiring the Next Generation">
          <p>
            Anand Kumar Kali is widely recognized as the visionary behind the highly acclaimed <em>“IT Tips by BE-PRACTICAL”</em> career guidance initiative. His engaging seminars and insightful lectures have inspired countless students and young professionals to pursue successful careers in technology and beyond.
          </p>
          <p className="mt-4">
            His practical approach, combined with industry expertise, has made him a trusted mentor for aspiring professionals seeking career direction and personal growth.
          </p>
        </Section>

        <Section eyebrow="Leadership Philosophy" title="People-Centric Leadership">
          <p>
            A passionate believer in continuous learning and human potential, Anand Kumar Kali focuses on:
          </p>
          <ul className="mt-4 grid sm:grid-cols-2 gap-3">
            {leadershipPhilosophy.map((item) => (
              <li
                key={item}
                className="rounded-xl bg-brand-paper-warm ring-1 ring-black/5 px-5 py-4 text-base font-medium text-brand-ink"
              >
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6">
            His leadership style emphasizes integrity, collaboration, accountability, and people-centric growth.
          </p>
        </Section>

        <Section eyebrow="Recognition & Awards" title="Honors and Appreciation">
          <p>
            His contributions to entrepreneurship and society have earned widespread recognition.
          </p>
          <p className="mt-4">
            <strong className="text-brand-ink">Notable Award:</strong> Udhyog Rathan Award (2007), presented by the Indian Institute of Economics, New Delhi, recognizing his outstanding entrepreneurial achievements.
          </p>
          <p className="mt-4">
            He has also received numerous honors and appreciation awards from various social, educational, and industrial organizations for his contributions to entrepreneurship, education, leadership, and community development.
          </p>
        </Section>

        <Section eyebrow="Personal Attributes" title="The Person Behind the Leader">
          <div className="flex flex-wrap gap-3">
            {personalAttributes.map((item) => (
              <span
                key={item}
                className="rounded-full bg-brand-paper-warm ring-1 ring-black/5 px-4 py-2 text-sm font-medium text-brand-ink"
              >
                {item}
              </span>
            ))}
          </div>
        </Section>

        <Section eyebrow="Vision" title="A Vision for Impact">
          <p>
            To empower individuals, nurture future leaders, promote entrepreneurship, and create meaningful social impact through education, innovation, leadership, and community service.
          </p>
        </Section>

        <Section eyebrow="Legacy" title="Continuing the Journey">
          <p>
            Through his entrepreneurial ventures, public service, mentoring initiatives, and community leadership, Anand Kumar Kali continues to inspire students, professionals, entrepreneurs, and organizations. His unwavering commitment to knowledge sharing, ethical leadership, and human development has established him as a respected leader whose influence extends across education, business, technology, and society.
          </p>
        </Section>
      </div>
    </div>
  );
}
