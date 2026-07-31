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
// so its cookie maxAge is computed exactly from that. The refresh token
// has no such field in the response — this mirrors the backend's own
// default (JWT_REFRESH_TTL=168h in backend/.env.example). If that default
// changes, update this constant too; there's no way to derive it from the
// login response as-is.
const REFRESH_TOKEN_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

interface SetAuthCookiesInput {
  accessToken: string;
  accessTokenExpiresAt: string; // ISO8601, from AuthResponse.expires_at
  refreshToken: string;
}

export async function setAuthCookies(input: SetAuthCookiesInput) {
  const store = await cookies();
  const isProd = process.env.NODE_ENV === "production";

  const accessMaxAge = Math.max(
    0,
    Math.floor((new Date(input.accessTokenExpiresAt).getTime() - Date.now()) / 1000),
  );

  store.set(ACCESS_TOKEN_COOKIE, input.accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: accessMaxAge,
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
