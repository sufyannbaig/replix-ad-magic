import { createServerFn } from "@tanstack/react-start";
import { findPaidPlan, type PlanId } from "@/data/studio";

const STRIPE_API = "https://api.stripe.com/v1";

/** Reads the Stripe test secret key. Returns null while the key is not saved yet. */
function readKey(): string | null {
  const key = process.env["STRIPE_SECRET_KEY"];
  if (!key || key.startsWith("PLACEHOLDER")) return null;
  return key;
}

async function stripePost(key: string, path: string, form: Record<string, string>) {
  const res = await fetch(`${STRIPE_API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(form).toString(),
  });
  const json = (await res.json()) as Record<string, unknown>;
  if (!res.ok) {
    const message =
      (json["error"] as { message?: string } | undefined)?.message ?? "Stripe request failed.";
    throw new Error(message);
  }
  return json;
}

async function stripeGet(key: string, path: string) {
  const res = await fetch(`${STRIPE_API}${path}`, {
    headers: { Authorization: `Bearer ${key}` },
  });
  const json = (await res.json()) as Record<string, unknown>;
  if (!res.ok) {
    const message =
      (json["error"] as { message?: string } | undefined)?.message ?? "Stripe request failed.";
    throw new Error(message);
  }
  return json;
}

/** True once a Stripe test key is saved, so the UI can explain itself instead of failing. */
export const stripeStatus = createServerFn({ method: "GET" }).handler(async () => {
  const key = readKey();
  return { configured: Boolean(key), testMode: key ? key.startsWith("sk_test_") : true };
});

/**
 * Creates a Stripe Checkout session for one of the paid plans.
 * The amount always comes from the shared plan definition, never a literal here.
 */
export const createCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator((input: { planId: PlanId; origin: string }) => {
    const plan = findPaidPlan(input.planId);
    if (!plan) throw new Error("Unknown plan.");
    if (!/^https?:\/\//.test(input.origin)) throw new Error("Invalid origin.");
    return input;
  })
  .handler(async ({ data }) => {
    const key = readKey();
    if (!key) {
      return {
        ok: false as const,
        reason: "missing_key" as const,
        url: null,
      };
    }
    const plan = findPaidPlan(data.planId)!;
    const origin = data.origin.replace(/\/$/, "");

    const session = await stripePost(key, "/checkout/sessions", {
      mode: "subscription",
      "line_items[0][quantity]": "1",
      "line_items[0][price_data][currency]": plan.currency,
      "line_items[0][price_data][unit_amount]": String(plan.priceCents),
      "line_items[0][price_data][recurring][interval]": "month",
      "line_items[0][price_data][product_data][name]": `Replix AI — ${plan.name}`,
      "line_items[0][price_data][product_data][description]": `${plan.credits} AI generations per month`,
      "metadata[plan_id]": plan.id,
      "metadata[plan_name]": plan.name,
      "subscription_data[metadata][plan_id]": plan.id,
      success_url: `${origin}/pricing?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?checkout=cancelled`,
      allow_promotion_codes: "true",
    });

    return {
      ok: true as const,
      reason: null,
      url: (session["url"] as string | null) ?? null,
    };
  });

/** Confirms a completed Checkout session and reports which plan was purchased. */
export const confirmCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator((input: { sessionId: string }) => {
    if (!input.sessionId || input.sessionId.length > 200) throw new Error("Invalid session id.");
    return input;
  })
  .handler(async ({ data }) => {
    const key = readKey();
    if (!key) return { paid: false as const, planId: null, planName: null };

    const session = await stripeGet(key, `/checkout/sessions/${encodeURIComponent(data.sessionId)}`);
    const paymentStatus = session["payment_status"] as string | undefined;
    const status = session["status"] as string | undefined;
    const metadata = (session["metadata"] as Record<string, string> | null) ?? {};
    const plan = findPaidPlan(metadata["plan_id"] ?? "");
    const paid = status === "complete" && (paymentStatus === "paid" || paymentStatus === "no_payment_required");

    return {
      paid: Boolean(paid && plan),
      planId: plan?.id ?? null,
      planName: plan?.name ?? null,
    };
  });
