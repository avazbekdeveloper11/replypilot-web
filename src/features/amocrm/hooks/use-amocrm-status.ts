import { useQuery } from "@tanstack/react-query";

import { getAmoCRMStatus } from "../api/amocrm.api";

export const amocrmStatusQueryKey = ["integrations", "amocrm"] as const;

export function useAmoCRMStatus() {
  return useQuery({
    queryKey: amocrmStatusQueryKey,
    queryFn: getAmoCRMStatus,
  });
}
