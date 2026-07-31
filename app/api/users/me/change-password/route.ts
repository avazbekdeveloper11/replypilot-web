import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";

export async function POST(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "not signed in" } },
      { status: 401 },
    );
  }

  const body = await request.json().catch(() => null);
  if (!body?.current_password || !body?.new_password) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_INPUT",
          message: "current_password and new_password are required",
        },
      },
      { status: 400 },
    );
  }

  try {
    await goApiFetch("/v1/users/me/change-password", {
      method: "POST",
      accessToken,
      body: JSON.stringify({
        current_password: body.current_password,
        new_password: body.new_password,
      }),
    });
    return NextResponse.json({ data: { changed: true } });
  } catch (err) {
    return errorResponse(err);
  }
}
