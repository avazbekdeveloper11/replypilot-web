import { apiFetch } from "@/lib/api/client";
import type { OrganizationMembership, Session } from "../types";

/** Step 1 of registration — sends a 6-digit OTP to the given email via
 * Resend. Same anti-enumeration shape as forgotPassword: always resolves,
 * never reveals whether the email is already registered. */
export function requestRegistrationCode(email: string) {
  return apiFetch<{ message: string }>("/api/auth/register/code", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function register(input: {
  organization_name: string;
  organization_slug: string;
  full_name: string;
  email: string;
  password: string;
  code: string;
}) {
  return apiFetch<Session>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

/** Step 1 of login — see schemas/login.schema.ts for why this exists. */
export function listOrganizationsByEmail(email: string) {
  return apiFetch<OrganizationMembership[]>(
    `/api/auth/organizations?email=${encodeURIComponent(email)}`,
  );
}

export function login(input: { email: string; password: string; organization_id: string }) {
  return apiFetch<Session>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function forgotPassword(email: string) {
  return apiFetch<{ message: string }>("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(input: { email: string; code: string; new_password: string }) {
  return apiFetch<{ reset: boolean }>("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
