import { NextRequest, NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";
import type { DashboardNotification } from "@/features/dashboard/types";

/** Proxies GET /v1/dashboard/notifications?limit= — unread conversations
 * surfaced as notification items, see docs/DASHBOARD_MILESTONE.md for why
 * this isn't a dedicated notifications feed. */
export async function GET(request: NextRequest) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "not signed in" } },
      { status: 401 },
    );
  }

  const limit = request.nextUrl.searchParams.get("limit") ?? "10";

  try {
    const items = await goApiFetch<DashboardNotification[]>(
      `/v1/dashboard/notifications?limit=${encodeURIComponent(limit)}`,
      { accessToken },
    );
    return NextResponse.json({ data: items });
  } catch (err) {
    return errorResponse(err);
  }
}
