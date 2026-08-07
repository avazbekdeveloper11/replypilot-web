import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";
import type { AmoCRMSyncResult } from "@/features/amocrm/types";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "not signed in" } },
      { status: 401 },
    );
  }

  const { conversationId } = await params;

  try {
    const result = await goApiFetch<AmoCRMSyncResult>(
      `/v1/customers/${conversationId}/amocrm-sync`,
      { method: "POST", accessToken },
    );
    return NextResponse.json({ data: result });
  } catch (err) {
    return errorResponse(err);
  }
}
