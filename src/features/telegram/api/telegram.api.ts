import { apiFetch } from "@/lib/api/client";
import type { TelegramAccount, TelegramNotifyCodeResult } from "../types";

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

export function generateTelegramNotifyCode(id: string) {
  return apiFetch<TelegramNotifyCodeResult>(`/api/telegram/accounts/${id}/notify-code`, {
    method: "POST",
  });
}

export function updateTelegramNotifySettings(
  id: string,
  settings: { notify_on_lead: boolean; notify_on_payment: boolean },
) {
  return apiFetch<TelegramAccount>(`/api/telegram/accounts/${id}/notify-settings`, {
    method: "PATCH",
    body: JSON.stringify(settings),
  });
}
