import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";
import type { InstagramAccount } from "@/features/instagram/types";

export async function GET() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "not signed in" } },
      { status: 401 },
    );
  }

  try {
    const accounts = await goApiFetch<InstagramAccount[]>("/v1/instagram/accounts", {
      accessToken,
    });
    return NextResponse.json({ data: accounts });
  } catch (err) {
    return errorResponse(err);
  }
}
