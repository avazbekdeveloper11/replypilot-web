import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { ApiError } from "@/lib/api/errors";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";
import type { Subscription } from "@/features/billing/types";

/**
 * A 404 from the Go API here means "this org has never completed
 * Checkout" (see usecase/billing's package doc comment) — an expected,
 * common state, not a failure. Normalized to {data: null} rather than
 * bubbling up as an error, so the Billing page can render an upgrade
 * prompt instead of an error banner for every brand-new organization.
 */
export async function GET() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "not signed in" } },
      { status: 401 },
    );
  }

  try {
    const subscription = await goApiFetch<Subscription>("/v1/billing/subscription", { accessToken });
    return NextResponse.json({ data: subscription });
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return NextResponse.json({ data: null });
    }
    return errorResponse(err);
  }
}
