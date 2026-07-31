import type { ApiErrorBody } from "@/types/api";

/**
 * The one error type every API call in this app throws — a Go
 * `{error:{code,message,request_id}}`, a network failure, or a malformed
 * response all normalize to this, so callers (TanStack Query's `onError`,
 * a form's catch block) handle one shape.
 */
export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly requestId?: string;

  constructor(message: string, code: string, status: number, requestId?: string) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.requestId = requestId;
  }

  static fromBody(body: ApiErrorBody, status: number): ApiError {
    return new ApiError(body.message, body.code, status, body.request_id);
  }

  static network(err: unknown): ApiError {
    const message = err instanceof Error ? err.message : "network request failed";
    return new ApiError(message, "NETWORK_ERROR", 0);
  }
}
