/** "Jul 31, 2026" for a document's created_at — this list isn't dense
 * enough to need relative time (features/conversations/lib/format.ts's
 * "3m ago" convention), an absolute date reads better for a document
 * library. Kept as its own copy per this project's per-feature-utility
 * convention. */
export function formatDocumentDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}
