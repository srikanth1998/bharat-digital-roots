import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/forgot-password")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Reset your password — Feathers Forum" }],
  }),
  component: ForgotPassword,
});

function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    if (!email) return;
    setLoading(true);
    const redirectTo =
      typeof window !== "undefined" ? `${window.location.origin}/set-password` : undefined;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    setLoading(false);
    // Do not reveal whether the email exists — always show the same confirmation.
    if (error && !/rate|limit/i.test(error.message)) {
      setError(error.message);
      return;
    }
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-brand-paper flex items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <Link to="/login" className="text-sm text-brand-green/70 hover:text-brand-green">← Back to login</Link>
        <h1 className="mt-6 font-serif text-4xl font-medium tracking-tight">Reset password.</h1>

        {sent ? (
          <p className="mt-4 text-brand-ink/70">
            If an account exists for that email, we've sent a link to reset your password. Check your
            inbox (and spam folder).
          </p>
        ) : (
          <>
            <p className="mt-2 text-brand-ink/60">
              Enter your email and we'll send you a link to set a new password.
            </p>
            <form className="mt-8 space-y-5" onSubmit={onSubmit}>
              <div>
                <label
                  htmlFor="reset-email"
                  className="text-[11px] uppercase tracking-[0.2em] text-brand-ink/50 font-semibold"
                >
                  Email
                </label>
                <input
                  id="reset-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-2 w-full bg-transparent border-b border-brand-ink/20 py-2 focus:outline-none focus:border-brand-green transition-colors"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-green text-brand-paper py-3 rounded-full font-medium hover:bg-brand-green-deep transition-colors disabled:opacity-60"
              >
                {loading ? "Sending…" : "Send reset link"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
