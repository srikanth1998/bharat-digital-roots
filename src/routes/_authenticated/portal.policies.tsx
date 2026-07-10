import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ScrollText } from "lucide-react";
import { getMyRoleContext, listPolicies, createPolicy, addPolicyCollaborator } from "@/lib/forum.functions";
import { EmptyState, LoadingCard } from "@/components/portal/empty-state";
import { MemberPicker } from "@/components/portal/member-picker";

export const Route = createFileRoute("/_authenticated/portal/policies")({
  head: () => ({ meta: [{ title: "Policies — Portal" }] }),
  component: PoliciesPage,
});

function PoliciesPage() {
  const qc = useQueryClient();
  const fetchCtx = useServerFn(getMyRoleContext);
  const fetchPolicies = useServerFn(listPolicies);
  const create = useServerFn(createPolicy);
  const addCollab = useServerFn(addPolicyCollaborator);

  const ctxQ = useQuery({ queryKey: ["forum-ctx"], queryFn: () => fetchCtx() });
  const q = useQuery({ queryKey: ["policies"], queryFn: () => fetchPolicies() });

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [collabPolicy, setCollabPolicy] = useState<string | null>(null);
  const [collabUser, setCollabUser] = useState<string | null>(null);

  const ctx = ctxQ.data;

  if (ctxQ.isLoading) return <div className="max-w-4xl mx-auto p-6"><LoadingCard /></div>;
  if (!ctx?.isSenate) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <EmptyState icon={ScrollText} title="Senate only" description="Policies are visible to Senate members." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.3em] text-brand-saffron font-semibold">Senate</p>
        <h1 className="mt-1 font-serif text-4xl font-medium">Policies</h1>
      </div>

      {ctx.isSenatePresident && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!title.trim()) return;
            try {
              await create({ data: { title, body, status: "draft" } });
              setTitle(""); setBody("");
              await qc.invalidateQueries({ queryKey: ["policies"] });
            } catch (err) { alert((err as Error).message); }
          }}
          className="rounded-xl border border-brand-ink/10 p-5 bg-white space-y-3"
        >
          <p className="text-[11px] uppercase tracking-[0.2em] text-brand-ink/50 font-semibold">Draft a policy</p>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Policy title"
            className="w-full border border-brand-ink/20 rounded-md px-3 py-2 text-sm" />
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} placeholder="Draft body"
            className="w-full border border-brand-ink/20 rounded-md px-3 py-2 text-sm" />
          <button className="bg-brand-green text-brand-paper text-xs font-semibold px-4 py-2 rounded-full hover:bg-brand-green-deep">
            Create draft
          </button>
        </form>
      )}

      <div className="rounded-xl border border-brand-ink/10 bg-white">
        {q.isLoading ? (
          <div className="p-5"><LoadingCard /></div>
        ) : (q.data ?? []).length === 0 ? (
          <EmptyState icon={ScrollText} title="No policies yet" description="Drafts will appear here." />
        ) : (
          <ul className="divide-y divide-brand-ink/10">
            {(q.data ?? []).map((p) => (
              <li key={p.id} className="p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <div>
                    <p className="font-serif text-lg">{p.title}</p>
                    <p className="text-[10px] uppercase tracking-wider text-brand-ink/40 mt-1">{p.status}</p>
                  </div>
                  {ctx.isSenatePresident && (
                    <button
                      onClick={() => setCollabPolicy(collabPolicy === p.id ? null : p.id)}
                      className="text-xs text-brand-green hover:underline"
                    >
                      {collabPolicy === p.id ? "Close" : "Add collaborator"}
                    </button>
                  )}
                </div>
                {p.body && <p className="mt-2 text-sm text-brand-ink/80 whitespace-pre-wrap">{p.body}</p>}
                {collabPolicy === p.id && (
                  <div className="mt-4 p-3 rounded-lg bg-brand-paper-warm/40 space-y-2">
                    <p className="text-[11px] uppercase tracking-wider text-brand-ink/50 font-semibold">Add Senate collaborator</p>
                    <MemberPicker value={collabUser} onChange={(uid) => setCollabUser(uid)} />
                    <button
                      disabled={!collabUser}
                      onClick={async () => {
                        try {
                          await addCollab({ data: { policyId: p.id, userId: collabUser!, permission: "edit" } });
                          setCollabPolicy(null); setCollabUser(null);
                          alert("Collaborator added.");
                        } catch (err) { alert((err as Error).message); }
                      }}
                      className="bg-brand-green text-brand-paper text-xs font-semibold px-3 py-1.5 rounded-full disabled:opacity-50"
                    >
                      Add
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
