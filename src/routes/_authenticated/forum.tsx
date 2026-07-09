import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  getMyRoleContext,
  claimSenatePresident,
  listUnits,
  listPosts,
  createPost,
  deletePost,
  listPolicies,
  createPolicy,
  listAdminAssignments,
  assignAdmin,
  revokeAdmin,
  createUnit,
  deleteUnit,
  setMyBranch,
  LEVEL_LIST,
  POST_KINDS,
  ROLE_LIST,
  type CaucusLevel,
  type PostKind,
} from "@/lib/forum.functions";

export const Route = createFileRoute("/_authenticated/forum")({
  head: () => ({ meta: [{ title: "Forum Dashboard — Feathers Community Forum" }] }),
  component: ForumDashboard,
});

type Unit = { id: string; level: CaucusLevel; name: string; slug: string | null; parent_id: string | null };

function ancestorsOf(unitId: string | null, unitMap: Map<string, Unit>): Unit[] {
  const chain: Unit[] = [];
  let cur = unitId ? unitMap.get(unitId) : undefined;
  while (cur) {
    chain.unshift(cur);
    cur = cur.parent_id ? unitMap.get(cur.parent_id) : undefined;
  }
  return chain;
}

function descendantsOf(unitId: string, unitMap: Map<string, Unit>): Set<string> {
  const out = new Set<string>([unitId]);
  const children = new Map<string, Unit[]>();
  unitMap.forEach((u) => {
    if (u.parent_id) {
      if (!children.has(u.parent_id)) children.set(u.parent_id, []);
      children.get(u.parent_id)!.push(u);
    }
  });
  const stack = [unitId];
  while (stack.length) {
    const id = stack.pop()!;
    for (const c of children.get(id) ?? []) {
      if (!out.has(c.id)) {
        out.add(c.id);
        stack.push(c.id);
      }
    }
  }
  return out;
}

