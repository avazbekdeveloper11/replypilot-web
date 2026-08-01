"use server";

import { cookies } from "next/headers";

import { LOCALE_COOKIE, type Locale } from "./config";

/**
 * Called from language-switcher.tsx. A Server Action (not a Route Handler)
 * because it only ever needs to run one line of server code triggered from
 * a client component — no separate BFF route is worth the ceremony for
 * that. src/i18n/request.ts reads this same cookie on the next render.
 */
export async function setLocale(locale: Locale) {
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE, locale, {
    path: "/",
    // A year — this is a durable preference, not a session-scoped value.
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
