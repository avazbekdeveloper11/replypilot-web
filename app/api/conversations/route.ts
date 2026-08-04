import { NextRequest, NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";
import type { Conversation } from "@/features/conversations/types";

/**
 * Proxies GET /v1/conversations?status=&search=&cursor=&limit=. Shared by
 * the Dashboard's Recent Conversations widget (limit only) and the full
 * Conversations page (status + search + cursor too, for filtering and
 * "load more" pagination — see src/features/conversations/hooks/use-conversations.ts).
 */
export async function GET(request: NextRequest) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "not signed in" } },
      { status: 401 },
    );
  }

  const qs = new URLSearchParams();
  const status = request.nextUrl.searchParams.get("status");
  const search = request.nextUrl.searchParams.get("search");
  const cursor = request.nextUrl.searchParams.get("cursor");
  const limit = request.nextUrl.searchParams.get("limit") ?? "20";
  if (status) qs.set("status", status);
  if (search) qs.set("search", search);
  if (cursor) qs.set("cursor", cursor);
  qs.set("limit", limit);

  try {
    const conversations = await goApiFetch<Conversation[]>(
      `/v1/conversations?${qs.toString()}`,
      { accessToken },
    );
    return NextResponse.json({ data: conversations });
  } catch (err) {
    return errorResponse(err);
  }
}
