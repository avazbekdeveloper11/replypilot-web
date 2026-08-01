/** "$49" (no cents shown for a whole-dollar price, which every seeded plan
 * is — see backend migrations/000002's seed data) — 0 renders as the
 * caller's "Custom" translation since the 'enterprise' plan is seeded at
 * 0/0 to mean custom pricing, not literally free. `locale` (see
 * src/i18n/config.ts's intlLocale) only changes digit grouping/currency
 * symbol placement here — the plan is still billed in USD regardless of
 * UI language, so `currency` itself stays fixed. */
export function formatPriceCents(cents: number, locale: string, customLabel: string): string {
  if (cents === 0) return customLabel;
  const dollars = cents / 100;
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: dollars % 1 === 0 ? 0 : 2,
  }).format(dollars);
  return formatted;
}

/** "Jul 31, 2026" for a subscription's current_period_end. Takes the
 * app's selected locale rather than `undefined` — see
 * src/i18n/config.ts's intlLocale doc comment. */
export function formatPeriodEnd(iso: string, locale: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" });
}
