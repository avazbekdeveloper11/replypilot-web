import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";
import type { AdminOrganization } from "@/features/admin/types";

export async function GET() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "not signed in" } },
      { status: 401 },
    );
  }

  try {
    const orgs = await goApiFetch<AdminOrganization[]>("/v1/admin/organizations", { accessToken });
    return NextResponse.json({ data: orgs });
  } catch (err) {
    return errorResponse(err);
  }
}
