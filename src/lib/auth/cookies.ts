import { cookies } from "next/headers";

/**
 * httpOnly cookie names + set/clear helpers for the session, used only
 * from Route Handlers (`app/api/auth/*`). Per FRONTEND_ARCHITECTURE.md
 * §3: the access + refresh tokens the Go API issues never reach client
 * JS — they're set here as httpOnly cookies, and every other layer
 * (Server Components, middleware, other Route Handlers) reads them via
 * `next/headers` `cookies()`, never `localStorage`.
 */
export const ACCESS_TOKEN_COOKIE = "rp_access_token";
export const REFRESH_TOKEN_COOKIE = "rp_refresh_token";

// The Go API's AuthResponse includes `expires_at` for the access token,
// but the access-token COOKIE deliberately does NOT expire at that exact
// moment — see the bug this fixed: middleware.ts's auth gate only checks
// cookie *presence*, not the token's actual validity, on the theory that
// a present-but-expired token would still reach a Route Handler and get a
// real 401 from the Go API, which `lib/api/client.ts`'s `apiFetch` then
// silently recovers from via POST /api/auth/refresh. That recovery path
// only gets a chance to run if the cookie is still THERE when the expired
// token is used — with maxAge pinned to the JWT's own short TTL
// (JWT_ACCESS_TTL, 15m by default), the cookie vanished from the browser
// at exactly that mark, so middleware saw "no cookie" on the very next
// navigation and hard-redirected to /login before any fetch/refresh logic
// ever ran. Users saw this as "I get logged out constantly, and logging
// back in immediately works" — logging back in worked because the
// refresh token (7-day cookie) was still valid the whole time; nothing
// was actually wrong with the session, the access-token cookie's own
// lifetime was just shorter than the thing it gates.
//
// Both cookies now live for the refresh token's lifetime. The access
// token's real, short TTL is still enforced — by the Go API rejecting it
// with 401 once expired — not by the browser deleting the cookie early.
const REFRESH_TOKEN_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

interface SetAuthCookiesInput {
  accessToken: string;
  accessTokenExpiresAt: string; // ISO8601, from AuthResponse.expires_at — no longer used for the cookie's own maxAge (see doc comment above), kept in the input shape in case a caller wants it later.
  refreshToken: string;
}

export async function setAuthCookies(input: SetAuthCookiesInput) {
  const store = await cookies();
  const isProd = process.env.NODE_ENV === "production";

  store.set(ACCESS_TOKEN_COOKIE, input.accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
  });

  store.set(REFRESH_TOKEN_COOKIE, input.refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
  });
}

export async function clearAuthCookies() {
  const store = await cookies();
  store.delete(ACCESS_TOKEN_COOKIE);
  store.delete(REFRESH_TOKEN_COOKIE);
}

/**
 * Reads the access token cookie for use inside a protected Route Handler
 * (`app/api/dashboard/*`, `app/api/conversations/*`, ...) — pass the
 * result as `goApiFetch`'s `accessToken` option. Returns undefined rather
 * than throwing when there's no session; callers decide how to respond
 * (normally a 401 via the same envelope shape as every other error).
 */
export async function getAccessToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(ACCESS_TOKEN_COOKIE)?.value;
}
