import { useQuery } from "@tanstack/react-query";
import { listTelegramAccounts } from "../api/telegram.api";

export const telegramAccountsQueryKey = ["telegram", "accounts"] as const;

/** One bot per organization for now — see telegram.ConnectUseCase.Connect's
 * doc comment on the backend. The card reads accounts[0] as "the"
 * connection rather than rendering a list.
 *
 * refetchIntervalMs, when set, is used by NotifyCodePanel (in
 * telegram-integration-card.tsx) while a verification code is on screen —
 * there's no push channel telling the frontend the admin just sent their
 * code to the bot, so a short poll is how notify_verified flipping to true
 * gets noticed and the panel auto-closes. */
export function useTelegramAccounts(refetchIntervalMs?: number) {
  return useQuery({
    queryKey: telegramAccountsQueryKey,
    queryFn: listTelegramAccounts,
    refetchInterval: refetchIntervalMs,
  });
}
