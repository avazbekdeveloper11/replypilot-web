import { useQuery } from "@tanstack/react-query";

import { listPlans } from "../api/billing.api";

export function usePlans() {
  return useQuery({
    queryKey: ["billing", "plans"],
    queryFn: listPlans,
  });
}
