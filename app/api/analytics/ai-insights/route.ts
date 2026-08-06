import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";
import type { AIInsights } from "@/features/analytics/types";

export async function GET() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "not signed in" } },
      { status: 401 },
    );
  }

  try {
    const insights = await goApiFetch<AIInsights | undefined>("/v1/analytics/ai-insights", {
      accessToken,
    });
    return NextResponse.json({ data: insights ?? null });
  } catch (err) {
    return errorResponse(err);
  }
}
