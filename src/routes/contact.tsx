import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { countries } from "@/data/locations";


export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Vanya" },
      { name: "description", content: "Get in touch with the Vanya Collective — partnerships, press, and community inquiries." },
      { property: "og:title", content: "Contact Us — Vanya" },
      { property: "og:description", content: "Reach out to the Vanya team." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <div className="min-h-screen bg-brand-paper">
      <div className="max-w-4xl mx-auto px-6 py-24">
        <Link to="/" className="text-sm text-brand-green/70 hover:text-brand-green">← Back to home</Link>
        <span className="mt-10 block text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-saffron">Contact</span>
        <h1 className="mt-4 font-serif text-4xl md:text-6xl font-medium tracking-tight text-balance">
          Let's grow <span className="italic text-brand-green">together.</span>
        </h1>
        <p className="mt-6 text-lg text-brand-ink/70 max-w-xl">
          For partnerships, press, or to join a chapter — write to us. We read every message.
        </p>

        <div className="mt-16 grid md:grid-cols-[1fr_1fr] gap-12">
          <div className="space-y-8">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-brand-ink/40 font-semibold">Email</p>
              <p className="mt-2 font-serif text-xl text-brand-green">hello@vanya.in</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-brand-ink/40 font-semibold">Headquarters</p>
              <p className="mt-2 text-brand-ink/80">Bengaluru · Bharat</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-brand-ink/40 font-semibold">Field Office</p>
              <p className="mt-2 text-brand-ink/80">Wardha, Maharashtra</p>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="space-y-5 bg-brand-paper-warm/50 p-8 rounded-2xl ring-1 ring-black/5"
          >
            <div>
              <label className="text-[11px] uppercase tracking-[0.2em] text-brand-ink/50 font-semibold">Name</label>
              <input required className="mt-2 w-full bg-transparent border-b border-brand-ink/20 py-2 focus:outline-none focus:border-brand-green transition-colors" />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.2em] text-brand-ink/50 font-semibold">Email</label>
              <input type="email" required className="mt-2 w-full bg-transparent border-b border-brand-ink/20 py-2 focus:outline-none focus:border-brand-green transition-colors" />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.2em] text-brand-ink/50 font-semibold">Address</label>
              <input required className="mt-2 w-full bg-transparent border-b border-brand-ink/20 py-2 focus:outline-none focus:border-brand-green transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] uppercase tracking-[0.2em] text-brand-ink/50 font-semibold">District</label>
                <input required className="mt-2 w-full bg-transparent border-b border-brand-ink/20 py-2 focus:outline-none focus:border-brand-green transition-colors" />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-[0.2em] text-brand-ink/50 font-semibold">State</label>
                <input required className="mt-2 w-full bg-transparent border-b border-brand-ink/20 py-2 focus:outline-none focus:border-brand-green transition-colors" />
              </div>
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.2em] text-brand-ink/50 font-semibold">Country</label>
              <input required defaultValue="India" className="mt-2 w-full bg-transparent border-b border-brand-ink/20 py-2 focus:outline-none focus:border-brand-green transition-colors" />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.2em] text-brand-ink/50 font-semibold">Message</label>
              <textarea required rows={4} className="mt-2 w-full bg-transparent border-b border-brand-ink/20 py-2 focus:outline-none focus:border-brand-green transition-colors resize-none" />
            </div>

            <button type="submit" className="w-full bg-brand-green text-brand-paper py-3 rounded-full font-medium hover:bg-brand-green-deep transition-colors">
              {sent ? "Thank you — we'll be in touch." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
