import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";
import type { ConversationOutcomes } from "@/features/analytics/types";

export async function GET() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "not signed in" } },
      { status: 401 },
    );
  }

  try {
    const outcomes = await goApiFetch<ConversationOutcomes>("/v1/analytics/conversation-outcomes", {
      accessToken,
    });
    return NextResponse.json({ data: outcomes });
  } catch (err) {
    return errorResponse(err);
  }
}
