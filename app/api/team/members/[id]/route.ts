import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";
import type { TeamMember } from "@/features/team/types";

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
  if (!body?.role_id) {
    return NextResponse.json(
      { error: { code: "INVALID_INPUT", message: "role_id is required" } },
      { status: 400 },
    );
  }

  try {
    const member = await goApiFetch<TeamMember>(`/v1/team/members/${id}`, {
      method: "PATCH",
      accessToken,
      body: JSON.stringify({ role_id: body.role_id }),
    });
    return NextResponse.json({ data: member });
  } catch (err) {
    return errorResponse(err);
  }
}

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
    // Go API returns {data:{removed:true}}, not a bare 204 — see
    // TeamHandler.Remove's doc comment.
    const result = await goApiFetch<{ removed: boolean }>(`/v1/team/members/${id}`, {
      method: "DELETE",
      accessToken,
    });
    return NextResponse.json({ data: result });
  } catch (err) {
    return errorResponse(err);
  }
}
