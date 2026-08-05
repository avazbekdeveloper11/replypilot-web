import { apiFetch } from "@/lib/api/client";
import type { TelegramAccount } from "../types";

export function listTelegramAccounts() {
  return apiFetch<TelegramAccount[]>("/api/telegram/accounts");
}

export function connectTelegram(botToken: string) {
  return apiFetch<TelegramAccount>("/api/telegram/connect", {
    method: "POST",
    body: JSON.stringify({ bot_token: botToken }),
  });
}

export function disconnectTelegram(id: string) {
  return apiFetch<{ disconnected: boolean }>(`/api/telegram/accounts/${id}`, {
    method: "DELETE",
  });
}
