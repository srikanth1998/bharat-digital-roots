import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { getMyRole } from "@/lib/members.functions";
import { getAllContactMessages } from "@/lib/contact.functions";

export const Route = createFileRoute("/_authenticated/admin-messages")({
  ssr: false,
  beforeLoad: async () => {
    const { isAdmin } = await getMyRole();
    if (!isAdmin) throw redirect({ to: "/account" });
  },
  head: () => ({ meta: [{ title: "Admin — Contact Messages" }] }),
  component: AdminMessages,
});

function AdminMessages() {
  const fetchAll = useServerFn(getAllContactMessages);
  const q = useQuery({ queryKey: ["contact-messages"], queryFn: () => fetchAll() });
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const rows = q.data ?? [];
    const s = search.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) =>
      [r.name, r.email, r.message, r.district, r.state, r.town]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(s)),
    );
  }, [q.data, search]);

  return (
    <div className="min-h-screen bg-brand-paper">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <Link to="/account" className="text-sm text-brand-green/70 hover:text-brand-green">
              ← Back to my account
            </Link>
            <h1 className="mt-4 font-serif text-4xl font-medium tracking-tight">Contact messages</h1>
            <p className="mt-1 text-brand-ink/60">
              {q.data ? `${q.data.length} total · ${filtered.length} shown` : "Loading…"}
            </p>
            <div className="mt-3 flex gap-3 text-sm">
              <Link to="/admin" className="text-brand-green/80 hover:text-brand-green underline-offset-4 hover:underline">Members</Link>
              <span className="text-brand-ink/30">·</span>
              <span className="text-brand-ink font-semibold">Messages</span>
            </div>
          </div>
          <input
            type="search"
            placeholder="Search name, email, message…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-80 max-w-full bg-white border border-brand-ink/15 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:border-brand-green"
          />
        </div>

        {q.error && (
          <p className="mt-6 text-red-600">Could not load messages: {(q.error as Error).message}</p>
        )}

        <div className="mt-8 space-y-3">
          {filtered.map((m) => {
            const open = openId === m.id;
            return (
              <div key={m.id} className="bg-white rounded-2xl ring-1 ring-brand-ink/10 overflow-hidden">
                <button
                  onClick={() => setOpenId(open ? null : m.id)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-brand-paper-warm/30 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">{m.name} <span className="text-brand-ink/50 font-normal">· {m.email}</span></p>
                    <p className="mt-1 text-sm text-brand-ink/70 truncate">{m.message}</p>
                  </div>
                  <div className="shrink-0 text-xs text-brand-ink/50">
                    {new Date(m.created_at).toLocaleString()}
                  </div>
                </button>
                {open && (
                  <div className="px-5 pb-5 pt-1 border-t border-brand-ink/5 text-sm space-y-2">
                    <p className="whitespace-pre-wrap text-brand-ink/80">{m.message}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 text-xs text-brand-ink/70">
                      {m.town && <div><span className="text-brand-ink/40 uppercase tracking-wider text-[10px]">Town</span><div>{m.town}</div></div>}
                      {m.district && <div><span className="text-brand-ink/40 uppercase tracking-wider text-[10px]">District</span><div>{m.district}</div></div>}
                      {m.state && <div><span className="text-brand-ink/40 uppercase tracking-wider text-[10px]">State</span><div>{m.state}</div></div>}
                      {m.country && <div><span className="text-brand-ink/40 uppercase tracking-wider text-[10px]">Country</span><div>{m.country}</div></div>}
                      {m.address && <div className="col-span-2 md:col-span-4"><span className="text-brand-ink/40 uppercase tracking-wider text-[10px]">Address</span><div>{m.address}</div></div>}
                    </div>
                    <div className="pt-2">
                      <a
                        href={`mailto:${m.email}?subject=Re: your message to Vanya`}
                        className="inline-block bg-brand-green text-brand-paper px-4 py-2 rounded-full text-xs font-medium hover:bg-brand-green-deep transition-colors"
                      >
                        Reply by email
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {!q.isLoading && filtered.length === 0 && (
            <div className="px-4 py-12 text-center text-brand-ink/50 bg-white rounded-2xl ring-1 ring-brand-ink/10">
              No messages yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
