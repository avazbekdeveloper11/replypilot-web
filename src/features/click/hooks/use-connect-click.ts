import { useMutation, useQueryClient } from "@tanstack/react-query";

import { connectClick } from "../api/click.api";
import { clickIntegrationQueryKey } from "./use-click-integration";

export function useConnectClick() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: connectClick,
    onSuccess: (integration) => {
      queryClient.setQueryData(clickIntegrationQueryKey, integration);
    },
  });
}
