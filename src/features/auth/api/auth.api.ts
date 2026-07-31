import { apiFetch } from "@/lib/api/client";
import type { OrganizationMembership, Session } from "../types";

export function register(input: {
  organization_name: string;
  organization_slug: string;
  full_name: string;
  email: string;
  password: string;
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

export function resetPassword(input: { token: string; new_password: string }) {
  return apiFetch<{ reset: boolean }>("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
