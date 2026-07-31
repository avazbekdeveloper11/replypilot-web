import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";
import type { AdminGeminiSettings } from "@/features/admin/types";

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
    const settings = await goApiFetch<AdminGeminiSettings>("/v1/admin/settings/gemini", {
      accessToken,
    });
    return NextResponse.json({ data: settings });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PUT(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) return unauthorized();

  const body = await request.json().catch(() => null);
  if (!body?.api_key) {
    return NextResponse.json(
      { error: { code: "INVALID_INPUT", message: "api_key is required" } },
      { status: 400 },
    );
  }

  try {
    const settings = await goApiFetch<AdminGeminiSettings>("/v1/admin/settings/gemini", {
      method: "PUT",
      accessToken,
      body: JSON.stringify({ api_key: body.api_key }),
    });
    return NextResponse.json({ data: settings });
  } catch (err) {
    return errorResponse(err);
  }
}
