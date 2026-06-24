import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Fragment, useMemo, useState } from "react";
import { getAllMembers, getMyRole } from "@/lib/members.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  ssr: false,
  beforeLoad: async () => {
    const { isAdmin } = await getMyRole();
    if (!isAdmin) throw redirect({ to: "/account" });
  },
  head: () => ({ meta: [{ title: "Admin — Members — Feathers Forum" }] }),
  component: Admin,
});

function Admin() {
  const fetchAll = useServerFn(getAllMembers);
  const q = useQuery({ queryKey: ["all-members"], queryFn: () => fetchAll() });

  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const rows = q.data ?? [];
    const s = search.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) =>
      [r.full_name, r.email, r.member_code, r.mobile, r.district, r.state]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(s)),
    );
  }, [q.data, search]);

  return (
    <div className="min-h-screen bg-brand-paper">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between">
          <div>
            <Link to="/account" className="text-sm text-brand-green/70 hover:text-brand-green">
              ← Back to my account
            </Link>
            <h1 className="mt-4 font-serif text-4xl font-medium tracking-tight">Members</h1>
            <p className="mt-1 text-brand-ink/60">
              {q.data ? `${q.data.length} total · ${filtered.length} shown` : "Loading…"}
            </p>
            <div className="mt-3 flex gap-3 text-sm">
              <span className="text-brand-ink font-semibold">Members</span>
              <span className="text-brand-ink/30">·</span>
              <Link to="/admin-messages" className="text-brand-green/80 hover:text-brand-green underline-offset-4 hover:underline">Messages</Link>
            </div>
            <p className="mt-1 text-xs text-brand-ink/50">Click a member to see their full registration details.</p>

          </div>
          <input
            type="search"
            placeholder="Search name, email, ID, mobile…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-80 max-w-full bg-white border border-brand-ink/15 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:border-brand-green"
          />
        </div>

        {q.error && (
          <p className="mt-6 text-red-600">Could not load members: {(q.error as Error).message}</p>
        )}

        <div className="mt-8 overflow-x-auto rounded-2xl ring-1 ring-brand-ink/10 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-brand-paper-warm/40 text-left text-[11px] uppercase tracking-[0.15em] text-brand-ink/60">
              <tr>
                <th className="px-4 py-3 font-semibold">Member ID</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Mobile</th>
                <th className="px-4 py-3 font-semibold">Plan</th>
                <th className="px-4 py-3 font-semibold">District</th>
                <th className="px-4 py-3 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => {
                const open = openId === m.id;
                return (
                  <Fragment key={m.id}>
                    <tr
                      onClick={() => setOpenId(open ? null : m.id)}
                      className="border-t border-brand-ink/5 hover:bg-brand-paper-warm/20 cursor-pointer"
                    >
                      <td className="px-4 py-3 font-mono text-xs">
                        <span aria-hidden className="mr-1 inline-block text-brand-ink/40">{open ? "▾" : "▸"}</span>
                        {m.member_code}
                      </td>
                      <td className="px-4 py-3">{m.full_name}</td>
                      <td className="px-4 py-3 text-brand-ink/70">{m.email}</td>
                      <td className="px-4 py-3 text-brand-ink/70">{m.mobile}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                            m.plan_id === "active"
                              ? "bg-brand-green/10 text-brand-green"
                              : "bg-brand-saffron/10 text-brand-saffron"
                          }`}
                        >
                          {m.plan_id}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-brand-ink/70">{m.district}, {m.state}</td>
                      <td className="px-4 py-3 text-brand-ink/70">
                        {new Date(m.joined_at).toLocaleDateString()}
                      </td>
                    </tr>
                    {open && (
                      <tr className="bg-brand-paper-warm/30 border-t border-brand-ink/5">
                        <td colSpan={7} className="px-5 py-5">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                            <Detail label="Parent / Guardian" value={m.parent_name} />
                            <Detail label="Alt mobile" value={m.alt_mobile} />
                            <Detail label="Alt email" value={m.alt_email} />
                            <Detail label="Amount paid" value={`₹${m.amount_inr}`} />
                            <Detail label="Address" value={m.address} className="col-span-2" />
                            <Detail label="Town / Village" value={m.town} />
                            <Detail label="Country" value={m.country} />
                            <Detail label="Valid until" value={new Date(m.expires_at).toLocaleDateString()} />
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
              {!q.isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-brand-ink/50">
                    No members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string | null | undefined;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-[10px] uppercase tracking-wider text-brand-ink/40">{label}</p>
      <p className="mt-0.5 text-brand-ink/80 break-words">{value || "—"}</p>
    </div>
  );
}
