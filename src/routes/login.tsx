import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import logoBlack from "@/assets/feathers-logo-black.png.asset.json";
import logoLight from "@/assets/feathers-logo.png.asset.json";



export const Route = createFileRoute("/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Login Portal — Feathers Community Forum" },
      { name: "description", content: "Sign in to the Feathers Community Forum member portal." },
      { property: "og:title", content: "Login Portal — Feathers Community Forum" },
      { property: "og:description", content: "Access your Feathers Forum member account." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");
    if (!email || !password) return;
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }

    const mustChange = (data.user?.user_metadata as { must_change_password?: boolean } | null)?.must_change_password;
    if (mustChange) {
      await navigate({ to: "/set-password" });
      return;
    }

    // Check admin role and route accordingly
    try {
      const { data: roleRows } = await supabase.from("user_roles").select("role").eq("user_id", data.user!.id);
      const isAdmin = (roleRows ?? []).some((r) => r.role === "admin");
      await navigate({ to: isAdmin ? "/admin" : "/account" });
    } catch {
      await navigate({ to: "/account" });
    }
  }

  return (
    <div className="min-h-screen bg-brand-paper grid lg:grid-cols-2">
      <div className="hidden lg:block relative bg-brand-green overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(212,131,59,0.25),transparent_60%)]" />
        <div className="relative z-10 h-full flex flex-col justify-between p-12 text-brand-paper">
          <Link to="/" className="inline-block">
            <img src={logoLight.url} alt="Feathers Community Forum International" className="h-24 w-auto" />
          </Link>

          <div>
            <p className="font-serif italic text-3xl leading-snug max-w-md">
              "We rise by lifting the community we belong to."
            </p>
            <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-brand-paper/60">— AKR Kali, Founder</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8">
          <div>
            <Link to="/" className="text-sm text-brand-green/70 hover:text-brand-green">
              ← Back to home
            </Link>
            <h1 className="mt-6 font-serif text-4xl font-medium tracking-tight">Welcome back.</h1>
            <p className="mt-2 text-brand-ink/60">
              Sign in with the email and temporary password from your welcome message.
            </p>
          </div>


          <form className="space-y-5" onSubmit={onSubmit}>
            <div>
              <label
                htmlFor="login-email"
                className="text-[11px] uppercase tracking-[0.2em] text-brand-ink/50 font-semibold"
              >
                Email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-2 w-full bg-transparent border-b border-brand-ink/20 py-2 focus:outline-none focus:border-brand-green transition-colors"
              />
            </div>
            <div>
              <label
                htmlFor="login-password"
                className="text-[11px] uppercase tracking-[0.2em] text-brand-ink/50 font-semibold"
              >
                Password
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-2 w-full bg-transparent border-b border-brand-ink/20 py-2 focus:outline-none focus:border-brand-green transition-colors"
              />
            </div>
            <div className="text-right -mt-2">
              <Link to="/forgot-password" className="text-xs text-brand-ink/50 hover:text-brand-green">
                Forgot password?
              </Link>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-green text-brand-paper py-3 rounded-full font-medium hover:bg-brand-green-deep transition-colors disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="text-sm text-brand-ink/60 text-center">
            Not a member yet?{" "}
            <Link to="/membership" className="text-brand-saffron font-medium hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
