-- FUNC-01: email routes reference these tables but they never existed.
-- Create them, service-role-only (RLS on, no anon/authenticated policies).

CREATE TABLE IF NOT EXISTS public.email_unsubscribe_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text NOT NULL UNIQUE,
  email text NOT NULL UNIQUE,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.suppressed_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  reason text NOT NULL,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.email_send_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id text,
  template_name text,
  recipient_email text,
  status text,
  error_message text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.email_unsubscribe_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppressed_emails       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_send_log          ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.email_unsubscribe_tokens FROM anon, authenticated;
REVOKE ALL ON public.suppressed_emails        FROM anon, authenticated;
REVOKE ALL ON public.email_send_log           FROM anon, authenticated;

GRANT ALL ON public.email_unsubscribe_tokens TO service_role;
GRANT ALL ON public.suppressed_emails        TO service_role;
GRANT ALL ON public.email_send_log           TO service_role;
