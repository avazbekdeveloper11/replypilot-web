import { NextResponse, type NextRequest } from "next/server";

import { ACCESS_TOKEN_COOKIE } from "@/lib/auth/cookies";

/**
 * Edge auth gate — coarse only ("is there a plausibly-valid session"),
 * never fine-grained permissions (FRONTEND_ARCHITECTURE.md §3: that's the
 * Go API's job). Checks for the presence of the httpOnly access-token
 * cookie, not its validity — an expired-but-present token still passes
 * this gate and gets a real 401 from the Route Handlers/Go API instead,
 * which is the correct layer to reject it (this is a UX redirect, not the
 * security boundary). A signed-out visit to a protected route redirects to
 * /login with ?next= so the post-login redirect lands back where they
 * were headed.
 */
export function middleware(request: NextRequest) {
  const hasSession = request.cookies.has(ACCESS_TOKEN_COOKIE);
  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    // Preserve the query string, not just the path: /instagram/callback
    // carries Instagram's `code`/`state` here, and dropping them would
    // silently kill an in-flight connect attempt if the session cookie
    // happened to lapse during the round trip to Instagram's own OAuth
    // screen — the user would land back on /login with nothing to
    // resume. searchParams.set percent-encodes the whole value, so the
    // embedded `?`/`&` round-trip correctly through LoginForm's
    // safeRedirectTarget on the way back out.
    loginUrl.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/conversations/:path*",
    "/ai-inbox/:path*",
    "/knowledge-base/:path*",
    "/analytics/:path*",
    "/instagram/:path*",
    "/team/:path*",
    "/billing/:path*",
    "/settings/:path*",
    "/profile/:path*",
    "/admin/:path*",
  ],
};
