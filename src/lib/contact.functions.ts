import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createClient } from "@supabase/supabase-js";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  address: string | null;
  country: string | null;
  state: string | null;
  district: string | null;
  town: string | null;
  message: string;
  created_at: string;
};

export type ContactInput = {
  name: string;
  email: string;
  address?: string;
  country?: string;
  state?: string;
  district?: string;
  town?: string;
  message: string;
};

export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator((input: ContactInput) => {
    if (!input?.name?.trim() || !input?.email?.trim() || !input?.message?.trim()) {
      throw new Error("Name, email, and message are required.");
    }
    return input;
  })
  .handler(async ({ data }) => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
    );
    const { error } = await supabase.from("contact_messages").insert({
      name: data.name.trim(),
      email: data.email.trim(),
      address: data.address?.trim() || null,
      country: data.country?.trim() || null,
      state: data.state?.trim() || null,
      district: data.district?.trim() || null,
      town: data.town?.trim() || null,
      message: data.message.trim(),
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getAllContactMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin, error: rerr } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (rerr) throw new Error(rerr.message);
    if (!isAdmin) throw new Error("Forbidden");

    const { data, error } = await context.supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as ContactMessage[];
  });
