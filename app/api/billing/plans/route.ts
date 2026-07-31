import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";
import type { Plan } from "@/features/billing/types";

export async function GET() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "not signed in" } },
      { status: 401 },
    );
  }

  try {
    const plans = await goApiFetch<Plan[]>("/v1/billing/plans", { accessToken });
    return NextResponse.json({ data: plans });
  } catch (err) {
    return errorResponse(err);
  }
}
