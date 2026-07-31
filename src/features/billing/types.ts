/** Mirrors backend/internal/delivery/http/v1/dto.go's PlanResponse /
 * SubscriptionResponse exactly. */
export interface Plan {
  code: string;
  name: string;
  price_monthly_cents: number;
  price_yearly_cents: number;
  message_limit?: number;
  seat_limit?: number;
  features: Record<string, unknown>;
  /** false for a plan with no Stripe-sold price on either cadence (e.g.
   * 'enterprise', custom pricing) — show "Contact sales" instead of an
   * "Upgrade" button. */
  self_serve: boolean;
}

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "paused";

export interface Subscription {
  status: SubscriptionStatus;
  plan_code: string;
  plan_name: string;
  current_period_end?: string;
  cancel_at_period_end: boolean;
}
