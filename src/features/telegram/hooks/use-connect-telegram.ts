import { useMutation, useQueryClient } from "@tanstack/react-query";
import { connectTelegram } from "../api/telegram.api";
import { telegramAccountsQueryKey } from "./use-telegram-accounts";

export function useConnectTelegram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: connectTelegram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: telegramAccountsQueryKey });
    },
  });
}
