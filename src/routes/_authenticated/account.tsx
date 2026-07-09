import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyMember, getMyRole } from "@/lib/members.functions";
import { supabase } from "@/integrations/supabase/client";
import { planName, planNameShort } from "@/lib/plans";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({ meta: [{ title: "My Account — Feathers Forum" }] }),
  component: Account,
});

function Account() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fetchMember = useServerFn(getMyMember);
  const fetchRole = useServerFn(getMyRole);

  const memberQ = useQuery({ queryKey: ["my-member"], queryFn: () => fetchMember() });
  const roleQ = useQuery({ queryKey: ["my-role"], queryFn: () => fetchRole() });

  async function handleSignOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    await navigate({ to: "/login", replace: true });
  }

  const m = memberQ.data;

  return (
    <div className="min-h-screen bg-brand-paper">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-sm text-brand-green/70 hover:text-brand-green">← Back to home</Link>
          <div className="flex items-center gap-4">
            <Link to="/forum" className="text-sm font-medium text-brand-green hover:underline">
              Forum →
            </Link>
            {roleQ.data?.isAdmin && (
              <Link to="/admin" className="text-sm font-medium text-brand-saffron hover:underline">
                Admin →
              </Link>
            )}
            <button
              onClick={handleSignOut}
              className="text-sm text-brand-ink/60 hover:text-brand-ink"
            >
              Sign out
            </button>
          </div>
        </div>

        <h1 className="mt-10 font-serif text-5xl font-medium tracking-tight">
          Welcome{m ? `, ${m.full_name.split(" ")[0]}` : ""}.
        </h1>

        {memberQ.isLoading && <p className="mt-6 text-brand-ink/60">Loading…</p>}
        {memberQ.error && (
          <p className="mt-6 text-red-600">Could not load your membership: {(memberQ.error as Error).message}</p>
        )}

        {m && (
          <>
            {/* ID CARD */}
            <div className="mt-10 rounded-2xl bg-gradient-to-br from-brand-green to-brand-green-deep text-brand-paper p-8 shadow-xl shadow-brand-green/20 max-w-md">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-brand-saffron font-semibold">
                    Feathers Community Forum
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-brand-paper/60">
                    Member Identity Card
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-brand-saffron text-[10px] font-semibold uppercase tracking-wider text-white">
                  {planNameShort(m.plan_id)}
                </span>
              </div>
              <p className="mt-8 font-serif text-3xl leading-tight">{m.full_name}</p>
              <p className="mt-1 text-sm text-brand-paper/70">{m.district}, {m.state}</p>
              <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-brand-paper/50 uppercase tracking-wider">Member ID</p>
                  <p className="font-mono mt-1">{m.member_code}</p>
                </div>
                <div>
                  <p className="text-brand-paper/50 uppercase tracking-wider">Valid Until</p>
                  <p className="font-mono mt-1">{m.expires_at ? new Date(m.expires_at).toLocaleDateString() : "Lifetime"}</p>
                </div>
              </div>
            </div>

            {/* DETAILS */}
            <div className="mt-12 grid md:grid-cols-2 gap-x-12 gap-y-6">
              <Detail label="Email" value={m.email} />
              <Detail label="Mobile" value={m.mobile} />
              <Detail label="Plan" value={`${planName(m.plan_id)} · ₹${m.amount_inr}`} />
              <Detail label="Joined" value={new Date(m.joined_at).toLocaleDateString()} />
              <Detail label="Address" value={`${m.address}, ${m.town}`} />
              <Detail label="Region" value={`${m.district}, ${m.state}, ${m.country}`} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.2em] text-brand-ink/50 font-semibold">{label}</p>
      <p className="mt-1 text-brand-ink">{value}</p>
    </div>
  );
}
