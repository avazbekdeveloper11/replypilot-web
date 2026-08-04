import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.email || !body?.code || !body?.new_password) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_INPUT",
          message: "email, code, and new_password are required",
        },
      },
      { status: 400 },
    );
  }

  try {
    const result = await goApiFetch<{ reset: boolean }>("/v1/auth/password/reset", {
      method: "POST",
      body: JSON.stringify({
        email: body.email,
        code: body.code,
        new_password: body.new_password,
      }),
    });
    return NextResponse.json({ data: result });
  } catch (err) {
    return errorResponse(err);
  }
}
