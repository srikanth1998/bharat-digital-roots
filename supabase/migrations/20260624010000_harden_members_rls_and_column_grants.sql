-- SEC-02: A member could UPDATE any column of their own row (plan, amount, expiry,
-- member_code, razorpay ids) because authenticated held a table-wide UPDATE grant.
-- Replace it with a column-level grant covering only editable profile fields.
REVOKE UPDATE ON public.members FROM authenticated;
GRANT UPDATE (full_name, parent_name, mobile, alt_mobile, alt_email, address, country, state, district, town)
  ON public.members TO authenticated;

-- PERF-01/02: re-create policies with (select auth.uid()) to avoid per-row re-eval,
-- and consolidate the two SELECT policies on members into one (removes multiple-permissive lint).
DROP POLICY IF EXISTS "users can view own roles" ON public.user_roles;
CREATE POLICY "users can view own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "members can view own record" ON public.members;
DROP POLICY IF EXISTS "admins can view all members" ON public.members;
DROP POLICY IF EXISTS "view members" ON public.members;
CREATE POLICY "view members"
  ON public.members FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id OR public.has_role((select auth.uid()), 'admin'));

DROP POLICY IF EXISTS "members can update own record" ON public.members;
CREATE POLICY "members can update own record"
  ON public.members FOR UPDATE TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Admins can view contact messages" ON public.contact_messages;
CREATE POLICY "Admins can view contact messages"
  ON public.contact_messages FOR SELECT TO authenticated
  USING (public.has_role((select auth.uid()), 'admin'));
