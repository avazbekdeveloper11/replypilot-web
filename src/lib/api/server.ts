import { serverEnv } from "@/config/env";
import type { ApiEnvelope } from "@/types/api";
import { ApiError } from "./errors";

/**
 * Server-to-server fetch against the Go API — used exclusively from
 * Route Handlers (`app/api/**`). This is the BFF boundary
 * (FRONTEND_ARCHITECTURE.md §3): the browser never calls this directly,
 * `GO_API_URL` never reaches client JS, and auth here is by whatever the
 * caller passes explicitly (a bearer token read from the request's
 * httpOnly cookie) — there's no ambient cookie forwarding, since browser
 * cookies and this server-to-server call are different trust boundaries.
 *
 * NOTE: would normally guard this with the `server-only` package (fails
 * the build if a Client Component imports it by mistake) but it couldn't
 * be installed in this sandbox — see web_app/replypilot-web/README.md.
 * Add it (`npm install server-only` + `import "server-only"` as the first
 * line) on a machine without that constraint. Until then, the guard is
 * discipline: only import this from `app/api/**` route handlers.
 */
export async function goApiFetch<T>(
  path: string,
  options: RequestInit & { accessToken?: string } = {},
): Promise<T> {
  const { accessToken, headers, ...rest } = options;

  let res: Response;
  try {
    res = await fetch(`${serverEnv.GO_API_URL}${path}`, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...headers,
      },
      cache: "no-store",
    });
  } catch (err) {
    throw ApiError.network(err);
  }

  let body: ApiEnvelope<T>;
  try {
    body = (await res.json()) as ApiEnvelope<T>;
  } catch {
    throw new ApiError("the API returned a non-JSON response", "BAD_RESPONSE", res.status);
  }

  if (!res.ok || body.error) {
    if (body.error) throw ApiError.fromBody(body.error, res.status);
    throw new ApiError("request failed", "UNKNOWN", res.status);
  }

  return body.data as T;
}

/**
 * Same contract as `goApiFetch`, for forwarding a `multipart/form-data`
 * request body (a file upload) to the Go API. Deliberately doesn't set
 * `Content-Type` itself — passing a `FormData` body to `fetch` makes it
 * generate the correct `multipart/form-data; boundary=...` header, which
 * `goApiFetch`'s hardcoded `application/json` default would otherwise
 * clobber.
 */
export async function goApiFetchMultipart<T>(
  path: string,
  formData: FormData,
  options: { accessToken?: string } = {},
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${serverEnv.GO_API_URL}${path}`, {
      method: "POST",
      body: formData,
      headers: options.accessToken ? { Authorization: `Bearer ${options.accessToken}` } : {},
      cache: "no-store",
    });
  } catch (err) {
    throw ApiError.network(err);
  }

  let body: ApiEnvelope<T>;
  try {
    body = (await res.json()) as ApiEnvelope<T>;
  } catch {
    throw new ApiError("the API returned a non-JSON response", "BAD_RESPONSE", res.status);
  }

  if (!res.ok || body.error) {
    if (body.error) throw ApiError.fromBody(body.error, res.status);
    throw new ApiError("request failed", "UNKNOWN", res.status);
  }

  return body.data as T;
}
