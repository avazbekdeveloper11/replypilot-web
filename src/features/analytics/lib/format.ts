/** "Jul 31" for a chart's x-axis tick — short on purpose, these charts are
 * dense (14+ points). Takes the app's selected locale rather than
 * `undefined` — see src/i18n/config.ts's intlLocale doc comment. */
export function formatChartDate(dateStr: string, locale: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString(locale, { month: "short", day: "numeric" });
}

/** Translator shape — pass `useTranslations("time")` from the caller (see
 * features/dashboard/lib/format.ts's identical helper). */
type Translator = (key: string, values?: Record<string, string | number>) => string;

/** "3m ago" / "2h ago" / "5d ago" — same coarse convention as
 * features/conversations/lib/format.ts's identical helper (kept as a
 * separate copy rather than a shared import — each feature folder owns its
 * own small utilities per this project's convention). Used by
 * ai-insights-panel.tsx for AIInsights.generated_at. */
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

/** "1m 42s" / "38s" — avg_seconds is a raw float from a Postgres AVG(), so
 * this also rounds it to whole seconds. Reuses the same "time" message
 * namespace as formatDuration in features/dashboard/lib/format.ts. */
export function formatSeconds(seconds: number, t: Translator): string {
  const total = Math.round(seconds);
  const minutes = Math.floor(total / 60);
  const secs = total % 60;
  if (minutes === 0) return t("durationSeconds", { seconds: secs });
  return t("durationMinutesSeconds", { minutes, seconds: secs });
}
