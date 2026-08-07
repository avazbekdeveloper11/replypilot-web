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

// PATCH updates the AI business-hours gate — see
// OrganizationHandler.UpdateBusinessHours's doc comment. start/end are
// "HH:MM", only required when enabled=true; the Go side validates that,
// so this route just passes the body through rather than duplicating the
// validation.
export async function PATCH(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) return unauthorized();

  const body = await request.json().catch(() => null);
  if (!body || typeof body.enabled !== "boolean") {
    return NextResponse.json(
      { error: { code: "INVALID_INPUT", message: "enabled is required" } },
      { status: 400 },
    );
  }

  try {
    const org = await goApiFetch<Organization>("/v1/organizations/me/business-hours", {
      method: "PATCH",
      accessToken,
      body: JSON.stringify({
        enabled: body.enabled,
        start: body.start ?? "",
        end: body.end ?? "",
      }),
    });
    return NextResponse.json({ data: org });
  } catch (err) {
    return errorResponse(err);
  }
}
