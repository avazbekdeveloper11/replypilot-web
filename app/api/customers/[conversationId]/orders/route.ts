import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";
import type { CustomerOrder } from "@/features/customers/types";

export async function GET(
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
    const orders = await goApiFetch<CustomerOrder[]>(
      `/v1/customers/${conversationId}/orders`,
      { accessToken },
    );
    return NextResponse.json({ data: orders });
  } catch (err) {
    return errorResponse(err);
  }
}
