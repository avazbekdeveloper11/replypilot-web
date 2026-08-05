import { useQuery } from "@tanstack/react-query";
import { listTelegramAccounts } from "../api/telegram.api";

export const telegramAccountsQueryKey = ["telegram", "accounts"] as const;

/** One bot per organization for now — see telegram.ConnectUseCase.Connect's
 * doc comment on the backend. The card reads accounts[0] as "the"
 * connection rather than rendering a list. */
export function useTelegramAccounts() {
  return useQuery({ queryKey: telegramAccountsQueryKey, queryFn: listTelegramAccounts });
}
