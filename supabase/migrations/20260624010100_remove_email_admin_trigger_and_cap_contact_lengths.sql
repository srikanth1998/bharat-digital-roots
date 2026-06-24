-- SEC-07: stop auto-granting admin to anyone who signs up with a hardcoded email
-- (the email is public in the repo). Seed the existing admin by user id instead.
DROP TRIGGER IF EXISTS grant_admin_on_signup ON auth.users;
DROP FUNCTION IF EXISTS public.tg_grant_admin_on_signup();

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM auth.users
WHERE id = 'aae36adb-cf2b-4c7f-beb4-c14467650a30'
ON CONFLICT (user_id, role) DO NOTHING;

-- SEC-04: bound contact_messages text fields to prevent storage-abuse / oversized payloads.
ALTER TABLE public.contact_messages
  DROP CONSTRAINT IF EXISTS contact_name_len,
  DROP CONSTRAINT IF EXISTS contact_email_len,
  DROP CONSTRAINT IF EXISTS contact_message_len,
  DROP CONSTRAINT IF EXISTS contact_loc_len;
ALTER TABLE public.contact_messages
  ADD CONSTRAINT contact_name_len    CHECK (char_length(name) <= 120),
  ADD CONSTRAINT contact_email_len   CHECK (char_length(email) <= 160),
  ADD CONSTRAINT contact_message_len CHECK (char_length(message) <= 5000),
  ADD CONSTRAINT contact_loc_len     CHECK (
    coalesce(char_length(address),0) <= 400 AND
    coalesce(char_length(country),0) <= 80  AND
    coalesce(char_length(state),0)   <= 80  AND
    coalesce(char_length(district),0)<= 80  AND
    coalesce(char_length(town),0)    <= 120
  );
