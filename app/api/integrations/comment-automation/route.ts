import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";
import type { CommentAutomation } from "@/features/comment-automation/types";

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
    const settings = await goApiFetch<CommentAutomation>(
      "/v1/integrations/comment-automation",
      { accessToken },
    );
    return NextResponse.json({ data: settings });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PUT(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) return unauthorized();

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json(
      { error: { code: "INVALID_INPUT", message: "invalid request body" } },
      { status: 400 },
    );
  }

  try {
    const settings = await goApiFetch<CommentAutomation>(
      "/v1/integrations/comment-automation",
      { method: "PUT", body: JSON.stringify(body), accessToken },
    );
    return NextResponse.json({ data: settings });
  } catch (err) {
    return errorResponse(err);
  }
}
