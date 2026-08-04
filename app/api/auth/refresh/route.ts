import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { REFRESH_TOKEN_COOKIE, setAuthCookies, clearAuthCookies } from "@/lib/auth/cookies";
import { errorResponse } from "@/lib/api/route-handler";
import type { AuthResult } from "@/features/auth/types";

/**
 * POST /v1/auth/refresh, called by `lib/api/client.ts`'s `apiFetch` the
 * moment any Route Handler call comes back 401 — see that file's retry
 * logic for why this exists at all: the access-token cookie is
 * deliberately long-lived now (see cookies.ts), so "the cookie is gone"
 * is no longer what signals expiry; a real 401 from the Go API is. This
 * is the recovery path for that 401: read the refresh token off its
 * httpOnly cookie (never sent from the browser directly — same boundary
 * as logout), exchange it for a new access token, and re-set both
 * cookies. auth.UseCase.Refresh doesn't rotate the refresh token, so the
 * cookie we re-set is usually byte-identical, but writing it back keeps
 * this handler correct if that ever changes.
 *
 * No request body: the refresh token never touches client JS, so there's
 * nothing for the browser to send except the cookie itself.
 */
export async function POST() {
  const store = await cookies();
  const refreshToken = store.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!refreshToken) {
    await clearAuthCookies();
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "no session to refresh" } },
      { status: 401 },
    );
  }

  try {
    const result = await goApiFetch<AuthResult>("/v1/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    await setAuthCookies({
      accessToken: result.access_token,
      accessTokenExpiresAt: result.expires_at,
      refreshToken: result.refresh_token,
    });

    return NextResponse.json({ data: { refreshed: true } });
  } catch (err) {
    // Refresh token itself is invalid/expired/revoked — there is no
    // recovering this session client-side. Clear both cookies so the
    // next navigation's middleware check (and apiFetch's redirect) is
    // consistent with reality, instead of leaving a dead access-token
    // cookie behind that will just 401 again on the next request.
    await clearAuthCookies();
    return errorResponse(err);
  }
}
