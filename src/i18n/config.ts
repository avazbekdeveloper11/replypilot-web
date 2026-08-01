/**
 * Supported locales for the whole app. Cookie-based (no /[locale]/ URL
 * segment, no next-intl middleware/routing) — chosen deliberately because
 * this is an authenticated SaaS dashboard, not a public marketing site, so
 * there's no SEO upside to a locale-prefixed URL, and it means this layer
 * never has to interact with middleware.ts's existing auth-gate logic.
 *
 * "uz-Cyrl" (not "uz-CY" or similar) follows the BCP-47 convention for
 * script subtags — Uzbek written in Cyrillic script, as distinct from the
 * default "uz" which is Latin script (the standard script for Uzbek since
 * the 1990s script reform, and what every other UZ string in this codebase
 * is already written in).
 */
export const locales = ["uz", "uz-Cyrl", "ru", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "uz";

/** Each locale's own name, in its own script — used by the language switcher. */
export const localeNames: Record<Locale, string> = {
  uz: "O'zbekcha",
  "uz-Cyrl": "Ўзбекча",
  ru: "Русский",
  en: "English",
};

/** Cookie next-intl's i18n/request.ts reads to resolve the active locale. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/**
 * Maps our app locale to the BCP-47 tag passed to native Intl APIs
 * (toLocaleDateString, Intl.NumberFormat, ...) for chart axis labels,
 * currency, and date formatting — every browser/Node's ICU data
 * recognizes these tags directly, no extra polyfill needed. Kept as its
 * own mapping (not just `locale` itself) in case a locale here ever needs
 * a more specific region subtag than Intl needs for message lookup.
 */
export function intlLocale(locale: Locale): string {
  return locale;
}
