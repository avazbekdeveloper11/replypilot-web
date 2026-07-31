import { NextRequest, NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";
import type { AIUsagePoint } from "@/features/analytics/types";

export async function GET(request: NextRequest) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "not signed in" } },
      { status: 401 },
    );
  }

  const days = request.nextUrl.searchParams.get("days") ?? "14";

  try {
    const points = await goApiFetch<AIUsagePoint[]>(
      `/v1/analytics/ai-usage?days=${encodeURIComponent(days)}`,
      { accessToken },
    );
    return NextResponse.json({ data: points });
  } catch (err) {
    return errorResponse(err);
  }
}
