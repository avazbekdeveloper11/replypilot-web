import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.email) {
    return NextResponse.json(
      { error: { code: "INVALID_INPUT", message: "email is required" } },
      { status: 400 },
    );
  }

  try {
    const result = await goApiFetch<{ message: string }>("/v1/auth/password/forgot", {
      method: "POST",
      body: JSON.stringify({ email: body.email }),
    });
    return NextResponse.json({ data: result });
  } catch (err) {
    return errorResponse(err);
  }
}
