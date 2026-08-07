import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTelegramNotifySettings } from "../api/telegram.api";
import { telegramAccountsQueryKey } from "./use-telegram-accounts";

export function useUpdateNotifySettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      notifyOnLead,
      notifyOnPayment,
    }: {
      id: string;
      notifyOnLead: boolean;
      notifyOnPayment: boolean;
    }) => updateTelegramNotifySettings(id, { notify_on_lead: notifyOnLead, notify_on_payment: notifyOnPayment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: telegramAccountsQueryKey });
    },
  });
}
