import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/membership")({
  head: () => ({
    meta: [
      { title: "Membership Registration — Vanya" },
      { name: "description", content: "Join the Vanya movement — register as a farmer, entrepreneur, or community partner." },
      { property: "og:title", content: "Membership Registration — Vanya" },
      { property: "og:description", content: "Become part of a movement empowering Bharat." },
    ],
  }),
  component: Membership,
});

const roles = ["Farmer", "Entrepreneur", "Community Partner", "Mentor / Investor"];

function Membership() {
  const [role, setRole] = useState(roles[0]);
  const [done, setDone] = useState(false);

  return (
    <div className="min-h-screen bg-brand-paper">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <Link to="/" className="text-sm text-brand-green/70 hover:text-brand-green">← Back to home</Link>
        <span className="mt-10 block text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-saffron">Join the Movement</span>
        <h1 className="mt-4 font-serif text-4xl md:text-6xl font-medium tracking-tight text-balance">
          Membership <span className="italic text-brand-green">Registration.</span>
        </h1>
        <p className="mt-6 text-lg text-brand-ink/70 max-w-xl">
          One application. A lifetime of belonging. Every member is reviewed by our regional chapter team.
        </p>

        {done ? (
          <div className="mt-16 p-10 rounded-2xl bg-brand-green text-brand-paper">
            <p className="font-serif text-3xl">Welcome to Vanya.</p>
            <p className="mt-3 text-brand-paper/80">Your application is in. A chapter coordinator will reach out within 7 days.</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setDone(true);
            }}
            className="mt-12 space-y-8 bg-brand-paper-warm/50 p-10 rounded-2xl ring-1 ring-black/5"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <Field label="Full Name" />
              <Field label="Email" type="email" />
              <Field label="Phone" />
              <Field label="State / Region" />
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-brand-ink/50 font-semibold mb-4">I'm joining as</p>
              <div className="flex flex-wrap gap-2">
                {roles.map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setRole(r)}
                    className={`px-4 py-2 rounded-full text-sm font-medium ring-1 transition-all ${
                      role === r
                        ? "bg-brand-green text-brand-paper ring-brand-green"
                        : "bg-transparent text-brand-ink/70 ring-brand-ink/15 hover:ring-brand-green/40"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-[0.2em] text-brand-ink/50 font-semibold">Tell us about your work</label>
              <textarea rows={4} className="mt-2 w-full bg-transparent border-b border-brand-ink/20 py-2 focus:outline-none focus:border-brand-green transition-colors resize-none" />
            </div>

            <button type="submit" className="w-full bg-brand-saffron text-white py-3.5 rounded-full font-medium hover:shadow-xl hover:shadow-brand-saffron/20 transition-all">
              Submit Application
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, type = "text" }: { label: string; type?: string }) {
  return (
    <div>
      <label className="text-[11px] uppercase tracking-[0.2em] text-brand-ink/50 font-semibold">{label}</label>
      <input type={type} required className="mt-2 w-full bg-transparent border-b border-brand-ink/20 py-2 focus:outline-none focus:border-brand-green transition-colors" />
    </div>
  );
}
