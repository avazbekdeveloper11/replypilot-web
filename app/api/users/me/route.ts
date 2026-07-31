import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";
import type { User } from "@/features/auth/types";

function unauthorized() {
  return NextResponse.json(
    { error: { code: "UNAUTHORIZED", message: "not signed in" } },
    { status: 401 },
  );
}

export async function GET() {
  const accessToken = await getAccessToken();
  if (!accessToken) return unauthorized();

  try {
    const user = await goApiFetch<User>("/v1/users/me", { accessToken });
    return NextResponse.json({ data: user });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PATCH(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) return unauthorized();

  const body = await request.json().catch(() => null);
  if (!body?.full_name) {
    return NextResponse.json(
      { error: { code: "INVALID_INPUT", message: "full_name is required" } },
      { status: 400 },
    );
  }

  try {
    const user = await goApiFetch<User>("/v1/users/me", {
      method: "PATCH",
      accessToken,
      body: JSON.stringify({
        full_name: body.full_name,
        avatar_url: body.avatar_url ?? null,
      }),
    });
    return NextResponse.json({ data: user });
  } catch (err) {
    return errorResponse(err);
  }
}
