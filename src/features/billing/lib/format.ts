/** "$49" (no cents shown for a whole-dollar price, which every seeded plan
 * is — see backend migrations/000002's seed data) — 0 renders as "Custom"
 * since the 'enterprise' plan is seeded at 0/0 to mean custom pricing, not
 * literally free. */
export function formatPriceCents(cents: number): string {
  if (cents === 0) return "Custom";
  const dollars = cents / 100;
  const formatted = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: dollars % 1 === 0 ? 0 : 2,
  }).format(dollars);
  return formatted;
}

/** "Jul 31, 2026" for a subscription's current_period_end. */
export function formatPeriodEnd(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}
