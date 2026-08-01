import { NextResponse } from "next/server";

import { goApiFetch, goApiFetchMultipart } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";
import type { KnowledgeDocument } from "@/features/knowledge-base/types";

// Plain helper + early return, not a destructured { accessToken, response }
// pair — TS can't correlate two separately-destructured fields back to a
// discriminated union, so that shape made every handler below appear to
// return `Promise<NextResponse | null>` and fail Next's build-time route
// type validation (`null` isn't a valid Response). Same fix as every other
// route handler in this codebase (e.g. app/api/organizations/me/route.ts).
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
    const documents = await goApiFetch<KnowledgeDocument[]>("/v1/knowledge-base/documents", {
      accessToken,
    });
    return NextResponse.json({ data: documents });
  } catch (err) {
    return errorResponse(err);
  }
}

/**
 * Forwards the browser's `multipart/form-data` upload straight through to
 * the Go API rather than parsing fields out and re-encoding as JSON — the
 * Go handler already expects multipart (it needs the raw file bytes for
 * the `file` case), so re-encoding here would just be extra work for no
 * benefit. See goApiFetchMultipart's doc comment for why Content-Type is
 * left for fetch to set.
 */
export async function POST(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) return unauthorized();

  const formData = await request.formData().catch(() => null);
  if (!formData || !formData.get("title")) {
    return NextResponse.json(
      { error: { code: "INVALID_INPUT", message: "title is required" } },
      { status: 400 },
    );
  }

  try {
    const document = await goApiFetchMultipart<KnowledgeDocument>(
      "/v1/knowledge-base/documents",
      formData,
      { accessToken },
    );
    return NextResponse.json({ data: document }, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
