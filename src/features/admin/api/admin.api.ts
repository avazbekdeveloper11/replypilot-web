import { apiFetch } from "@/lib/api/client";
import type { Organization } from "@/features/auth/types";
import type { AdminGeminiSettings, AdminOrganization, AdminPlatformStats } from "../types";

export function listOrganizations() {
  return apiFetch<AdminOrganization[]>("/api/admin/organizations");
}

export function getPlatformStats() {
  return apiFetch<AdminPlatformStats>("/api/admin/stats");
}

export function suspendOrganization(id: string) {
  return apiFetch<Organization>(`/api/admin/organizations/${id}/suspend`, { method: "POST" });
}

export function reactivateOrganization(id: string) {
  return apiFetch<Organization>(`/api/admin/organizations/${id}/reactivate`, { method: "POST" });
}

export function getGeminiSettings() {
  return apiFetch<AdminGeminiSettings>("/api/admin/settings/gemini");
}

export function setGeminiSettings(apiKey: string) {
  return apiFetch<AdminGeminiSettings>("/api/admin/settings/gemini", {
    method: "PUT",
    body: JSON.stringify({ api_key: apiKey }),
  });
}
