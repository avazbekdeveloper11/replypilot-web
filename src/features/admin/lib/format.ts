/** Cents -> "$12.34" — same convention as features/billing's formatter.
 * Takes the app's selected locale rather than `undefined` — see
 * src/i18n/config.ts's intlLocale doc comment. */
export function formatCents(cents: number, locale: string): string {
  return (cents / 100).toLocaleString(locale, {
    style: "currency",
    currency: "USD",
  });
}
