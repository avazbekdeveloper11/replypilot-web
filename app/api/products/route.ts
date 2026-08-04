import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";
import type { Product } from "@/features/products/types";

// Plain helper, not a destructured pair — see
// app/api/knowledge-base/documents/route.ts's doc comment on why.
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
    const products = await goApiFetch<Product[]>("/v1/products", { accessToken });
    return NextResponse.json({ data: products });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(request: Request) {
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
    const product = await goApiFetch<Product>("/v1/products", {
      method: "POST",
      body: JSON.stringify(body),
      accessToken,
    });
    return NextResponse.json({ data: product }, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
