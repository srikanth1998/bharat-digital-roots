import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { countries } from "@/data/locations";
import { submitContactMessage } from "@/lib/contact.functions";



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
  const [country, setCountry] = useState("India");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");

  const selectedCountry = useMemo(() => countries.find((c) => c.name === country), [country]);
  const selectedState = useMemo(() => selectedCountry?.states.find((s) => s.name === state), [selectedCountry, state]);
  const districts = selectedState?.districts ?? [];

  const fieldCls = "mt-2 w-full bg-transparent border-b border-brand-ink/20 py-2 focus:outline-none focus:border-brand-green transition-colors";
  const selectCls = fieldCls + " appearance-none cursor-pointer";

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
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              </div>
              <div>
                <p className="font-serif text-lg text-brand-ink font-semibold">What's App</p>
                <p className="mt-1 text-brand-ink/70">+91 78680 87337</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
              </div>
              <div>
                <p className="font-serif text-lg text-brand-ink font-semibold">Email to</p>
                <p className="mt-1 text-brand-ink/70">mail@akrkali.com</p>
              </div>
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
              <input required className={fieldCls} />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.2em] text-brand-ink/50 font-semibold">Country</label>
              <select
                required
                value={country}
                onChange={(e) => { setCountry(e.target.value); setState(""); setDistrict(""); }}
                className={selectCls}
              >
                <option value="" disabled>Select country</option>
                {countries.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] uppercase tracking-[0.2em] text-brand-ink/50 font-semibold">State</label>
                <select
                  required
                  value={state}
                  onChange={(e) => { setState(e.target.value); setDistrict(""); }}
                  disabled={!selectedCountry || selectedCountry.states.length === 0}
                  className={selectCls + " disabled:opacity-40"}
                >
                  <option value="" disabled>{selectedCountry?.states.length ? "Select state" : "—"}</option>
                  {selectedCountry?.states.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-[0.2em] text-brand-ink/50 font-semibold">District</label>
                {districts.length > 0 ? (
                  <select
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    disabled={!state}
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
                    disabled={!state}
                    placeholder={state ? "Enter district" : "—"}
                    className={fieldCls + " disabled:opacity-40"}
                  />
                )}
              </div>
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.2em] text-brand-ink/50 font-semibold">Village / Town</label>
              <input required placeholder="Type your village or town" className={fieldCls} />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.2em] text-brand-ink/50 font-semibold">Message</label>
              <textarea required rows={4} className={fieldCls + " resize-none"} />
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
