/**
 * Mirrors the Go API's response envelope exactly
 * (`backend/internal/delivery/http/response/response.go`): every endpoint
 * returns `{ data }` on success or `{ error: { code, message,
 * request_id } }` on failure — never both, never neither. Typed once
 * here; both `lib/api/server.ts` (used inside Route Handlers) and
 * `lib/api/client.ts` (used by feature hooks) unwrap through this same
 * shape, so a Go error becomes the same `ApiError` regardless of which
 * layer caught it.
 */
export interface ApiEnvelope<T> {
  data?: T;
  error?: ApiErrorBody;
  meta?: unknown;
}

export interface ApiErrorBody {
  code: string;
  message: string;
  request_id?: string;
}
