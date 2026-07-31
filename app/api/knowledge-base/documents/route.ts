import { NextResponse } from "next/server";

import { goApiFetch, goApiFetchMultipart } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";
import type { KnowledgeDocument } from "@/features/knowledge-base/types";

async function requireAccessToken() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return {
      accessToken: null,
      response: NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "not signed in" } },
        { status: 401 },
      ),
    };
  }
  return { accessToken, response: null };
}

export async function GET() {
  const { accessToken, response } = await requireAccessToken();
  if (!accessToken) return response;

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
  const { accessToken, response } = await requireAccessToken();
  if (!accessToken) return response;

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
