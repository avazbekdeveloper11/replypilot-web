import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import type { AmoCRMIntegration } from "@/features/amocrm/types";

/**
 * Forwards to the Go API's PUBLIC GET /v1/amocrm/callback — same "no
 * accessToken attached, org resolved from the CSRF state server-side"
 * reasoning as app/api/instagram/callback/route.ts.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.code || !body?.state || !body?.referer) {
    return NextResponse.json(
      { error: { code: "INVALID_INPUT", message: "code, state, and referer are required" } },
      { status: 400 },
    );
  }

  const query = new URLSearchParams({
    code: body.code,
    state: body.state,
    referer: body.referer,
  }).toString();

  try {
    const integration = await goApiFetch<AmoCRMIntegration>(`/v1/amocrm/callback?${query}`);
    return NextResponse.json({ data: integration });
  } catch (err) {
    return errorResponse(err);
  }
}
