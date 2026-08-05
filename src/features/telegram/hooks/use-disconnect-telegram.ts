import { useMutation, useQueryClient } from "@tanstack/react-query";
import { disconnectTelegram } from "../api/telegram.api";
import { telegramAccountsQueryKey } from "./use-telegram-accounts";

export function useDisconnectTelegram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: disconnectTelegram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: telegramAccountsQueryKey });
    },
  });
}
