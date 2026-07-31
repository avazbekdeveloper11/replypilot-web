import { apiFetch } from "@/lib/api/client";
import type { InstagramAccount, InstagramConnectResult } from "../types";

export function listInstagramAccounts() {
  return apiFetch<InstagramAccount[]>("/api/instagram/accounts");
}

export function startInstagramConnect() {
  return apiFetch<InstagramConnectResult>("/api/instagram/connect", { method: "POST" });
}

/** Completes the OAuth exchange — called once, by the callback page, with
 * the `code`/`state` Instagram put on its redirect URL. */
export function completeInstagramConnect(input: { code: string; state: string }) {
  return apiFetch<InstagramAccount>("/api/instagram/callback", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function disconnectInstagramAccount(id: string) {
  return apiFetch<{ disconnected: boolean }>(`/api/instagram/accounts/${id}`, {
    method: "DELETE",
  });
}
