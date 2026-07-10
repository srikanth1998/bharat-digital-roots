import { createFileRoute, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Mail } from "lucide-react";
import { getMyRole } from "@/lib/members.functions";
import { getAllContactMessages } from "@/lib/contact.functions";
import { EmptyState, LoadingRows } from "@/components/portal/empty-state";

export const Route = createFileRoute("/_authenticated/portal/messages")({
  ssr: false,
  beforeLoad: async () => {
    const { isAdmin } = await getMyRole();
    if (!isAdmin) throw redirect({ to: "/portal" });
  },
  head: () => ({ meta: [{ title: "Messages — Portal" }] }),
  component: MessagesPage,
});

const PAGE_SIZE = 20;

function MessagesPage() {
  const fetchAll = useServerFn(getAllContactMessages);
  const q = useQuery({ queryKey: ["contact-messages"], queryFn: () => fetchAll() });
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const rows = q.data ?? [];
    const s = search.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) => [r.name, r.email, r.message, r.district, r.state, r.town]
      .filter(Boolean).some((v) => String(v).toLowerCase().includes(s)));
  }, [q.data, search]);

  const counts = useMemo(() => {
    const rows = q.data ?? [];
    const now = new Date();
    const thisMonth = rows.filter((r) => {
      const d = new Date(r.created_at);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
    const last7 = rows.filter((r) => (Date.now() - new Date(r.created_at).getTime()) < 7 * 864e5).length;
    return { total: rows.length, thisMonth, last7 };
  }, [q.data]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
      <div className="flex items-baseline justify-between flex-wrap gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-brand-saffron font-semibold">Admin</p>
          <h1 className="mt-1 font-serif text-3xl md:text-4xl font-medium">Contact messages</h1>
        </div>
        <input
          type="search"
          placeholder="Search name, email, message…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          className="w-full sm:w-80 bg-white border border-brand-ink/15 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:border-brand-green"
        />
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <Stat label="Total" value={counts.total} />
        <Stat label="Last 7 days" value={counts.last7} />
        <Stat label="This month" value={counts.thisMonth} />
      </div>

      <div className="mt-6 space-y-3">
        {q.isLoading && <LoadingRows />}
        {!q.isLoading && paged.map((m) => {
          const open = openId === m.id;
          return (
            <div key={m.id} className="bg-white rounded-2xl ring-1 ring-brand-ink/10 overflow-hidden">
              <button onClick={() => setOpenId(open ? null : m.id)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-brand-paper-warm/30">
                <div className="min-w-0">
                  <p className="font-medium truncate">{m.name} <span className="text-brand-ink/50 font-normal">· {m.email}</span></p>
                  <p className="mt-1 text-sm text-brand-ink/70 truncate">{m.message}</p>
                </div>
                <div className="shrink-0 text-xs text-brand-ink/50">{new Date(m.created_at).toLocaleDateString()}</div>
              </button>
              {open && (
                <div className="px-5 pb-5 pt-1 border-t border-brand-ink/5 text-sm space-y-2">
                  <p className="whitespace-pre-wrap text-brand-ink/80">{m.message}</p>
                  <a href={`mailto:${m.email}?subject=Re: your message`}
                    className="inline-block mt-3 bg-brand-green text-brand-paper px-4 py-2 rounded-full text-xs font-medium">
                    Reply by email
                  </a>
                </div>
              )}
            </div>
          );
        })}
        {!q.isLoading && paged.length === 0 && (
          <div className="bg-white rounded-2xl ring-1 ring-brand-ink/10">
            <EmptyState icon={Mail} title="No messages yet" description="Contact form submissions will appear here." />
          </div>
        )}
      </div>

      {pages > 1 && (
        <div className="mt-6 flex items-center justify-between text-xs text-brand-ink/60">
          <span>{filtered.length} results · page {page + 1} of {pages}</span>
          <div className="flex gap-2">
            <button disabled={page === 0} onClick={() => setPage(page - 1)}
              className="px-3 py-1 rounded-full bg-white ring-1 ring-brand-ink/10 disabled:opacity-40">Prev</button>
            <button disabled={page + 1 >= pages} onClick={() => setPage(page + 1)}
              className="px-3 py-1 rounded-full bg-white ring-1 ring-brand-ink/10 disabled:opacity-40">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-white ring-1 ring-brand-ink/10 p-4">
      <p className="text-[10px] uppercase tracking-wider text-brand-ink/50 font-semibold">{label}</p>
      <p className="mt-1 font-serif text-3xl text-brand-ink">{value}</p>
    </div>
  );
}
