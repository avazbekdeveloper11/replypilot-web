import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";
import type { TeamMember } from "@/features/team/types";

async function requireAccessToken() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return { accessToken: null, response: NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "not signed in" } },
      { status: 401 },
    ) };
  }
  return { accessToken, response: null };
}

export async function GET() {
  const { accessToken, response } = await requireAccessToken();
  if (!accessToken) return response;

  try {
    const members = await goApiFetch<TeamMember[]>("/v1/team/members", { accessToken });
    return NextResponse.json({ data: members });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(request: Request) {
  const { accessToken, response } = await requireAccessToken();
  if (!accessToken) return response;

  const body = await request.json().catch(() => null);
  if (!body?.email || !body?.role_id) {
    return NextResponse.json(
      { error: { code: "INVALID_INPUT", message: "email and role_id are required" } },
      { status: 400 },
    );
  }

  try {
    const member = await goApiFetch<TeamMember>("/v1/team/members", {
      method: "POST",
      accessToken,
      body: JSON.stringify({ email: body.email, role_id: body.role_id }),
    });
    return NextResponse.json({ data: member }, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
