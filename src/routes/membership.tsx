import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { countries } from "@/data/locations";
import { createRazorpayOrder, verifyRazorpayPayment, checkEmailAvailable } from "@/lib/razorpay.functions";
import { planDuration, planName, type PlanId } from "@/lib/plans";

import { PLAN_PRICES_INR } from "@/lib/plans";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export const Route = createFileRoute("/membership")({
  head: () => ({
    meta: [
      { title: "Membership Registration — Feathers Forum" },
      { name: "description", content: "Join the Feathers Forum movement — register as a member and become part of a community empowering Bharat." },
      { property: "og:title", content: "Membership Registration — Feathers Forum" },
      { property: "og:description", content: "Become part of a movement empowering Bharat." },
    ],
  }),
  component: Membership,
});

const plans: { id: PlanId; name: string; price: number; duration: string; tagline: string; perks: string[] }[] = [
  {
    id: "active_1year",
    name: "Active Membership",
    price: PLAN_PRICES_INR.active_1year,
    duration: "1 year",
    tagline: "For changemakers on the ground",
    perks: ["Voting rights in chapter", "Event participation", "Member ID card", "Valid for 1 year"],
  },
  {
    id: "active_lifetime",
    name: "Active Membership",
    price: PLAN_PRICES_INR.active_lifetime,
    duration: "Lifetime",
    tagline: "For lifelong changemakers",
    perks: ["Lifetime voting rights", "Lifetime event access", "Member ID card", "No annual renewal"],
  },
  {
    id: "passive_1year",
    name: "Passive Membership",
    price: PLAN_PRICES_INR.passive_1year,
    duration: "1 year",
    tagline: "For supporters & well-wishers",
    perks: ["Supporter recognition", "Quarterly impact reports", "Member ID card", "Valid for 1 year"],
  },
  {
    id: "passive_lifetime",
    name: "Passive Membership",
    price: PLAN_PRICES_INR.passive_lifetime,
    duration: "Lifetime",
    tagline: "For lifelong supporters",
    perks: ["Lifetime supporter recognition", "Lifetime impact updates", "Member ID card", "No annual renewal"],
  },
];



