import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// SEC-01: Prices are authoritative on the server. The client never supplies an
// amount — it only chooses a plan — so it cannot pay ₹1 for a ₹100/₹500 plan.
const PLAN_PRICES_INR: Record<"active" | "passive", number> = {
  active: 100,
  passive: 500,
};

const createOrderInput = z.object({
  planId: z.enum(["active", "passive"]),
});

export const checkEmailAvailable = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ email: z.string().trim().email().max(160) }).parse(data))
  .handler(async ({ data }) => {
    const email = data.email.toLowerCase();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Check the members table first (case-insensitive)
    const { data: existingMember, error: memErr } = await supabaseAdmin
      .from("members")
      .select("id")
      .ilike("email", email)
      .maybeSingle();
    if (memErr) throw new Error(`Could not check email: ${memErr.message}`);
    if (existingMember) return { available: false as const };

    // Check auth users as well, so a registered (but not-yet-paid) account is also blocked
    const { data: list, error: listErr } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    if (listErr) throw new Error(`Could not check email: ${listErr.message}`);
    const taken = list.users.some((u) => (u.email ?? "").toLowerCase() === email);
    return { available: !taken };
  });

export const createRazorpayOrder = createServerFn({ method: "POST" })
  .inputValidator((data) => createOrderInput.parse(data))
  .handler(async ({ data }) => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      throw new Error("Razorpay keys are not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
    }

    const amountInr = PLAN_PRICES_INR[data.planId];

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amountInr * 100, // paise
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
  profile: z.object({
    fullName: z.string().trim().min(1).max(120),
    parentName: z.string().trim().max(120).optional().default(""),
    mobile: z.string().trim().min(5).max(20),
    altMobile: z.string().trim().max(20).optional().default(""),
    email: z.string().trim().email().max(160),
    altEmail: z.string().trim().email().max(160).optional().or(z.literal("")).default(""),
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
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) throw new Error("Razorpay keys not configured");

    const { createHmac, timingSafeEqual } = await import("crypto");
    const expected = createHmac("sha256", keySecret)
      .update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`)
      .digest("hex");

    const a = Buffer.from(expected);
    const b = Buffer.from(data.razorpay_signature);
    const valid = a.length === b.length && timingSafeEqual(a, b);
    if (!valid) throw new Error("Invalid payment signature");

    // SEC-01: the amount is the server-side canonical price, never a client value.
    const amountInr = PLAN_PRICES_INR[data.planId];

    // SEC-01 (defense in depth): confirm the order really exists, is paid, and was
    // created for the canonical amount/plan — so a tampered or replayed order is rejected.
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const orderRes = await fetch(`https://api.razorpay.com/v1/orders/${data.razorpay_order_id}`, {
      headers: { Authorization: `Basic ${auth}` },
    });
    if (!orderRes.ok) throw new Error("Could not verify payment order with Razorpay");
    const order = (await orderRes.json()) as {
      amount: number;
      amount_paid: number;
      status: string;
      notes?: { planId?: string };
    };
    if (order.amount !== amountInr * 100 || order.amount_paid < amountInr * 100) {
      throw new Error("Payment amount does not match the selected plan");
    }
    if (order.notes?.planId && order.notes.planId !== data.planId) {
      throw new Error("Payment plan mismatch");
    }

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
      amount_inr: amountInr,
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

    // Read the member's expires_at to put on the ID card in the email
    const { data: memberRow } = await supabaseAdmin
      .from("members")
      .select("expires_at")
      .eq("user_id", userId)
      .maybeSingle();

    // Enqueue welcome email — render the React Email template and push it onto
    // the transactional_emails queue. The Lovable email cron picks it up.
    try {
      const [{ render }, React, { template: welcomeTpl }] = await Promise.all([
        import("@react-email/components"),
        import("react"),
        import("@/lib/email-templates/membership-welcome"),
      ]);

      const origin = "https://bharat-digital-roots.lovable.app";

      const templateData = {
        fullName: data.profile.fullName,
        memberCode,
        email: data.profile.email,
        tempPassword,
        planName: data.planId === "active" ? "Active Membership" : "Passive Membership",
        amountInr,
        razorpayPaymentId: data.razorpay_payment_id,
        razorpayOrderId: data.razorpay_order_id,
        expiresAt: memberRow?.expires_at ?? "",
        loginUrl: `${origin}/login`,
      };

      const element = React.createElement(welcomeTpl.component, templateData);
      const html = await render(element);
      const plainText = await render(element, { plainText: true });
      const subject =
        typeof welcomeTpl.subject === "function"
          ? welcomeTpl.subject(templateData)
          : welcomeTpl.subject;

      // Ensure an unsubscribe token exists for this recipient
      const normalizedEmail = data.profile.email.toLowerCase();
      const unsubscribeToken = Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      await supabaseAdmin
        .from("email_unsubscribe_tokens")
        .upsert(
          { token: unsubscribeToken, email: normalizedEmail },
          { onConflict: "email", ignoreDuplicates: true },
        );
      const { data: tokRow } = await supabaseAdmin
        .from("email_unsubscribe_tokens")
        .select("token")
        .eq("email", normalizedEmail)
        .maybeSingle();
      const finalUnsubToken = tokRow?.token ?? unsubscribeToken;

      const messageId = `welcome-${userId}-${Date.now()}`;
      await supabaseAdmin.from("email_send_log").insert({
        message_id: messageId,
        template_name: "membership-welcome",
        recipient_email: data.profile.email,
        status: "pending",
      });

      await (supabaseAdmin.rpc as any)("enqueue_email", {
        queue_name: "transactional_emails",
        payload: {
          message_id: messageId,
          to: data.profile.email,
          from: `Vanya · Feathers Forum <noreply@notify.oniondistribution.com>`,
          sender_domain: "notify.oniondistribution.com",
          subject,
          html,
          text: plainText,
          purpose: "transactional",
          label: "membership-welcome",
          idempotency_key: `welcome-${userId}`,
          unsubscribe_token: finalUnsubToken,
          queued_at: new Date().toISOString(),
        },
      });
    } catch (mailErr) {
      // Email failure must NOT roll back the paid membership — log and continue.
      console.error("Failed to enqueue welcome email:", mailErr);
    }


    return {
      verified: true,
      memberCode,
      tempPassword,
      email: data.profile.email,
    };
  });
