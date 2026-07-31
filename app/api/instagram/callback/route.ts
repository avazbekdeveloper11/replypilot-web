import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import type { InstagramAccount } from "@/features/instagram/types";

/**
 * Forwards to the Go API's PUBLIC GET /v1/instagram/callback (see
 * router.go's doc comment on why that route has no auth requirement —
 * it resolves the organization from the CSRF `state`, not from a
 * bearer token). No accessToken is attached here on purpose: this call
 * doesn't need one, and requiring the browser to still have a valid
 * session at this point would be a needless extra failure mode for a
 * flow that already round-tripped through Instagram's own site.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.code || !body?.state) {
    return NextResponse.json(
      { error: { code: "INVALID_INPUT", message: "code and state are required" } },
      { status: 400 },
    );
  }

  const query = new URLSearchParams({ code: body.code, state: body.state }).toString();

  try {
    const account = await goApiFetch<InstagramAccount>(`/v1/instagram/callback?${query}`);
    return NextResponse.json({ data: account });
  } catch (err) {
    return errorResponse(err);
  }
}
