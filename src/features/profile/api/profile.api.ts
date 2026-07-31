import { apiFetch } from "@/lib/api/client";
import type { User } from "@/features/auth/types";

export function getMe() {
  return apiFetch<User>("/api/users/me");
}

export function updateProfile(input: { full_name: string; avatar_url?: string | null }) {
  return apiFetch<User>("/api/users/me", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function changePassword(input: { current_password: string; new_password: string }) {
  return apiFetch<{ changed: boolean }>("/api/users/me/change-password", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function logout() {
  return apiFetch<{ logged_out: boolean }>("/api/auth/logout", { method: "POST" });
}
