import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";
import type { ClickIntegration } from "@/features/click/types";

function unauthorized() {
  return NextResponse.json(
    { error: { code: "UNAUTHORIZED", message: "not signed in" } },
    { status: 401 },
  );
}

export async function GET() {
  const accessToken = await getAccessToken();
  if (!accessToken) return unauthorized();

  try {
    // The Go API returns 200 with data omitted when not connected (see
    // ClickHandler.Get's doc comment) — that comes through here as
    // `integration === undefined`, forwarded to the browser as-is.
    const integration = await goApiFetch<ClickIntegration | undefined>("/v1/integrations/click", {
      accessToken,
    });
    return NextResponse.json({ data: integration ?? null });
  } catch (err) {
    return errorResponse(err);
  }
}
