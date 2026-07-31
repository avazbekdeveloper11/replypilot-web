import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { setAuthCookies } from "@/lib/auth/cookies";
import { errorResponse } from "@/lib/api/route-handler";
import type { AuthResult, Session } from "@/features/auth/types";

/**
 * POST /v1/auth/login → httpOnly cookies. This is the one Route Handler
 * that ever sees a raw access/refresh token — it reads them off the Go
 * API's response and immediately writes them to httpOnly cookies via
 * `setAuthCookies`, then returns only `{user, organization}` to the
 * browser. The tokens themselves never appear in this response body.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.email || !body?.password || !body?.organization_id) {
    return NextResponse.json(
      { error: { code: "INVALID_INPUT", message: "email, password, and organization_id are required" } },
      { status: 400 },
    );
  }

  try {
    const result = await goApiFetch<AuthResult>("/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: body.email,
        password: body.password,
        organization_id: body.organization_id,
      }),
    });

    await setAuthCookies({
      accessToken: result.access_token,
      accessTokenExpiresAt: result.expires_at,
      refreshToken: result.refresh_token,
    });

    const session: Session = { user: result.user, organization: result.organization };
    return NextResponse.json({ data: session });
  } catch (err) {
    return errorResponse(err);
  }
}
