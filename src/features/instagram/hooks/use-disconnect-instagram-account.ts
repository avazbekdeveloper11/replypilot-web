import { useMutation, useQueryClient } from "@tanstack/react-query";

import { disconnectInstagramAccount } from "../api/instagram.api";
import { instagramAccountsQueryKey } from "./use-instagram-accounts";

export function useDisconnectInstagramAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: disconnectInstagramAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: instagramAccountsQueryKey });
    },
  });
}
