
-- ============ ROLES ============
CREATE TYPE public.app_role AS ENUM ('admin', 'member');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can view own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- has_role helper (security definer to avoid recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- ============ MEMBERS ============
CREATE SEQUENCE public.member_code_seq START 1;

CREATE TABLE public.members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  member_code text NOT NULL UNIQUE,

  full_name text NOT NULL,
  parent_name text,
  mobile text NOT NULL,
  alt_mobile text,
  email text NOT NULL,
  alt_email text,

  address text NOT NULL,
  country text NOT NULL,
  state text NOT NULL,
  district text NOT NULL,
  town text NOT NULL,

  plan_id text NOT NULL CHECK (plan_id IN ('active', 'passive')),
  amount_inr integer NOT NULL,

  razorpay_order_id text,
  razorpay_payment_id text,

  joined_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '1 year'),

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, UPDATE ON public.members TO authenticated;
GRANT ALL ON public.members TO service_role;

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members can view own record"
  ON public.members FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "admins can view all members"
  ON public.members FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "members can update own record"
  ON public.members FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER members_set_updated_at
  BEFORE UPDATE ON public.members
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- member_code generator
CREATE OR REPLACE FUNCTION public.generate_member_code(_plan text)
RETURNS text LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  prefix text;
  yr text;
  n bigint;
BEGIN
  prefix := CASE WHEN _plan = 'active' THEN 'A' ELSE 'P' END;
  yr := to_char(now(), 'YYYY');
  n := nextval('public.member_code_seq');
  RETURN 'VNY-' || prefix || '-' || yr || '-' || lpad(n::text, 4, '0');
END; $$;
