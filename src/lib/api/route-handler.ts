import { NextResponse } from "next/server";

import { ApiError } from "./errors";

/**
 * The one place every `app/api/auth/*` Route Handler turns a caught
 * error into a response — keeps the envelope shape
 * (`{error:{code,message}}`) and status-code mapping identical across
 * all of them instead of four copies of the same try/catch.
 */
export function errorResponse(err: unknown): NextResponse {
  if (err instanceof ApiError) {
    return NextResponse.json(
      { error: { code: err.code, message: err.message } },
      // status 0 means "network error talking to the Go API itself" —
      // that's a 502 (bad gateway) from this app's point of view, not
      // whatever falsy status ApiError.network() defaulted to.
      { status: err.status || 502 },
    );
  }
  return NextResponse.json(
    { error: { code: "INTERNAL", message: "unexpected error" } },
    { status: 500 },
  );
}
