
DO $$ BEGIN
  CREATE TYPE public.caucus_level AS ENUM ('continent','country','zone','state','district','branch');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.post_kind AS ENUM ('event','news','announcement','policy');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.geographic_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level public.caucus_level NOT NULL,
  name text NOT NULL,
  slug text,
  parent_id uuid REFERENCES public.geographic_units(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS geographic_units_parent_idx ON public.geographic_units(parent_id);
GRANT SELECT ON public.geographic_units TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.geographic_units TO authenticated;
GRANT ALL ON public.geographic_units TO service_role;
ALTER TABLE public.geographic_units ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.admin_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  unit_id uuid REFERENCES public.geographic_units(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS admin_assignments_uniq ON public.admin_assignments(user_id, role, COALESCE(unit_id, '00000000-0000-0000-0000-000000000000'::uuid));
CREATE INDEX IF NOT EXISTS admin_assignments_user_idx ON public.admin_assignments(user_id);
CREATE INDEX IF NOT EXISTS admin_assignments_unit_idx ON public.admin_assignments(unit_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_assignments TO authenticated;
GRANT ALL ON public.admin_assignments TO service_role;
ALTER TABLE public.admin_assignments ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.members ADD COLUMN IF NOT EXISTS branch_unit_id uuid REFERENCES public.geographic_units(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS members_branch_unit_idx ON public.members(branch_unit_id);

CREATE TABLE IF NOT EXISTS public.policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'draft',
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.policies TO authenticated;
GRANT ALL ON public.policies TO service_role;
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.policy_collaborators (
  policy_id uuid NOT NULL REFERENCES public.policies(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  permission text NOT NULL DEFAULT 'edit',
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (policy_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.policy_collaborators TO authenticated;
GRANT ALL ON public.policy_collaborators TO service_role;
ALTER TABLE public.policy_collaborators ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind public.post_kind NOT NULL,
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  unit_id uuid REFERENCES public.geographic_units(id) ON DELETE CASCADE,
  author_id uuid NOT NULL,
  event_starts_at timestamptz,
  event_location text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS posts_unit_idx ON public.posts(unit_id);
CREATE INDEX IF NOT EXISTS posts_kind_idx ON public.posts(kind);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT ALL ON public.posts TO service_role;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Helper functions
CREATE OR REPLACE FUNCTION public.is_senate_president(_uid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_assignments WHERE user_id = _uid AND role = 'senate_president');
$$;

CREATE OR REPLACE FUNCTION public.is_senate(_uid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_assignments WHERE user_id = _uid AND role IN ('senate_president','senate_member'));
$$;

CREATE OR REPLACE FUNCTION public.unit_ancestors(_unit_id uuid)
RETURNS TABLE(id uuid) LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  WITH RECURSIVE t AS (
    SELECT id, parent_id FROM public.geographic_units WHERE id = _unit_id
    UNION ALL
    SELECT g.id, g.parent_id FROM public.geographic_units g JOIN t ON g.id = t.parent_id
  ) SELECT id FROM t;
$$;

CREATE OR REPLACE FUNCTION public.unit_descendants(_unit_id uuid)
RETURNS TABLE(id uuid) LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  WITH RECURSIVE t AS (
    SELECT id FROM public.geographic_units WHERE id = _unit_id
    UNION ALL
    SELECT g.id FROM public.geographic_units g JOIN t ON g.parent_id = t.id
  ) SELECT id FROM t;
$$;

CREATE OR REPLACE FUNCTION public.user_admin_units(_uid uuid)
RETURNS TABLE(id uuid) LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT d.id
  FROM public.admin_assignments a
  CROSS JOIN LATERAL public.unit_descendants(a.unit_id) d
  WHERE a.user_id = _uid AND a.unit_id IS NOT NULL;
$$;

CREATE OR REPLACE FUNCTION public.user_member_unit(_uid uuid)
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT branch_unit_id FROM public.members WHERE user_id = _uid LIMIT 1;
$$;

-- Policies
CREATE POLICY "read units" ON public.geographic_units FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "senate manages units" ON public.geographic_units FOR ALL TO authenticated
  USING (public.is_senate_president(auth.uid())) WITH CHECK (public.is_senate_president(auth.uid()));

CREATE POLICY "view assignments" ON public.admin_assignments FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_senate(auth.uid()));
CREATE POLICY "senate president manages assignments" ON public.admin_assignments FOR ALL TO authenticated
  USING (public.is_senate_president(auth.uid())) WITH CHECK (public.is_senate_president(auth.uid()));

CREATE POLICY "senate reads policies" ON public.policies FOR SELECT TO authenticated
  USING (public.is_senate(auth.uid()));
CREATE POLICY "senate president inserts policies" ON public.policies FOR INSERT TO authenticated
  WITH CHECK (public.is_senate_president(auth.uid()) AND created_by = auth.uid());
CREATE POLICY "senate president or collaborators update policies" ON public.policies FOR UPDATE TO authenticated
  USING (public.is_senate_president(auth.uid()) OR EXISTS (SELECT 1 FROM public.policy_collaborators c WHERE c.policy_id = id AND c.user_id = auth.uid()))
  WITH CHECK (public.is_senate_president(auth.uid()) OR EXISTS (SELECT 1 FROM public.policy_collaborators c WHERE c.policy_id = id AND c.user_id = auth.uid()));
CREATE POLICY "senate president deletes policies" ON public.policies FOR DELETE TO authenticated
  USING (public.is_senate_president(auth.uid()));

CREATE POLICY "senate reads collaborators" ON public.policy_collaborators FOR SELECT TO authenticated
  USING (public.is_senate(auth.uid()));
CREATE POLICY "senate president manages collaborators" ON public.policy_collaborators FOR ALL TO authenticated
  USING (public.is_senate_president(auth.uid())) WITH CHECK (public.is_senate_president(auth.uid()));

CREATE POLICY "read posts" ON public.posts FOR SELECT TO authenticated USING (
  public.is_senate(auth.uid())
  OR unit_id IS NULL
  OR EXISTS (SELECT 1 FROM public.unit_descendants(posts.unit_id) d WHERE d.id = public.user_member_unit(auth.uid()))
  OR EXISTS (
    SELECT 1 FROM public.unit_ancestors(posts.unit_id) a
    JOIN public.admin_assignments aa ON aa.unit_id = a.id AND aa.user_id = auth.uid()
  )
);
CREATE POLICY "write posts" ON public.posts FOR INSERT TO authenticated WITH CHECK (
  author_id = auth.uid() AND (
    public.is_senate_president(auth.uid())
    OR (unit_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.user_admin_units(auth.uid()) u WHERE u.id = posts.unit_id))
  )
);
CREATE POLICY "update own posts" ON public.posts FOR UPDATE TO authenticated
  USING (author_id = auth.uid() OR public.is_senate_president(auth.uid()))
  WITH CHECK (author_id = auth.uid() OR public.is_senate_president(auth.uid()));
CREATE POLICY "delete own posts" ON public.posts FOR DELETE TO authenticated
  USING (author_id = auth.uid() OR public.is_senate_president(auth.uid()));

-- Bootstrap
CREATE OR REPLACE FUNCTION public.claim_senate_president()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF EXISTS (SELECT 1 FROM public.admin_assignments WHERE role = 'senate_president') THEN
    RAISE EXCEPTION 'Senate President already exists';
  END IF;
  INSERT INTO public.admin_assignments(user_id, role, unit_id) VALUES (auth.uid(), 'senate_president', NULL);
END; $$;

REVOKE ALL ON FUNCTION public.claim_senate_president() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_senate_president() TO authenticated;

-- Seed a starter tree
DO $$
DECLARE c_id uuid; co_id uuid; z_id uuid; s_id uuid; d_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.geographic_units) THEN
    INSERT INTO public.geographic_units(level, name, slug) VALUES ('continent','Asia','asia') RETURNING id INTO c_id;
    INSERT INTO public.geographic_units(level, name, slug, parent_id) VALUES ('country','India','india', c_id) RETURNING id INTO co_id;
    INSERT INTO public.geographic_units(level, name, slug, parent_id) VALUES ('zone','South Zone','south-zone', co_id) RETURNING id INTO z_id;
    INSERT INTO public.geographic_units(level, name, slug, parent_id) VALUES ('state','Tamil Nadu','tamil-nadu', z_id) RETURNING id INTO s_id;
    INSERT INTO public.geographic_units(level, name, slug, parent_id) VALUES ('district','Chennai','chennai', s_id) RETURNING id INTO d_id;
    INSERT INTO public.geographic_units(level, name, slug, parent_id) VALUES ('branch','Chennai Central','chennai-central', d_id);
  END IF;
END $$;

DROP TRIGGER IF EXISTS set_updated_at ON public.geographic_units;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.geographic_units FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
DROP TRIGGER IF EXISTS set_updated_at ON public.policies;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.policies FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
DROP TRIGGER IF EXISTS set_updated_at ON public.posts;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
