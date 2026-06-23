import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login Portal — Vanya" },
      { name: "description", content: "Sign in to the Vanya member portal." },
      { property: "og:title", content: "Login Portal — Vanya" },
      { property: "og:description", content: "Access your Vanya member account." },
    ],
  }),
  component: Login,
});

function Login() {
  return (
    <div className="min-h-screen bg-brand-paper grid lg:grid-cols-2">
      <div className="hidden lg:block relative bg-brand-green overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(212,131,59,0.25),transparent_60%)]" />
        <div className="relative z-10 h-full flex flex-col justify-between p-12 text-brand-paper">
          <Link to="/" className="font-serif text-xl font-semibold">Vanya</Link>
          <div>
            <p className="font-serif italic text-3xl leading-snug max-w-md">
              “The soil remembers every hand that has tended it. So does this movement.”
            </p>
            <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-brand-paper/60">— Vanya Manifesto</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8">
          <div>
            <Link to="/" className="text-sm text-brand-green/70 hover:text-brand-green">← Back to home</Link>
            <h1 className="mt-6 font-serif text-4xl font-medium tracking-tight">Welcome back.</h1>
            <p className="mt-2 text-brand-ink/60">Sign in to your member portal.</p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="text-[11px] uppercase tracking-[0.2em] text-brand-ink/50 font-semibold">Email</label>
              <input type="email" required className="mt-2 w-full bg-transparent border-b border-brand-ink/20 py-2 focus:outline-none focus:border-brand-green transition-colors" />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.2em] text-brand-ink/50 font-semibold">Password</label>
              <input type="password" required className="mt-2 w-full bg-transparent border-b border-brand-ink/20 py-2 focus:outline-none focus:border-brand-green transition-colors" />
            </div>
            <button type="submit" className="w-full bg-brand-green text-brand-paper py-3 rounded-full font-medium hover:bg-brand-green-deep transition-colors">
              Sign In
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
