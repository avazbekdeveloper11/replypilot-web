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
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
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

  let body: ApiEnvelope<T>;
  try {
    body = (await res.json()) as ApiEnvelope<T>;
  } catch {
    throw new ApiError("the server returned a non-JSON response", "BAD_RESPONSE", res.status);
  }

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
export async function apiFetchForm<T>(path: string, formData: FormData): Promise<T> {
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

  let body: ApiEnvelope<T>;
  try {
    body = (await res.json()) as ApiEnvelope<T>;
  } catch {
    throw new ApiError("the server returned a non-JSON response", "BAD_RESPONSE", res.status);
  }

  if (!res.ok || body.error) {
    if (body.error) throw ApiError.fromBody(body.error, res.status);
    throw new ApiError("request failed", "UNKNOWN", res.status);
  }

  return body.data as T;
}
