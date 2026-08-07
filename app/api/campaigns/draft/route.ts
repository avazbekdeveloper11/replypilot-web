import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";
import type { CampaignDraft } from "@/features/campaigns/types";

export async function POST(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "not signed in" } },
      { status: 401 },
    );
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json(
      { error: { code: "INVALID_INPUT", message: "invalid request body" } },
      { status: 400 },
    );
  }

  try {
    const draft = await goApiFetch<CampaignDraft>("/v1/campaigns/draft", {
      method: "POST",
      body: JSON.stringify(body),
      accessToken,
    });
    return NextResponse.json({ data: draft });
  } catch (err) {
    return errorResponse(err);
  }
}
