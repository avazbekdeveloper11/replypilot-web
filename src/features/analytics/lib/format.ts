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
