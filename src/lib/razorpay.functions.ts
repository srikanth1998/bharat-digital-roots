import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const createOrderInput = z.object({
  amount: z.number().int().positive(), // in INR rupees
  planId: z.enum(["active", "passive"]),
});

export const createRazorpayOrder = createServerFn({ method: "POST" })
  .inputValidator((data) => createOrderInput.parse(data))
  .handler(async ({ data }) => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      throw new Error("Razorpay keys are not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: data.amount * 100, // paise
        currency: "INR",
        receipt: `vanya_${data.planId}_${Date.now()}`,
        notes: { planId: data.planId },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Razorpay order failed: ${res.status} ${text}`);
    }

    const order = (await res.json()) as { id: string; amount: number; currency: string };
    return { orderId: order.id, amount: order.amount, currency: order.currency, keyId };
  });

const verifyInput = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
  planId: z.enum(["active", "passive"]),
  amount: z.number().int().positive(),
  profile: z.object({
    fullName: z.string().trim().min(1).max(120),
    parentName: z.string().trim().max(120).optional().default(""),
    mobile: z.string().trim().min(5).max(20),
    altMobile: z.string().trim().max(20).optional().default(""),
    email: z.string().trim().email().max(160),
    altEmail: z.string().trim().max(160).optional().default(""),
    address: z.string().trim().min(1).max(400),
    country: z.string().trim().min(1).max(80),
    state: z.string().trim().min(1).max(80),
    district: z.string().trim().min(1).max(80),
    town: z.string().trim().min(1).max(80),
  }),
});

function generateTempPassword(): string {
  // 10 char base36, easy to type but unguessable
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(36).padStart(2, "0")).join("").slice(0, 10);
}

export const verifyRazorpayPayment = createServerFn({ method: "POST" })
  .inputValidator((data) => verifyInput.parse(data))
  .handler(async ({ data }) => {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) throw new Error("Razorpay secret not configured");

    const { createHmac, timingSafeEqual } = await import("crypto");
    const expected = createHmac("sha256", keySecret)
      .update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`)
      .digest("hex");

    const a = Buffer.from(expected);
    const b = Buffer.from(data.razorpay_signature);
    const valid = a.length === b.length && timingSafeEqual(a, b);
    if (!valid) throw new Error("Invalid payment signature");

    // ---- Create account + member ----
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const tempPassword = generateTempPassword();

    // Generate member code first (server-only function)
    const { data: codeRow, error: codeErr } = await supabaseAdmin.rpc("generate_member_code", {
      _plan: data.planId,
    });
    if (codeErr || !codeRow) throw new Error(`Failed to generate member code: ${codeErr?.message ?? "unknown"}`);
    const memberCode = codeRow as unknown as string;

    // Create the auth user
    const { data: created, error: userErr } = await supabaseAdmin.auth.admin.createUser({
      email: data.profile.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        full_name: data.profile.fullName,
        member_code: memberCode,
        must_change_password: true,
      },
    });

    if (userErr || !created.user) {
      throw new Error(
        userErr?.message?.includes("already")
          ? "An account with this email already exists. Please log in instead."
          : `Could not create account: ${userErr?.message ?? "unknown error"}`,
      );
    }

    const userId = created.user.id;

    // Insert member row
    const { error: insErr } = await supabaseAdmin.from("members").insert({
      user_id: userId,
      member_code: memberCode,
      full_name: data.profile.fullName,
      parent_name: data.profile.parentName || null,
      mobile: data.profile.mobile,
      alt_mobile: data.profile.altMobile || null,
      email: data.profile.email,
      alt_email: data.profile.altEmail || null,
      address: data.profile.address,
      country: data.profile.country,
      state: data.profile.state,
      district: data.profile.district,
      town: data.profile.town,
      plan_id: data.planId,
      amount_inr: data.amount,
      razorpay_order_id: data.razorpay_order_id,
      razorpay_payment_id: data.razorpay_payment_id,
    });
    if (insErr) {
      // best-effort: rollback the auth user
      await supabaseAdmin.auth.admin.deleteUser(userId).catch(() => {});
      throw new Error(`Could not save member record: ${insErr.message}`);
    }

    // Grant the 'member' role
    await supabaseAdmin.from("user_roles").insert({ user_id: userId, role: "member" });

    // TODO: enqueue welcome email with memberCode + tempPassword once email domain is verified.

    return {
      verified: true,
      memberCode,
      tempPassword,
      email: data.profile.email,
    };
  });
