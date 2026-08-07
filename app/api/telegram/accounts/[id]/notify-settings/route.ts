import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";
import type { TelegramAccount } from "@/features/telegram/types";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "not signed in" } },
      { status: 401 },
    );
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json(
      { error: { code: "INVALID_INPUT", message: "invalid request body" } },
      { status: 400 },
    );
  }

  try {
    const account = await goApiFetch<TelegramAccount>(`/v1/telegram/accounts/${id}/notify-settings`, {
      method: "PATCH",
      body: JSON.stringify(body),
      accessToken,
    });
    return NextResponse.json({ data: account });
  } catch (err) {
    return errorResponse(err);
  }
}
