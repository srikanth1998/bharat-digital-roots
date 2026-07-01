import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type MemberRow = {
  id: string;
  user_id: string;
  member_code: string;
  full_name: string;
  parent_name: string | null;
  email: string;
  alt_email: string | null;
  mobile: string;
  alt_mobile: string | null;
  plan_id: "active_1year" | "active_lifetime" | "passive_1year" | "passive_lifetime";
  amount_inr: number;
  address: string;
  town: string;
  district: string;
  state: string;
  country: string;
  joined_at: string;
  expires_at: string | null;
};


export const getMyMember = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("members")
      .select("*")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

export const getAllMembers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    // Verify admin role server-side; RLS also enforces, but fail clearly.
    const { data: isAdmin, error: rerr } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (rerr) throw new Error(rerr.message);
    if (!isAdmin) throw new Error("Forbidden");

    const { data, error } = await context.supabase
      .from("members")
      .select(
        "id, user_id, member_code, full_name, parent_name, email, alt_email, mobile, alt_mobile, plan_id, amount_inr, address, town, district, state, country, joined_at, expires_at",
      )
      .order("joined_at", { ascending: false })
      .limit(1000);
    if (error) throw new Error(error.message);
    return (data ?? []) as MemberRow[];
  });

export const getMyRole = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    const roles = (data ?? []).map((r) => r.role);
    return { isAdmin: roles.includes("admin"), roles };
  });
