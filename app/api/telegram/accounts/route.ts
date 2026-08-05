import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";
import type { TelegramAccount } from "@/features/telegram/types";

export async function GET() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "not signed in" } },
      { status: 401 },
    );
  }

  try {
    const accounts = await goApiFetch<TelegramAccount[]>("/v1/telegram/accounts", {
      accessToken,
    });
    return NextResponse.json({ data: accounts });
  } catch (err) {
    return errorResponse(err);
  }
}
