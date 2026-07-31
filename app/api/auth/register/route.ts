import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { setAuthCookies } from "@/lib/auth/cookies";
import { errorResponse } from "@/lib/api/route-handler";
import type { AuthResult, Session } from "@/features/auth/types";

/**
 * POST /v1/auth/register → same shape as login/route.ts: the Go API's
 * AuthResponse includes tokens (creating an org logs the new Owner user
 * in immediately, same as any registration flow), so this is the second
 * (and only other) Route Handler that ever sees a raw token — reads it,
 * writes httpOnly cookies, returns only {user, organization}.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (
    !body?.organization_name ||
    !body?.organization_slug ||
    !body?.full_name ||
    !body?.email ||
    !body?.password
  ) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_INPUT",
          message: "organization_name, organization_slug, full_name, email, and password are required",
        },
      },
      { status: 400 },
    );
  }

  try {
    const result = await goApiFetch<AuthResult>("/v1/auth/register", {
      method: "POST",
      body: JSON.stringify({
        organization_name: body.organization_name,
        organization_slug: body.organization_slug,
        full_name: body.full_name,
        email: body.email,
        password: body.password,
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
