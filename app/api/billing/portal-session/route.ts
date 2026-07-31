import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";

export async function POST() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "not signed in" } },
      { status: 401 },
    );
  }

  try {
    const session = await goApiFetch<{ url: string }>("/v1/billing/portal-session", {
      method: "POST",
      accessToken,
    });
    return NextResponse.json({ data: session });
  } catch (err) {
    return errorResponse(err);
  }
}
