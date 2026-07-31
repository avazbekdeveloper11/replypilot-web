import { useQuery } from "@tanstack/react-query";

import { getSubscription } from "../api/billing.api";

export function useSubscription() {
  return useQuery({
    queryKey: ["billing", "subscription"],
    queryFn: getSubscription,
  });
}
