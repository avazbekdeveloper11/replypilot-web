import { apiFetch } from "@/lib/api/client";
import type { Plan, Subscription } from "../types";

export function listPlans() {
  return apiFetch<Plan[]>("/api/billing/plans");
}

/** null (not thrown) when the org has never completed Checkout — see the
 * route handler's doc comment. Distinguishing "no subscription yet" from
 * "request failed" matters here: the Billing page shows an upgrade prompt
 * for the former, an error state for the latter. */
export function getSubscription() {
  return apiFetch<Subscription | null>("/api/billing/subscription");
}

export function createCheckoutSession(input: { planCode: string; period: "monthly" | "yearly" }) {
  return apiFetch<{ url: string }>("/api/billing/checkout-session", {
    method: "POST",
    body: JSON.stringify({ plan_code: input.planCode, period: input.period }),
  });
}

export function createPortalSession() {
  return apiFetch<{ url: string }>("/api/billing/portal-session", { method: "POST" });
}
