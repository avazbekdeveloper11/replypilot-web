/** Translator shape — pass `useTranslations("time")` from the caller (see
 * features/conversations/lib/format.ts's identical helper). */
type Translator = (key: string, values?: Record<string, string | number>) => string;

/** "3m ago" / "2h ago" / "5d ago" — same coarse convention duplicated
 * across every feature folder that needs it (see
 * features/campaigns/lib/format.ts's identical copy) — each feature
 * folder owns its own small utilities per this project's convention. */
export function formatRelativeTime(iso: string, t: Translator): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";

  const diffSeconds = Math.max(0, Math.round((Date.now() - then) / 1000));
  if (diffSeconds < 60) return t("justNow");

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return t("minutesAgo", { count: diffMinutes });

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return t("hoursAgo", { count: diffHours });

  const diffDays = Math.floor(diffHours / 24);
  return t("daysAgo", { count: diffDays });
}

/** "Jul 31, 2026" for an order's date in the drill-down panel — an
 * absolute date makes more sense than relative time once you're looking
 * at a list of several orders spread across months. */
export function formatOrderDate(iso: string, locale: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" });
}
