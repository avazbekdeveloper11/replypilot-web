import { useMutation, useQueryClient } from "@tanstack/react-query";

import { completeAmoCRMConnect } from "../api/amocrm.api";
import { amocrmStatusQueryKey } from "./use-amocrm-status";

export function useCompleteAmoCRMConnect() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: completeAmoCRMConnect,
    onSuccess: (integration) => {
      queryClient.setQueryData(amocrmStatusQueryKey, integration);
    },
  });
}
