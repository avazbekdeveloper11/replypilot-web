import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";
import type { DashboardStats } from "@/features/dashboard/types";

/** Proxies GET /v1/dashboard/stats — the first protected (session-required)
 * Route Handler in this app; every dashboard route below follows the same
 * shape: read the httpOnly access-token cookie, 401 if there isn't one,
 * otherwise forward as a Bearer token to the Go API. */
export async function GET() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "not signed in" } },
      { status: 401 },
    );
  }

  try {
    const stats = await goApiFetch<DashboardStats>("/v1/dashboard/stats", { accessToken });
    return NextResponse.json({ data: stats });
  } catch (err) {
    return errorResponse(err);
  }
}
