import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { countries } from "@/data/locations";


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

const membershipTypes = [
  "Farmer",
  "Entrepreneur",
  "Community Partner",
  "Mentor / Investor",
  "Student / Youth",
];

const plans = [
  {
    id: "active",
    name: "Active Membership",
    price: 100,
    tagline: "For changemakers on the ground",
    perks: ["Voting rights in chapter", "Event participation", "Member ID card", "Valid for 1 year"],
  },
  {
    id: "passive",
    name: "Passive Membership",
    price: 500,
    tagline: "For supporters & well-wishers",
    perks: ["Supporter recognition", "Quarterly impact reports", "Member ID card", "Valid for 1 year"],
  },
] as const;


function Membership() {
  const [membershipType, setMembershipType] = useState(membershipTypes[0]);
  const [planId, setPlanId] = useState<(typeof plans)[number]["id"]>("active");
  const [done, setDone] = useState(false);
  const [country, setCountry] = useState("India");
  const [stateName, setStateName] = useState("");
  const [district, setDistrict] = useState("");

  const selectedPlan = plans.find((p) => p.id === planId)!;


  const selectedCountry = useMemo(() => countries.find((c) => c.name === country), [country]);
  const selectedState = useMemo(() => selectedCountry?.states.find((s) => s.name === stateName), [selectedCountry, stateName]);
  const districts = selectedState?.districts ?? [];
  const inputCls = "mt-2 w-full bg-transparent border-b border-brand-ink/20 py-2 focus:outline-none focus:border-brand-green transition-colors";
  const selectCls = inputCls + " appearance-none cursor-pointer";
  const labelCls = "text-[11px] uppercase tracking-[0.2em] text-brand-ink/50 font-semibold";


  return (
    <div className="min-h-screen bg-brand-paper">
      <div className="max-w-4xl mx-auto px-6 py-24">
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
            className="mt-12 space-y-10 bg-brand-paper-warm/50 p-8 md:p-10 rounded-2xl ring-1 ring-black/5"
          >
            <Section title="Personal Information" number="01">
              <div className="grid md:grid-cols-2 gap-6">
                <Field label="Full Name" required />
                <Field label="Father / Mother Name" required />
                <Field label="Primary Mobile Number" type="tel" required />
                <Field label="Alternate Mobile Number" type="tel" />
                <Field label="Primary Email ID" type="email" required />
                <Field label="Secondary Email ID" type="email" />
              </div>
            </Section>

            <Section title="Address Details" number="02">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Field label="Address" required />
                </div>
                <div>
                  <label className={labelCls}>Country <span className="text-brand-saffron">*</span></label>
                  <select
                    required
                    value={country}
                    onChange={(e) => { setCountry(e.target.value); setStateName(""); setDistrict(""); }}
                    className={selectCls}
                  >
                    <option value="" disabled>Select country</option>
                    {countries.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>State <span className="text-brand-saffron">*</span></label>
                  <select
                    required
                    value={stateName}
                    onChange={(e) => { setStateName(e.target.value); setDistrict(""); }}
                    disabled={!selectedCountry || selectedCountry.states.length === 0}
                    className={selectCls + " disabled:opacity-40"}
                  >
                    <option value="" disabled>{selectedCountry?.states.length ? "Select state" : "—"}</option>
                    {selectedCountry?.states.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>District <span className="text-brand-saffron">*</span></label>
                  {districts.length > 0 ? (
                    <select
                      required
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      disabled={!stateName}
                      className={selectCls + " disabled:opacity-40"}
                    >
                      <option value="" disabled>Select district</option>
                      {districts.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  ) : (
                    <input
                      required
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      disabled={!stateName}
                      placeholder={stateName ? "Enter district" : "—"}
                      className={inputCls + " disabled:opacity-40"}
                    />
                  )}
                </div>
                <Field label="Town / Village (Place)" required />
              </div>
            </Section>


            <Section title="Membership Type" number="03">
              <div className="flex flex-wrap gap-2">
                {membershipTypes.map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setMembershipType(r)}
                    className={`px-4 py-2 rounded-full text-sm font-medium ring-1 transition-all ${
                      membershipType === r
                        ? "bg-brand-green text-brand-paper ring-brand-green"
                        : "bg-transparent text-brand-ink/70 ring-brand-ink/15 hover:ring-brand-green/40"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </Section>

            <button type="submit" className="w-full bg-brand-saffron text-white py-3.5 rounded-full font-medium hover:shadow-xl hover:shadow-brand-saffron/20 transition-all">
              Submit Application
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Section({ title, number, children }: { title: string; number: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline gap-3 mb-6">
        <span className="text-[11px] font-mono text-brand-saffron">{number}</span>
        <h2 className="font-serif text-2xl text-brand-ink">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Field({ label, type = "text", required = false }: { label: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-[11px] uppercase tracking-[0.2em] text-brand-ink/50 font-semibold">
        {label} {required && <span className="text-brand-saffron">*</span>}
      </label>
      <input type={type} required={required} className="mt-2 w-full bg-transparent border-b border-brand-ink/20 py-2 focus:outline-none focus:border-brand-green transition-colors" />
    </div>
  );
}
