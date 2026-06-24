-- SEC-04 (defense in depth): replace the always-true INSERT check with real
-- validation so even direct PostgREST calls must pass length + basic email checks.
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;
CREATE POLICY "Anyone can submit contact messages"
  ON public.contact_messages FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(btrim(name))    between 1 and 120 and
    char_length(btrim(email))   between 3 and 160 and
    position('@' in email) > 1 and
    char_length(btrim(message)) between 1 and 5000
  );
