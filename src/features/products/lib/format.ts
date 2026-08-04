/** "25 000 so'm" for a product's price_cents — integer so'm, grouped with
 * spaces (the common Uzbek convention), tiyin dropped since Click amounts
 * for this catalog are always whole so'm in practice (see
 * clickapi.FormatAmount on the backend, which still emits "N.NN" for the
 * payment link itself — this is purely display formatting). */
export function formatPriceCents(priceCents: number, currency: string): string {
  const whole = Math.round(priceCents / 100);
  const grouped = whole.toLocaleString("en-US").replace(/,/g, " ");
  return currency === "UZS" ? `${grouped} so'm` : `${grouped} ${currency}`;
}
