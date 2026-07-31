/**
 * Mirrors backend/internal/delivery/http/v1/dto.go response shapes
 * exactly (field names, casing) — these are the wire types, not domain
 * models. Keep in sync by hand until docs/FRONTEND_ARCHITECTURE.md §9's
 * OpenAPI-generated client is wired up.
 */
export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string | null;
  is_platform_admin: boolean;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  status: string;
  timezone: string;
}

export interface OrganizationMembership {
  organization: Organization;
  member_status: string;
}

/** What the client-facing /api/auth/login route returns — notably NOT
 *  the tokens themselves, those are set as httpOnly cookies server-side
 *  and never serialized into a client-visible response body. */
export interface Session {
  user: User;
  organization: Organization;
}

/**
 * The Go API's full AuthResponse (backend/internal/delivery/http/v1/dto.go)
 * — INCLUDES the raw tokens. Only ever used inside
 * `app/api/auth/login/route.ts` (server-side); never imported by a
 * Client Component. Everything client-visible uses `Session` above.
 */
export interface AuthResult {
  access_token: string;
  refresh_token: string;
  expires_at: string;
  user: User;
  organization: Organization;
}
