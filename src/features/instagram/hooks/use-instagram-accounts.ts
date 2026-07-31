import { useQuery } from "@tanstack/react-query";

import { listInstagramAccounts } from "../api/instagram.api";

export const instagramAccountsQueryKey = ["instagram", "accounts"] as const;

export function useInstagramAccounts() {
  return useQuery({
    queryKey: instagramAccountsQueryKey,
    queryFn: listInstagramAccounts,
  });
}
