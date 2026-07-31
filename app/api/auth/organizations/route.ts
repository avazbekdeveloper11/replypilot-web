import { NextRequest, NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import type { OrganizationMembership } from "@/features/auth/types";

/**
 * Proxies GET /v1/auth/organizations?email=... — no cookie/auth involved
 * (this runs before login), so this is a thin passthrough. Still goes
 * through the BFF (not called directly from the browser) so GO_API_URL
 * stays server-only, consistent with every other auth call.
 */
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json(
      { error: { code: "INVALID_INPUT", message: "email is required" } },
      { status: 400 },
    );
  }

  try {
    const memberships = await goApiFetch<OrganizationMembership[]>(
      `/v1/auth/organizations?email=${encodeURIComponent(email)}`,
    );
    return NextResponse.json({ data: memberships });
  } catch (err) {
    return errorResponse(err);
  }
}
