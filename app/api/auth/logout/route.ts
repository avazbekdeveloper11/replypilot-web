import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { REFRESH_TOKEN_COOKIE, clearAuthCookies } from "@/lib/auth/cookies";
import { errorResponse } from "@/lib/api/route-handler";

/**
 * POST /v1/auth/logout revokes the refresh token server-side (see
 * AuthHandler.Logout); this route reads it off the httpOnly cookie —
 * never from the request body, the browser never has it — then clears
 * both cookies regardless of whether the Go API call succeeds, since a
 * client-side "log out" always has to end the local session even if the
 * revoke call fails (e.g. token already expired).
 */
export async function POST() {
  const store = await cookies();
  const refreshToken = store.get(REFRESH_TOKEN_COOKIE)?.value;

  try {
    if (refreshToken) {
      await goApiFetch("/v1/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    }
  } catch (err) {
    await clearAuthCookies();
    return errorResponse(err);
  }

  await clearAuthCookies();
  return NextResponse.json({ data: { logged_out: true } });
}
