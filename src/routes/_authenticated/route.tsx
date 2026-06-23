import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/login" });

    const mustChange = (data.user.user_metadata as { must_change_password?: boolean } | null)
      ?.must_change_password;
    if (mustChange) throw redirect({ to: "/set-password" });

    return { user: data.user };
  },
  component: () => <Outlet />,
});
