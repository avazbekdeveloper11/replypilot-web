import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";
import type { Lead } from "@/features/leads/types";

export async function GET(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "not signed in" } },
      { status: 401 },
    );
  }

  const status = new URL(request.url).searchParams.get("status");
  const suffix = status ? `?status=${encodeURIComponent(status)}` : "";

  try {
    const leads = await goApiFetch<Lead[]>(`/v1/leads${suffix}`, { accessToken });
    return NextResponse.json({ data: leads });
  } catch (err) {
    return errorResponse(err);
  }
}
