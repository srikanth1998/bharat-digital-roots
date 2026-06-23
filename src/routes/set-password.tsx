import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/set-password")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Set a new password — Feathers Forum" }],
  }),
  component: SetPassword,
});

function SetPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      if (!data.user) {
        void navigate({ to: "/login" });
      } else {
        setReady(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, [navigate]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const pw = String(fd.get("password") || "");
    const confirm = String(fd.get("confirm") || "");
    if (pw.length < 8) return setError("Password must be at least 8 characters.");
    if (pw !== confirm) return setError("Passwords don't match.");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: pw,
      data: { must_change_password: false },
    });
    setLoading(false);
    if (error) return setError(error.message);
    await navigate({ to: "/account" });
  }

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-brand-paper flex items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <Link to="/" className="text-sm text-brand-green/70 hover:text-brand-green">← Back to home</Link>
        <h1 className="mt-6 font-serif text-4xl font-medium tracking-tight">Set your password.</h1>
        <p className="mt-2 text-brand-ink/60">
          Choose a new password to replace the temporary one. You'll use this from now on.
        </p>

        <form className="mt-8 space-y-5" onSubmit={onSubmit}>
          <div>
            <label className="text-[11px] uppercase tracking-[0.2em] text-brand-ink/50 font-semibold">
              New password
            </label>
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              className="mt-2 w-full bg-transparent border-b border-brand-ink/20 py-2 focus:outline-none focus:border-brand-green transition-colors"
            />
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-[0.2em] text-brand-ink/50 font-semibold">
              Confirm password
            </label>
            <input
              name="confirm"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              className="mt-2 w-full bg-transparent border-b border-brand-ink/20 py-2 focus:outline-none focus:border-brand-green transition-colors"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-green text-brand-paper py-3 rounded-full font-medium hover:bg-brand-green-deep transition-colors disabled:opacity-60"
          >
            {loading ? "Saving…" : "Save and continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
