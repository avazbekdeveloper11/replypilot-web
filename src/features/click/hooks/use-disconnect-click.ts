import { useMutation, useQueryClient } from "@tanstack/react-query";

import { disconnectClick } from "../api/click.api";
import { clickIntegrationQueryKey } from "./use-click-integration";

export function useDisconnectClick() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: disconnectClick,
    onSuccess: () => {
      queryClient.setQueryData(clickIntegrationQueryKey, undefined);
    },
  });
}
