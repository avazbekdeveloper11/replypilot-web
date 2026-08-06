import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";
import type { Conversation } from "@/features/conversations/types";

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
    const conversation = await goApiFetch<Conversation>(`/v1/conversations/${id}/summary`, {
      method: "POST",
      accessToken,
    });
    return NextResponse.json({ data: conversation });
  } catch (err) {
    return errorResponse(err);
  }
}
