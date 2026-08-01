/** Translator shape both functions below need — pass `useTranslations("time")`
 * from the calling component. Plain utility functions can't call the hook
 * themselves (no guarantee they're called during render), so the caller's
 * translator is threaded through instead — same pattern as the zod schema
 * factories in features/auth/schemas. */
type Translator = (key: string, values?: Record<string, string | number>) => string;

/** "3m 42s" / "1h 05m" — never a bare number of seconds, which isn't
 * legible for a response-time stat at typical magnitudes. */
export function formatDuration(totalSeconds: number, t: Translator): string {
  const seconds = Math.max(0, Math.round(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0)
    return t("durationHoursMinutes", { hours, minutes: String(minutes).padStart(2, "0") });
  if (minutes > 0)
    return t("durationMinutesSeconds", { minutes, seconds: String(secs).padStart(2, "0") });
  return t("durationSeconds", { seconds: secs });
}

export function formatPercent(fraction: number): string {
  return `${Math.round(fraction * 100)}%`;
}

/** "3m ago" / "2h ago" / "5d ago" — coarse on purpose, this is a list of
 * recent items, not a precision timestamp. */
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
