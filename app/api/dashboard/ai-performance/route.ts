import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";
import type { AIPerformanceStats } from "@/features/dashboard/types";

/** Proxies GET /v1/dashboard/ai-performance. Real query against
 * ai_responses — this project has no AI reply pipeline implemented yet,
 * so expect total_responses: 0 until it exists. See
 * docs/DASHBOARD_MILESTONE.md. */
export async function GET() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "not signed in" } },
      { status: 401 },
    );
  }

  try {
    const stats = await goApiFetch<AIPerformanceStats>("/v1/dashboard/ai-performance", {
      accessToken,
    });
    return NextResponse.json({ data: stats });
  } catch (err) {
    return errorResponse(err);
  }
}
