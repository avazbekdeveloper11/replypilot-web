/**
 * The full IANA timezone database as the runtime already knows it —
 * `Intl.supportedValuesOf("timeZone")` (Node 18+ / all evergreen
 * browsers), not a hand-maintained subset that inevitably drifts out of
 * date or omits someone's region.
 */
export function listTimezones(): string[] {
  if (typeof Intl.supportedValuesOf === "function") {
    return Intl.supportedValuesOf("timeZone");
  }
  // Extremely old runtime fallback — UTC always works as a Select option.
  return ["UTC"];
}
