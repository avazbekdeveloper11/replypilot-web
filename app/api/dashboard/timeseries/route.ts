import { NextRequest, NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";
import type { DashboardTimeSeriesPoint } from "@/features/dashboard/types";

/** Proxies GET /v1/dashboard/timeseries?days= — backs the Charts widget. */
export async function GET(request: NextRequest) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "not signed in" } },
      { status: 401 },
    );
  }

  const days = request.nextUrl.searchParams.get("days") ?? "7";

  try {
    const points = await goApiFetch<DashboardTimeSeriesPoint[]>(
      `/v1/dashboard/timeseries?days=${encodeURIComponent(days)}`,
      { accessToken },
    );
    return NextResponse.json({ data: points });
  } catch (err) {
    return errorResponse(err);
  }
}
