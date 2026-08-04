import type { ApiEnvelope } from "@/types/api";
import { ApiError } from "./errors";

/**
 * Browser-side fetch wrapper — every feature hook (TanStack Query
 * mutation/query fn) calls THIS, never the Go API directly. It always
 * targets this Next.js app's own `/api/**` Route Handlers (same-origin,
 * so the browser's httpOnly auth cookie is sent automatically by the
 * browser — no manual header wiring here, no CORS). The Route Handler on
 * the other end is what actually talks to the Go API — see
 * `lib/api/server.ts`.
 */

// isAuthRoute excludes /api/auth/** from the 401-triggers-refresh logic
// below. Two reasons: (1) a wrong-password Login attempt legitimately
// 401s and must surface that error immediately, not get masked behind an
// unrelated refresh attempt; (2) POST /api/auth/refresh itself can 401
// (refresh token dead) — retrying refresh-on-401-of-refresh would recurse.
function isAuthRoute(path: string): boolean {
  return path.startsWith("/api/auth/");
}

// Concurrent 401s (e.g. a page firing several TanStack queries at once
// right as the access token expires) must not each fire their own
// refresh call — that's a thundering-herd of refresh requests, and only
// the first one's result matters to the rest. This module-level promise
// is how every caller in the same request burst waits on the SAME
// refresh attempt instead of starting their own.
let refreshPromise: Promise<boolean> | null = null;

function refreshSession(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch("/api/auth/refresh", { method: "POST", credentials: "same-origin" })
      .then((res) => res.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

// The refresh token cookie is itself dead (expired past its 7-day life,
// revoked by a logout elsewhere, or never existed) — there's no
// recovering this session client-side. This is the one place a plain
// fetch client redirects on its own initiative, rather than leaving
// navigation to the caller: every feature hook in this app funnels
// through apiFetch/apiFetchForm, so this is the single choke point where
// "the session is unrecoverably gone" is known, and every caller would
// otherwise have to duplicate this same redirect.
function redirectToLogin(): void {
  if (typeof window === "undefined") return;
  const next = window.location.pathname + window.location.search;
  window.location.href = `/login?next=${encodeURIComponent(next)}`;
}

async function parseEnvelope<T>(res: Response): Promise<ApiEnvelope<T>> {
  try {
    return (await res.json()) as ApiEnvelope<T>;
  } catch {
    throw new ApiError("the server returned a non-JSON response", "BAD_RESPONSE", res.status);
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  _retried = false,
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "same-origin",
    });
  } catch (err) {
    throw ApiError.network(err);
  }

  if (res.status === 401 && !_retried && !isAuthRoute(path)) {
    const refreshed = await refreshSession();
    if (refreshed) {
      return apiFetch<T>(path, options, true);
    }
    redirectToLogin();
    throw new ApiError("session expired", "SESSION_EXPIRED", 401);
  }

  const body = await parseEnvelope<T>(res);

  if (!res.ok || body.error) {
    if (body.error) throw ApiError.fromBody(body.error, res.status);
    throw new ApiError("request failed", "UNKNOWN", res.status);
  }

  return body.data as T;
}

/**
 * Same contract as `apiFetch`, for a `FormData` body (file uploads). Never
 * sets `Content-Type` itself — the browser has to generate the
 * `multipart/form-data; boundary=...` value, which isn't reproducible by
 * hand, so this deliberately omits the header rather than reusing
 * `apiFetch`'s JSON default.
 */
export async function apiFetchForm<T>(
  path: string,
  formData: FormData,
  _retried = false,
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      method: "POST",
      body: formData,
      credentials: "same-origin",
    });
  } catch (err) {
    throw ApiError.network(err);
  }

  if (res.status === 401 && !_retried && !isAuthRoute(path)) {
    const refreshed = await refreshSession();
    if (refreshed) {
      return apiFetchForm<T>(path, formData, true);
    }
    redirectToLogin();
    throw new ApiError("session expired", "SESSION_EXPIRED", 401);
  }

  const body = await parseEnvelope<T>(res);

  if (!res.ok || body.error) {
    if (body.error) throw ApiError.fromBody(body.error, res.status);
    throw new ApiError("request failed", "UNKNOWN", res.status);
  }

  return body.data as T;
}
