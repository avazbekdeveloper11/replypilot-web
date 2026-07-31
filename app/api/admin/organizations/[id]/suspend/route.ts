import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";
import type { Organization } from "@/features/auth/types";

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
    const org = await goApiFetch<Organization>(`/v1/admin/organizations/${id}/suspend`, {
      method: "POST",
      accessToken,
    });
    return NextResponse.json({ data: org });
  } catch (err) {
    return errorResponse(err);
  }
}
