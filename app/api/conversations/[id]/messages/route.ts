import { NextRequest, NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";
import type { Message } from "@/features/conversations/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "not signed in" } },
      { status: 401 },
    );
  }

  const { id } = await params;
  const qs = new URLSearchParams();
  const cursor = request.nextUrl.searchParams.get("cursor");
  const limit = request.nextUrl.searchParams.get("limit") ?? "50";
  if (cursor) qs.set("cursor", cursor);
  qs.set("limit", limit);

  try {
    const messages = await goApiFetch<Message[]>(
      `/v1/conversations/${id}/messages?${qs.toString()}`,
      { accessToken },
    );
    return NextResponse.json({ data: messages });
  } catch (err) {
    return errorResponse(err);
  }
}
