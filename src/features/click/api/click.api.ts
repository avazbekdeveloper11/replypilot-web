import { apiFetch } from "@/lib/api/client";
import type { ClickIntegration } from "../types";

/** Resolves to `undefined` when Click has never been connected — the
 * backend returns 200 with data omitted (see ClickHandler.Get's doc
 * comment), not a 404. The settings card treats that as "show the connect
 * form". */
export function getClickIntegration() {
  return apiFetch<ClickIntegration | undefined>("/api/integrations/click");
}

export interface ConnectClickInput {
  merchant_id: string;
  service_id: string;
  merchant_user_id?: string | null;
}

export function connectClick(input: ConnectClickInput) {
  return apiFetch<ClickIntegration>("/api/integrations/click/connect", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function disconnectClick() {
  return apiFetch<{ disconnected: boolean }>("/api/integrations/click/disconnect", {
    method: "POST",
  });
}
