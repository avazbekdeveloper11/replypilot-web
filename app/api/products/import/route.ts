import { NextResponse } from "next/server";

import { goApiFetchMultipart } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";
import type { ProductImportResult } from "@/features/products/types";

/**
 * Forwards the browser's `multipart/form-data` upload straight through to
 * the Go API rather than parsing the file out and re-encoding it — same
 * "the Go handler needs the raw file bytes" reasoning as
 * app/api/knowledge-base/documents/route.ts's POST.
 */
export async function POST(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "not signed in" } },
      { status: 401 },
    );
  }

  const formData = await request.formData().catch(() => null);
  if (!formData || !formData.get("file")) {
    return NextResponse.json(
      { error: { code: "INVALID_INPUT", message: "file is required" } },
      { status: 400 },
    );
  }

  try {
    const result = await goApiFetchMultipart<ProductImportResult>(
      "/v1/products/import",
      formData,
      { accessToken },
    );
    return NextResponse.json({ data: result }, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
