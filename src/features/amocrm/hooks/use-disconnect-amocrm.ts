import { useMutation, useQueryClient } from "@tanstack/react-query";

import { disconnectAmoCRM } from "../api/amocrm.api";
import { amocrmStatusQueryKey } from "./use-amocrm-status";

export function useDisconnectAmoCRM() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: disconnectAmoCRM,
    onSuccess: () => {
      queryClient.setQueryData(amocrmStatusQueryKey, null);
    },
  });
}