function Membership() {
  
  const [planId, setPlanId] = useState<PlanId>("active_1year");
  const [done, setDone] = useState<null | { memberCode: string; tempPassword: string; email: string }>(null);
  const [country, setCountry] = useState("India");
  const [stateName, setStateName] = useState("");
  const [district, setDistrict] = useState("");
  const [town, setTown] = useState("");
  const [address, setAddress] = useState("");
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const createOrder = useServerFn(createRazorpayOrder);
  const verifyPayment = useServerFn(verifyRazorpayPayment);
  const checkEmail = useServerFn(checkEmailAvailable);

  useEffect(() => { void loadRazorpayScript(); }, []);

  const selectedPlan = plans.find((p) => p.id === planId)!;

  async function handlePayment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPayError(null);
    setPaying(true);
    const form = e.currentTarget;
    try {
      const ok = await loadRazorpayScript();
      if (!ok || !window.Razorpay) throw new Error("Could not load Razorpay. Check your connection.");

      const fd = new FormData(form);
      const profile = {
        fullName: String(fd.get("fullName") || "").trim(),
        parentName: String(fd.get("parentName") || "").trim(),
        mobile: String(fd.get("mobile") || "").trim(),
        altMobile: String(fd.get("altMobile") || "").trim(),
        email: String(fd.get("email") || "").trim(),
        altEmail: String(fd.get("altEmail") || "").trim(),
        address: address.trim(),
        country: country.trim(),
        state: stateName.trim(),
        district: district.trim(),
        town: town.trim(),
      };

      // Block known-registered emails before opening Razorpay checkout
      const { available } = await checkEmail({ data: { email: profile.email } });
      if (!available) {
        throw new Error("This email is already registered. Please log in instead.");
      }

      const order = await createOrder({ data: { planId } });

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "Feathers Forum",
        description: `${selectedPlan.name} — ${selectedPlan.duration}`,
        prefill: { name: profile.fullName, email: profile.email, contact: profile.mobile },
        theme: { color: "#0a6b3b" },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            const result = await verifyPayment({
              data: {
                ...response,
                planId,
                profile,
              },
            });
            setDone({ memberCode: result.memberCode, tempPassword: result.tempPassword, email: result.email });
          } catch (err) {
            setPayError(err instanceof Error ? err.message : "Payment verification failed");
          } finally {
            setPaying(false);
          }
        },
        modal: { ondismiss: () => setPaying(false) },
      });
      rzp.open();
    } catch (err) {
      setPayError(err instanceof Error ? err.message : "Payment could not be started");
      setPaying(false);
    }
  }

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
          Choose an annual plan or a lifetime membership and become part of the Feathers Forum family.
        </p>

        {done ? (
          <div className="mt-16 space-y-6">
            <div className="p-10 rounded-2xl bg-brand-green text-brand-paper">
              <p className="font-serif text-3xl">Welcome to Feathers Forum.</p>
              <p className="mt-3 text-brand-paper/80">
                Your {selectedPlan.name.toLowerCase()} (₹{selectedPlan.price}) is confirmed and valid for {selectedPlan.duration.toLowerCase()}. Your Member ID is{" "}
                <span className="font-mono font-semibold">{done.memberCode}</span>.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-brand-paper-warm ring-1 ring-brand-saffron/30">
              <p className="text-[11px] uppercase tracking-[0.2em] text-brand-saffron font-semibold">
                Save these login details
              </p>
              <p className="mt-2 text-sm text-brand-ink/70">
                Use these to sign in for the first time. You'll be asked to set your own password right after.
              </p>
              <dl className="mt-5 grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-brand-ink/50 text-xs uppercase tracking-wider">Email</dt>
                  <dd className="mt-1 font-mono text-brand-ink">{done.email}</dd>
                </div>
                <div>
                  <dt className="text-brand-ink/50 text-xs uppercase tracking-wider">Temporary password</dt>
                  <dd className="mt-1 font-mono text-brand-ink select-all">{done.tempPassword}</dd>
                </div>
              </dl>
              <Link
                to="/login"
                className="mt-6 inline-block bg-brand-green text-brand-paper px-6 py-2.5 rounded-full text-sm font-medium hover:bg-brand-green-deep transition-colors"
              >
                Go to login →
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handlePayment}
            className="mt-12 space-y-10 bg-brand-paper-warm/50 p-8 md:p-10 rounded-2xl ring-1 ring-black/5"
          >

            <Section title="Personal Information" number="01">
              <div className="grid md:grid-cols-2 gap-6">
                <Field label="Full Name" name="fullName" required />
                <Field label="Father / Mother Name" name="parentName" required />
                <Field label="Primary Mobile Number" name="mobile" type="tel" required />
                <Field label="Alternate Mobile Number" name="altMobile" type="tel" />
                <Field label="Primary Email ID" name="email" type="email" required />
                <Field label="Secondary Email ID" name="altEmail" type="email" />

              </div>
            </Section>

            <Section title="Address Details" number="02">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="mem-address" className={labelCls}>Address <span className="text-brand-saffron">*</span></label>
                  <input
                    id="mem-address"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="mem-country" className={labelCls}>Country <span className="text-brand-saffron">*</span></label>
                  <select
                    id="mem-country"
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
                  <label htmlFor="mem-state" className={labelCls}>State <span className="text-brand-saffron">*</span></label>
                  <select
                    id="mem-state"
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
                  <label htmlFor="mem-district" className={labelCls}>District <span className="text-brand-saffron">*</span></label>
                  {districts.length > 0 ? (
                    <select
                      id="mem-district"
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
                      id="mem-district"
                      required
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      disabled={!stateName}
                      placeholder={stateName ? "Enter district" : "—"}
                      className={inputCls + " disabled:opacity-40"}
                    />
                  )}
                </div>
                <div>
                  <label htmlFor="mem-town" className={labelCls}>Town / Village (Place) <span className="text-brand-saffron">*</span></label>
                  <input
                    id="mem-town"
                    required
                    value={town}
                    onChange={(e) => setTown(e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>
            </Section>

            <Section title="Choose Your Plan" number="03">
              <div className="grid md:grid-cols-2 gap-4">
                {plans.map((p) => {
                  const active = planId === p.id;
                  return (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setPlanId(p.id)}
                      className={`text-left p-6 rounded-2xl ring-1 transition-all ${
                        active
                          ? "bg-brand-green text-brand-paper ring-brand-green shadow-lg shadow-brand-green/20"
                          : "bg-white text-brand-ink ring-brand-ink/10 hover:ring-brand-green/40"
                      }`}
                    >
                      <div className="flex items-baseline justify-between">
                        <span className="font-serif text-xl">{p.name}</span>
                        <div className="text-right">
                          <span className="font-mono text-2xl">₹{p.price}</span>
                          <span className={`block text-xs font-medium ${active ? "text-brand-paper/70" : "text-brand-ink/50"}`}>{p.duration}</span>
                        </div>
                      </div>
                      <p className={`mt-1 text-sm ${active ? "text-brand-paper/80" : "text-brand-ink/60"}`}>{p.tagline}</p>
                      <ul className={`mt-4 space-y-1.5 text-sm ${active ? "text-brand-paper/90" : "text-brand-ink/70"}`}>
                        {p.perks.map((perk) => (
                          <li key={perk} className="flex gap-2">
                            <span className={active ? "text-brand-saffron" : "text-brand-green"}>✓</span>
                            {perk}
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>
            </Section>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 rounded-xl bg-brand-paper ring-1 ring-brand-ink/10">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-brand-ink/50 font-semibold">Total payable</p>
                <p className="mt-1 font-serif text-2xl text-brand-ink">
                  ₹{selectedPlan.price}.00 <span className="text-sm text-brand-ink/60">/ {selectedPlan.duration} · {selectedPlan.name}</span>
                </p>
                {payError && <p className="mt-2 text-sm text-red-600">{payError}</p>}
              </div>
              <button type="submit" disabled={paying} className="bg-brand-saffron text-white px-8 py-3.5 rounded-full font-medium hover:shadow-xl hover:shadow-brand-saffron/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                {paying ? "Processing…" : `Pay ₹${selectedPlan.price} & Submit`}
              </button>
            </div>

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

function Field({ label, type = "text", required = false, name }: { label: string; type?: string; required?: boolean; name?: string }) {
  const id = name ?? label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <div>
      <label htmlFor={id} className="text-[11px] uppercase tracking-[0.2em] text-brand-ink/50 font-semibold">
        {label} {required && <span className="text-brand-saffron">*</span>}
      </label>
      <input id={id} name={name} type={type} required={required} className="mt-2 w-full bg-transparent border-b border-brand-ink/20 py-2 focus:outline-none focus:border-brand-green transition-colors" />
    </div>
  );

}
