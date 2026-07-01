ALTER TABLE public.members DROP CONSTRAINT IF EXISTS members_plan_id_check;
ALTER TABLE public.members ADD CONSTRAINT members_plan_id_check
  CHECK (plan_id IN ('active', 'passive', 'active_1year', 'active_lifetime', 'passive_1year', 'passive_lifetime'));

UPDATE public.members SET plan_id = 'active_1year' WHERE plan_id = 'active';
UPDATE public.members SET plan_id = 'passive_1year' WHERE plan_id = 'passive';

ALTER TABLE public.members DROP CONSTRAINT IF EXISTS members_plan_id_check;
ALTER TABLE public.members ADD CONSTRAINT members_plan_id_check
  CHECK (plan_id IN ('active_1year', 'active_lifetime', 'passive_1year', 'passive_lifetime'));

ALTER TABLE public.members ALTER COLUMN expires_at DROP NOT NULL;

CREATE OR REPLACE FUNCTION public.generate_member_code(_plan text)
RETURNS text LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  prefix text;
  yr text;
  n bigint;
BEGIN
  prefix := CASE
    WHEN _plan IS NULL THEN 'X'
    WHEN _plan LIKE 'active%' THEN 'A'
    WHEN _plan LIKE 'passive%' THEN 'P'
    ELSE 'X'
  END;
  yr := to_char(now(), 'YYYY');
  n := nextval('public.member_code_seq');
  RETURN 'VNY-' || prefix || '-' || yr || '-' || lpad(n::text, 4, '0');
END; $$;

REVOKE EXECUTE ON FUNCTION public.generate_member_code(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.generate_member_code(text) TO service_role;
