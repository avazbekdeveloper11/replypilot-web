/** "Jul 31" for a chart's x-axis tick — short on purpose, these charts are
 * dense (14+ points). */
export function formatChartDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/** "1m 42s" / "38s" — avg_seconds is a raw float from a Postgres AVG(), so
 * this also rounds it to whole seconds. */
export function formatSeconds(seconds: number): string {
  const total = Math.round(seconds);
  const minutes = Math.floor(total / 60);
  const secs = total % 60;
  if (minutes === 0) return `${secs}s`;
  return `${minutes}m ${secs}s`;
}
