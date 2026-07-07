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
  RETURN 'FFM-' || prefix || '-' || yr || '-' || lpad(n::text, 4, '0');
END; $$;

REVOKE EXECUTE ON FUNCTION public.generate_member_code(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.generate_member_code(text) TO service_role;

UPDATE public.members
SET member_code = 'FFM-' || substring(member_code from 5)
WHERE member_code LIKE 'VNY-%';