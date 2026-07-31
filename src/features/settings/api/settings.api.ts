import { apiFetch } from "@/lib/api/client";
import type { Organization } from "@/features/auth/types";

export function getOrganization() {
  return apiFetch<Organization>("/api/organizations/me");
}

export function updateOrganization(input: { name: string; timezone: string }) {
  return apiFetch<Organization>("/api/organizations/me", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}
