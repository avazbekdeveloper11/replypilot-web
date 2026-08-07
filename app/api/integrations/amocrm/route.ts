import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";
import type { AmoCRMIntegration } from "@/features/amocrm/types";

export async function GET() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "not signed in" } },
      { status: 401 },
    );
  }

  try {
    // The Go API returns 200 with data omitted when not connected (see
    // AmoCRMHandler.Status's doc comment) — same convention as Click's
    // GET /v1/integrations/click.
    const integration = await goApiFetch<AmoCRMIntegration | undefined>("/v1/integrations/amocrm", {
      accessToken,
    });
    return NextResponse.json({ data: integration ?? null });
  } catch (err) {
    return errorResponse(err);
  }
}
