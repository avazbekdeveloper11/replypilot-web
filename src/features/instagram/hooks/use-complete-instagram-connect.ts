import { useMutation, useQueryClient } from "@tanstack/react-query";

import { completeInstagramConnect } from "../api/instagram.api";
import { instagramAccountsQueryKey } from "./use-instagram-accounts";

export function useCompleteInstagramConnect() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: completeInstagramConnect,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: instagramAccountsQueryKey });
    },
  });
}
