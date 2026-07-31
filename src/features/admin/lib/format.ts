/** Cents -> "$12.34" — same convention as features/billing's formatter. */
export function formatCents(cents: number): string {
  return (cents / 100).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
  });
}
