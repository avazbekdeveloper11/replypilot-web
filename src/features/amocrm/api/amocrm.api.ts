import { apiFetch } from "@/lib/api/client";
import type { AmoCRMConnectResult, AmoCRMIntegration, AmoCRMSyncResult } from "../types";

export function getAmoCRMStatus() {
  return apiFetch<AmoCRMIntegration | null>("/api/integrations/amocrm");
}

export function startAmoCRMConnect() {
  return apiFetch<AmoCRMConnectResult>("/api/amocrm/connect", { method: "POST" });
}

/** Completes the OAuth exchange — called once, by the callback page,
 * with the `code`/`state`/`referer` amoCRM put on its redirect URL. */
export function completeAmoCRMConnect(input: { code: string; state: string; referer: string }) {
  return apiFetch<AmoCRMIntegration>("/api/amocrm/callback", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function disconnectAmoCRM() {
  return apiFetch<{ disconnected: boolean }>("/api/integrations/amocrm/disconnect", {
    method: "POST",
  });
}

/** Pushes one customer to amoCRM as a contact — see backend
 * amocrm.SyncUseCase.SyncCustomer's doc comment for scope. */
export function syncCustomerToAmoCRM(conversationId: string) {
  return apiFetch<AmoCRMSyncResult>(`/api/customers/${encodeURIComponent(conversationId)}/amocrm-sync`, {
    method: "POST",
  });
}
