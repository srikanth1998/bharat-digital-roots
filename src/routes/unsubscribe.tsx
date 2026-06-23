import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/unsubscribe")({
  component: UnsubscribePage,
  validateSearch: (s: Record<string, unknown>) => ({
    token: typeof s.token === "string" ? s.token : "",
  }),
});

type Status = "validating" | "ready" | "submitting" | "success" | "already" | "invalid" | "error";

function UnsubscribePage() {
  const { token } = Route.useSearch();
  const [status, setStatus] = useState<Status>("validating");
  const [email, setEmail] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    (async () => {
      try {
        const res = await fetch(`/email/unsubscribe?token=${encodeURIComponent(token)}`);
        const data = await res.json().catch(() => ({}));
        if (res.ok && data?.valid) {
          setEmail(data.email ?? null);
          setStatus(data.already_unsubscribed ? "already" : "ready");
        } else {
          setStatus("invalid");
        }
      } catch {
        setStatus("error");
      }
    })();
  }, [token]);

  async function confirm() {
    setStatus("submitting");
    try {
      const res = await fetch("/email/unsubscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data?.error ?? "Unable to unsubscribe");
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-lg border bg-card p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-foreground">Email preferences</h1>

        {status === "validating" && (
          <p className="mt-4 text-sm text-muted-foreground">Checking your link…</p>
        )}

        {status === "ready" && (
          <>
            <p className="mt-4 text-sm text-muted-foreground">
              Unsubscribe {email ? <strong>{email}</strong> : "this address"} from future emails?
            </p>
            <button
              onClick={confirm}
              className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Confirm unsubscribe
            </button>
          </>
        )}

        {status === "submitting" && (
          <p className="mt-4 text-sm text-muted-foreground">Updating your preferences…</p>
        )}

        {status === "success" && (
          <p className="mt-4 text-sm text-foreground">
            You've been unsubscribed{email ? <> — <strong>{email}</strong></> : ""}. You won't receive further emails from us.
          </p>
        )}

        {status === "already" && (
          <p className="mt-4 text-sm text-foreground">
            {email ? <strong>{email}</strong> : "This address"} is already unsubscribed.
          </p>
        )}

        {status === "invalid" && (
          <p className="mt-4 text-sm text-destructive">This unsubscribe link is invalid or has expired.</p>
        )}

        {status === "error" && (
          <p className="mt-4 text-sm text-destructive">{errorMsg || "Something went wrong. Please try again."}</p>
        )}
      </div>
    </div>
  );
}
