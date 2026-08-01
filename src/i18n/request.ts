import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import { defaultLocale, isLocale, LOCALE_COOKIE } from "./config";

/**
 * Runs once per request (RSC render). There is no [locale] URL segment
 * (see src/i18n/config.ts's doc comment), so `requestLocale` from
 * next-intl's own routing is never populated here — the active locale
 * comes entirely from the NEXT_LOCALE cookie, written by
 * src/components/layout/language-switcher.tsx's server action.
 */
export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
