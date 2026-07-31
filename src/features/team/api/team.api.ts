import { apiFetch } from "@/lib/api/client";
import type { Role, TeamMember } from "../types";

export function listTeamMembers() {
  return apiFetch<TeamMember[]>("/api/team/members");
}

export function listAssignableRoles() {
  return apiFetch<Role[]>("/api/team/roles");
}

export function inviteMember(input: { email: string; role_id: string }) {
  return apiFetch<TeamMember>("/api/team/members", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateMemberRole(input: { id: string; role_id: string }) {
  return apiFetch<TeamMember>(`/api/team/members/${input.id}`, {
    method: "PATCH",
    body: JSON.stringify({ role_id: input.role_id }),
  });
}

export function removeMember(id: string) {
  // Backend returns {data:{removed:true}}, not a bare 204 — see the doc
  // comment on TeamHandler.Remove for why (every fetch helper in this app
  // unconditionally parses a JSON body).
  return apiFetch<{ removed: boolean }>(`/api/team/members/${id}`, { method: "DELETE" });
}
