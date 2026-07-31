import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";
import type { Organization } from "@/features/auth/types";

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
    const org = await goApiFetch<Organization>("/v1/organizations/me", { accessToken });
    return NextResponse.json({ data: org });
  } catch (err) {
    return errorResponse(err);
  }
}

// PATCH updates name + timezone only — slug is not editable here, see
// OrganizationHandler.UpdateMe's doc comment.
export async function PATCH(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) return unauthorized();

  const body = await request.json().catch(() => null);
  if (!body?.name) {
    return NextResponse.json(
      { error: { code: "INVALID_INPUT", message: "name is required" } },
      { status: 400 },
    );
  }

  try {
    const org = await goApiFetch<Organization>("/v1/organizations/me", {
      method: "PATCH",
      accessToken,
      body: JSON.stringify({
        name: body.name,
        timezone: body.timezone ?? "",
      }),
    });
    return NextResponse.json({ data: org });
  } catch (err) {
    return errorResponse(err);
  }
}
