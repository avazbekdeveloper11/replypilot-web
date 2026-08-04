import { apiFetch } from "@/lib/api/client";
import type { Lead, LeadStatus } from "../types";

export function listLeads(status?: LeadStatus) {
  const suffix = status ? `?status=${status}` : "";
  return apiFetch<Lead[]>(`/api/leads${suffix}`);
}

export function updateLeadStatus({ id, status }: { id: string; status: LeadStatus }) {
  return apiFetch<Lead>(`/api/leads/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
