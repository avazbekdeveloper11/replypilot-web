import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";

/**
 * POST /v1/auth/register/code — step 1 of registration. Sends a 6-digit
 * OTP (via Resend) to the given email; the code must then be passed back
 * as `code` on POST /api/auth/register. Same anti-enumeration shape as
 * forgot-password: no tokens involved, nothing to set as a cookie here.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.email) {
    return NextResponse.json(
      { error: { code: "INVALID_INPUT", message: "email is required" } },
      { status: 400 },
    );
  }

  try {
    const result = await goApiFetch<{ message: string }>("/v1/auth/register/code", {
      method: "POST",
      body: JSON.stringify({ email: body.email }),
    });
    return NextResponse.json({ data: result });
  } catch (err) {
    return errorResponse(err);
  }
}
