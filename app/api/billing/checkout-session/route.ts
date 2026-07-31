import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";

export async function POST(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "not signed in" } },
      { status: 401 },
    );
  }

  const body = await request.json().catch(() => null);
  if (!body?.plan_code) {
    return NextResponse.json(
      { error: { code: "INVALID_INPUT", message: "plan_code is required" } },
      { status: 400 },
    );
  }

  try {
    const session = await goApiFetch<{ url: string }>("/v1/billing/checkout-session", {
      method: "POST",
      accessToken,
      body: JSON.stringify({ plan_code: body.plan_code, period: body.period }),
    });
    return NextResponse.json({ data: session });
  } catch (err) {
    return errorResponse(err);
  }
}
