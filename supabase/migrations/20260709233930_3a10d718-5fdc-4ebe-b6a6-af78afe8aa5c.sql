
REVOKE ALL ON FUNCTION public.is_senate(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_senate_president(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.unit_ancestors(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.unit_descendants(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.user_admin_units(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.user_member_unit(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_senate(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_senate_president(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.unit_ancestors(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.unit_descendants(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_admin_units(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_member_unit(uuid) TO authenticated;
