import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "not signed in" } },
      { status: 401 },
    );
  }

  const { id } = await params;

  try {
    const result = await goApiFetch<{ disconnected: boolean }>(`/v1/telegram/accounts/${id}`, {
      method: "DELETE",
      accessToken,
    });
    return NextResponse.json({ data: result });
  } catch (err) {
    return errorResponse(err);
  }
}
