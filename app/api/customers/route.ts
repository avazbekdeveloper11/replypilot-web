import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";
import type { CustomerSummary } from "@/features/customers/types";

export async function GET(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "not signed in" } },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const segment = searchParams.get("segment");
  const upstreamParams = new URLSearchParams();
  if (search) upstreamParams.set("search", search);
  if (segment) upstreamParams.set("segment", segment);
  const path = upstreamParams.toString()
    ? `/v1/customers?${upstreamParams.toString()}`
    : "/v1/customers";

  try {
    const customers = await goApiFetch<CustomerSummary[]>(path, { accessToken });
    return NextResponse.json({ data: customers });
  } catch (err) {
    return errorResponse(err);
  }
}
