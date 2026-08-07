import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";
import type { TelegramNotifyCodeResult } from "@/features/telegram/types";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "not signed in" } },
      { status: 401 },
    );
  }

  const { id } = await params;

  try {
    const result = await goApiFetch<TelegramNotifyCodeResult>(
      `/v1/telegram/accounts/${id}/notify-code`,
      { method: "POST", accessToken },
    );
    return NextResponse.json({ data: result });
  } catch (err) {
    return errorResponse(err);
  }
}