function ForumDashboard() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fetchCtx = useServerFn(getMyRoleContext);
  const fetchUnits = useServerFn(listUnits);
  const fetchPosts = useServerFn(listPosts);
  const claim = useServerFn(claimSenatePresident);
  const setBranch = useServerFn(setMyBranch);

  const ctxQ = useQuery({ queryKey: ["forum-ctx"], queryFn: () => fetchCtx() });
  const unitsQ = useQuery({ queryKey: ["units"], queryFn: () => fetchUnits() });
  const postsQ = useQuery({ queryKey: ["posts"], queryFn: () => fetchPosts({ data: {} }) });

  async function handleSignOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    await navigate({ to: "/login", replace: true });
  }

  const ctx = ctxQ.data;
  const units = unitsQ.data ?? [];
  const unitMap = useMemo(() => new Map<string, Unit>(units.map((u) => [u.id, u as Unit])), [units]);

  if (ctxQ.isLoading || unitsQ.isLoading) {
    return <Shell onSignOut={handleSignOut}><p className="text-brand-ink/60">Loading…</p></Shell>;
  }
  if (ctxQ.error) {
    return <Shell onSignOut={handleSignOut}><p className="text-red-600">{(ctxQ.error as Error).message}</p></Shell>;
  }
  if (!ctx) return null;

  const roleLabel = ctx.isSenatePresident
    ? "Senate President"
    : ctx.isSenateMember
      ? "Senate Member"
      : ctx.adminAssignments[0]
        ? prettyRole(ctx.adminAssignments[0].role)
        : "Member";

  return (
    <Shell onSignOut={handleSignOut}>
      <header className="mb-10">
        <p className="text-[11px] uppercase tracking-[0.3em] text-brand-saffron font-semibold">Forum Dashboard</p>
        <h1 className="mt-2 font-serif text-4xl font-medium tracking-tight">
          {ctx.memberName ?? "Welcome"}
        </h1>
        <p className="mt-1 text-brand-ink/60">Signed in as <span className="font-medium">{roleLabel}</span></p>
      </header>

      {/* Bootstrap: claim senate president */}
      {!ctx.isSenate && ctx.adminAssignments.length === 0 && (
        <BootstrapCard onClaim={async () => {
          try {
            await claim();
            await qc.invalidateQueries();
          } catch (e) {
            alert((e as Error).message);
          }
        }} />
      )}

      {/* Set my branch (if member and no branch assigned) */}
      {ctx.memberCode && !ctx.memberUnitId && (
        <div className="mb-8 rounded-xl border border-brand-ink/10 p-6 bg-white">
          <p className="text-sm text-brand-ink/70">You haven't been placed under a Caucus branch yet. Pick your branch to see local posts.</p>
          <BranchPicker
            units={units as Unit[]}
            onPick={async (unitId) => {
              await setBranch({ data: { unitId } });
              await qc.invalidateQueries();
            }}
          />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-8">
          <PostsSection
            ctx={ctx}
            units={units as Unit[]}
            posts={postsQ.data ?? []}
          />
        </section>
        <aside className="space-y-8">
          <HierarchyCard units={units as Unit[]} memberUnitId={ctx.memberUnitId} />
          {ctx.isSenate && <PoliciesCard isPresident={ctx.isSenatePresident} />}
          {ctx.isSenatePresident && <>
            <UnitsAdminCard units={units as Unit[]} />
            <AdminsCard units={units as Unit[]} />
          </>}
        </aside>
      </div>
    </Shell>
  );
}

function Shell({ children, onSignOut }: { children: React.ReactNode; onSignOut: () => void }) {
  return (
    <div className="min-h-screen bg-brand-paper">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="text-sm text-brand-green/70 hover:text-brand-green">← Back to home</Link>
          <div className="flex items-center gap-4">
            <Link to="/account" className="text-sm text-brand-ink/60 hover:text-brand-ink">My Account</Link>
            <button onClick={onSignOut} className="text-sm text-brand-ink/60 hover:text-brand-ink">Sign out</button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

function BootstrapCard({ onClaim }: { onClaim: () => Promise<void> }) {
  return (
    <div className="mb-8 rounded-xl border border-brand-saffron/40 p-6 bg-brand-saffron/5">
      <p className="text-[11px] uppercase tracking-[0.2em] text-brand-saffron font-semibold">Bootstrap</p>
      <p className="mt-2 font-serif text-xl">Claim Senate President</p>
      <p className="mt-1 text-sm text-brand-ink/70">
        If no Senate President exists yet, you can claim the role. This is a one-time action.
      </p>
      <button
        onClick={onClaim}
        className="mt-4 bg-brand-green text-brand-paper text-sm font-medium px-4 py-2 rounded-full hover:bg-brand-green-deep"
      >
        Claim Senate President
      </button>
    </div>
  );
}

function BranchPicker({ units, onPick }: { units: Unit[]; onPick: (id: string) => void | Promise<void> }) {
  const branches = units.filter((u) => u.level === "branch");
  const [val, setVal] = useState("");
  return (
    <div className="mt-3 flex gap-2">
      <select
        value={val}
        onChange={(e) => setVal(e.target.value)}
        className="flex-1 border border-brand-ink/20 rounded-md px-3 py-2 text-sm bg-white"
      >
        <option value="">Select branch…</option>
        {branches.map((b) => (
          <option key={b.id} value={b.id}>{b.name}</option>
        ))}
      </select>
      <button
        disabled={!val}
        onClick={() => val && onPick(val)}
        className="bg-brand-green text-brand-paper text-sm font-medium px-4 py-2 rounded-md hover:bg-brand-green-deep disabled:opacity-50"
      >
        Save
      </button>
    </div>
  );
}

function HierarchyCard({ units, memberUnitId }: { units: Unit[]; memberUnitId: string | null }) {
  const unitMap = useMemo(() => new Map(units.map((u) => [u.id, u])), [units]);
  const chain = ancestorsOf(memberUnitId, unitMap);
  return (
    <div className="rounded-xl border border-brand-ink/10 p-5 bg-white">
      <p className="text-[11px] uppercase tracking-[0.2em] text-brand-ink/50 font-semibold">Your Hierarchy</p>
      {chain.length === 0 ? (
        <p className="mt-3 text-sm text-brand-ink/60">Not placed under a branch yet.</p>
      ) : (
        <ol className="mt-3 space-y-1 text-sm">
          {chain.map((u, i) => (
            <li key={u.id} className="flex items-baseline gap-2">
              <span className="text-[10px] uppercase tracking-wider text-brand-ink/40 w-16">{u.level}</span>
              <span className={i === chain.length - 1 ? "font-medium text-brand-green" : "text-brand-ink"}>{u.name}</span>
            </li>
          ))}
        </ol>
      )}
      <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-brand-ink/50 font-semibold">Caucus Levels</p>
      <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-brand-ink/70">
        {LEVEL_LIST.map((l) => (
          <div key={l} className="flex items-center justify-between">
            <span className="capitalize">{l}</span>
            <span className="text-brand-ink/40">{units.filter((u) => u.level === l).length}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PostsSection({
  ctx, units, posts,
}: {
  ctx: NonNullable<Awaited<ReturnType<typeof getMyRoleContext>>>;
  units: Unit[];
  posts: Awaited<ReturnType<typeof listPosts>>;
}) {
  const qc = useQueryClient();
  const create = useServerFn(createPost);
  const del = useServerFn(deletePost);
  const unitMap = useMemo(() => new Map(units.map((u) => [u.id, u])), [units]);

  const canPostUnits = useMemo(() => {
    if (ctx.isSenatePresident) return units;
    const ids = new Set<string>();
    for (const a of ctx.adminAssignments) {
      if (!a.unit_id) continue;
      for (const id of descendantsOf(a.unit_id, unitMap)) ids.add(id);
    }
    return units.filter((u) => ids.has(u.id));
  }, [ctx, units, unitMap]);

  const canPost = canPostUnits.length > 0;

  const [kind, setKind] = useState<PostKind>("announcement");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [unitId, setUnitId] = useState<string>("");
  const [eventStartsAt, setEventStartsAt] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [posting, setPosting] = useState(false);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setPosting(true);
    try {
      await create({
        data: {
          kind,
          title,
          body,
          unitId: unitId || (ctx.isSenatePresident ? null : canPostUnits[0]?.id ?? null),
          eventStartsAt: kind === "event" && eventStartsAt ? new Date(eventStartsAt).toISOString() : null,
          eventLocation: kind === "event" ? eventLocation : null,
        },
      });
      setTitle(""); setBody(""); setEventStartsAt(""); setEventLocation("");
      await qc.invalidateQueries({ queryKey: ["posts"] });
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setPosting(false);
    }
  }

  return (
    <>
      {canPost && (
        <form onSubmit={onCreate} className="rounded-xl border border-brand-ink/10 p-5 bg-white">
          <p className="text-[11px] uppercase tracking-[0.2em] text-brand-ink/50 font-semibold">Create Post</p>
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            <label className="text-xs text-brand-ink/60">
              Kind
              <select value={kind} onChange={(e) => setKind(e.target.value as PostKind)}
                className="mt-1 w-full border border-brand-ink/20 rounded-md px-3 py-2 text-sm bg-white">
                {POST_KINDS.filter((k) => k !== "policy" || ctx.isSenate).map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </label>
            <label className="text-xs text-brand-ink/60">
              Scope
              <select value={unitId} onChange={(e) => setUnitId(e.target.value)}
                className="mt-1 w-full border border-brand-ink/20 rounded-md px-3 py-2 text-sm bg-white">
                {ctx.isSenatePresident && <option value="">Senate-wide (all)</option>}
                {canPostUnits.map((u) => (
                  <option key={u.id} value={u.id}>{u.level}: {u.name}</option>
                ))}
              </select>
            </label>
          </div>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={200}
            placeholder="Title"
            className="mt-3 w-full border border-brand-ink/20 rounded-md px-3 py-2 text-sm" />
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3}
            placeholder="Body"
            className="mt-2 w-full border border-brand-ink/20 rounded-md px-3 py-2 text-sm" />
          {kind === "event" && (
            <div className="mt-2 grid sm:grid-cols-2 gap-2">
              <input type="datetime-local" value={eventStartsAt} onChange={(e) => setEventStartsAt(e.target.value)}
                className="border border-brand-ink/20 rounded-md px-3 py-2 text-sm" />
              <input value={eventLocation} onChange={(e) => setEventLocation(e.target.value)}
                placeholder="Location"
                className="border border-brand-ink/20 rounded-md px-3 py-2 text-sm" />
            </div>
          )}
          <button disabled={posting}
            className="mt-3 bg-brand-green text-brand-paper text-sm font-medium px-4 py-2 rounded-full hover:bg-brand-green-deep disabled:opacity-60">
            {posting ? "Posting…" : "Publish"}
          </button>
        </form>
      )}

      <div className="rounded-xl border border-brand-ink/10 bg-white">
        <div className="p-5 border-b border-brand-ink/10 flex items-baseline justify-between">
          <p className="text-[11px] uppercase tracking-[0.2em] text-brand-ink/50 font-semibold">Feed</p>
          <span className="text-xs text-brand-ink/40">{posts.length} posts visible to you</span>
        </div>
        {posts.length === 0 ? (
          <p className="p-8 text-center text-sm text-brand-ink/50">No posts yet.</p>
        ) : (
          <ul className="divide-y divide-brand-ink/10">
            {posts.map((p) => {
              const scope = p.unit_id ? unitMap.get(p.unit_id) : null;
              const canDelete = p.author_id === ctx.userId || ctx.isSenatePresident;
              return (
                <li key={p.id} className="p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <div>
                      <span className={badgeClass(p.kind as PostKind)}>{p.kind}</span>
                      <h3 className="mt-2 font-serif text-lg">{p.title}</h3>
                      <p className="text-[11px] uppercase tracking-wider text-brand-ink/40 mt-1">
                        {scope ? `${scope.level} · ${scope.name}` : "Senate-wide"}
                        {" · "}{new Date(p.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {canDelete && (
                      <button
                        onClick={async () => {
                          if (!confirm("Delete this post?")) return;
                          await del({ data: { id: p.id } });
                          await qc.invalidateQueries({ queryKey: ["posts"] });
                        }}
                        className="text-xs text-red-600 hover:underline"
                      >Delete</button>
                    )}
                  </div>
                  {p.body && <p className="mt-3 text-sm text-brand-ink/80 whitespace-pre-wrap">{p.body}</p>}
                  {p.kind === "event" && (p.event_starts_at || p.event_location) && (
                    <p className="mt-2 text-xs text-brand-ink/60">
                      {p.event_starts_at && new Date(p.event_starts_at).toLocaleString()}
                      {p.event_location && ` · ${p.event_location}`}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}

function PoliciesCard({ isPresident }: { isPresident: boolean }) {
  const qc = useQueryClient();
  const fetchPolicies = useServerFn(listPolicies);
  const create = useServerFn(createPolicy);
  const q = useQuery({ queryKey: ["policies"], queryFn: () => fetchPolicies() });
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  return (
    <div className="rounded-xl border border-brand-ink/10 p-5 bg-white">
      <p className="text-[11px] uppercase tracking-[0.2em] text-brand-ink/50 font-semibold">Policies (Senate)</p>
      {isPresident && (
        <form onSubmit={async (e) => {
          e.preventDefault();
          if (!title.trim()) return;
          try {
            await create({ data: { title, body, status: "draft" } });
            setTitle(""); setBody("");
            await qc.invalidateQueries({ queryKey: ["policies"] });
          } catch (err) { alert((err as Error).message); }
        }} className="mt-3 space-y-2">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Policy title"
            className="w-full border border-brand-ink/20 rounded-md px-3 py-2 text-sm" />
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={2} placeholder="Draft body"
            className="w-full border border-brand-ink/20 rounded-md px-3 py-2 text-sm" />
          <button className="bg-brand-green text-brand-paper text-xs font-medium px-3 py-1.5 rounded-full">Draft policy</button>
        </form>
      )}
      <ul className="mt-4 space-y-2">
        {(q.data ?? []).map((p) => (
          <li key={p.id} className="text-sm">
            <p className="font-medium">{p.title}</p>
            <p className="text-[10px] uppercase tracking-wider text-brand-ink/40">{p.status}</p>
          </li>
        ))}
        {q.data && q.data.length === 0 && <li className="text-xs text-brand-ink/50">No policies yet.</li>}
      </ul>
    </div>
  );
}

function UnitsAdminCard({ units }: { units: Unit[] }) {
  const qc = useQueryClient();
  const create = useServerFn(createUnit);
  const del = useServerFn(deleteUnit);
  const [level, setLevel] = useState<CaucusLevel>("continent");
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<string>("");
  const parentCandidates = units.filter((u) => {
    const idx = LEVEL_LIST.indexOf(level);
    return idx > 0 && u.level === LEVEL_LIST[idx - 1];
  });
  return (
    <div className="rounded-xl border border-brand-ink/10 p-5 bg-white">
      <p className="text-[11px] uppercase tracking-[0.2em] text-brand-ink/50 font-semibold">Caucus Units</p>
      <form className="mt-3 space-y-2" onSubmit={async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        try {
          await create({ data: { level, name, parentId: parentId || null } });
          setName(""); setParentId("");
          await qc.invalidateQueries({ queryKey: ["units"] });
        } catch (err) { alert((err as Error).message); }
      }}>
        <select value={level} onChange={(e) => { setLevel(e.target.value as CaucusLevel); setParentId(""); }}
          className="w-full border border-brand-ink/20 rounded-md px-3 py-2 text-sm bg-white">
          {LEVEL_LIST.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        {level !== "continent" && (
          <select value={parentId} onChange={(e) => setParentId(e.target.value)}
            className="w-full border border-brand-ink/20 rounded-md px-3 py-2 text-sm bg-white">
            <option value="">Select parent…</option>
            {parentCandidates.map((p) => <option key={p.id} value={p.id}>{p.level}: {p.name}</option>)}
          </select>
        )}
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name"
          className="w-full border border-brand-ink/20 rounded-md px-3 py-2 text-sm" />
        <button className="bg-brand-green text-brand-paper text-xs font-medium px-3 py-1.5 rounded-full">Add unit</button>
      </form>
      <ul className="mt-4 max-h-56 overflow-auto text-xs space-y-1">
        {units.map((u) => (
          <li key={u.id} className="flex items-baseline justify-between gap-2">
            <span><span className="text-brand-ink/40 uppercase tracking-wider mr-1">{u.level}</span>{u.name}</span>
            <button
              onClick={async () => {
                if (!confirm(`Delete ${u.name}? Children will be removed.`)) return;
                await del({ data: { id: u.id } });
                await qc.invalidateQueries({ queryKey: ["units"] });
              }}
              className="text-red-600 hover:underline"
            >×</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AdminsCard({ units }: { units: Unit[] }) {
  const qc = useQueryClient();
  const fetchA = useServerFn(listAdminAssignments);
  const assign = useServerFn(assignAdmin);
  const revoke = useServerFn(revokeAdmin);
  const q = useQuery({ queryKey: ["assignments"], queryFn: () => fetchA() });
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState<typeof ROLE_LIST[number]>("branch_admin");
  const [unitId, setUnitId] = useState("");

  const requiresUnit = !["senate_president", "senate_member", "member"].includes(role);
  const eligibleUnits = units.filter((u) => {
    if (!requiresUnit) return false;
    const map: Record<string, CaucusLevel> = {
      continent_admin: "continent", country_admin: "country", zone_admin: "zone",
      state_admin: "state", district_admin: "district", branch_admin: "branch",
    };
    return u.level === map[role];
  });
  return (
    <div className="rounded-xl border border-brand-ink/10 p-5 bg-white">
      <p className="text-[11px] uppercase tracking-[0.2em] text-brand-ink/50 font-semibold">Admin Assignments</p>
      <form onSubmit={async (e) => {
        e.preventDefault();
        if (!userId) return;
        try {
          await assign({ data: { userId, role, unitId: requiresUnit ? unitId || null : null } });
          setUserId(""); setUnitId("");
          await qc.invalidateQueries({ queryKey: ["assignments"] });
        } catch (err) { alert((err as Error).message); }
      }} className="mt-3 space-y-2">
        <input value={userId} onChange={(e) => setUserId(e.target.value)}
          placeholder="User UUID (from Supabase auth)"
          className="w-full border border-brand-ink/20 rounded-md px-3 py-2 text-xs font-mono" />
        <select value={role} onChange={(e) => setRole(e.target.value as typeof ROLE_LIST[number])}
          className="w-full border border-brand-ink/20 rounded-md px-3 py-2 text-sm bg-white">
          {ROLE_LIST.map((r) => <option key={r} value={r}>{prettyRole(r)}</option>)}
        </select>
        {requiresUnit && (
          <select value={unitId} onChange={(e) => setUnitId(e.target.value)}
            className="w-full border border-brand-ink/20 rounded-md px-3 py-2 text-sm bg-white">
            <option value="">Select unit…</option>
            {eligibleUnits.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        )}
        <button className="bg-brand-green text-brand-paper text-xs font-medium px-3 py-1.5 rounded-full">Assign</button>
      </form>
      <ul className="mt-4 max-h-56 overflow-auto text-xs space-y-1">
        {(q.data ?? []).map((a) => {
          const u = a.unit_id ? units.find((x) => x.id === a.unit_id) : null;
          return (
            <li key={a.id} className="flex items-baseline justify-between gap-2">
              <span>
                <span className="text-brand-ink/40 mr-1">{prettyRole(a.role)}</span>
                {u ? `· ${u.name}` : ""}
                <span className="ml-2 font-mono text-brand-ink/40">{a.user_id.slice(0, 8)}</span>
              </span>
              <button onClick={async () => {
                await revoke({ data: { id: a.id } });
                await qc.invalidateQueries({ queryKey: ["assignments"] });
              }} className="text-red-600 hover:underline">×</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function badgeClass(k: PostKind) {
  const base = "inline-block px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold";
  switch (k) {
    case "event": return `${base} bg-brand-saffron/20 text-brand-saffron`;
    case "news": return `${base} bg-brand-green/15 text-brand-green`;
    case "announcement": return `${base} bg-brand-ink/10 text-brand-ink`;
    case "policy": return `${base} bg-red-100 text-red-700`;
  }
}

function prettyRole(r: string) {
  return r.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
