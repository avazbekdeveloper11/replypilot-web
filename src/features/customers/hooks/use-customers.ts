import { useQuery } from "@tanstack/react-query";

import { listCustomers } from "../api/customers.api";

export function useCustomers(search: string) {
  return useQuery({
    queryKey: ["customers", "list", search],
    queryFn: () => listCustomers(search || undefined),
  });
}
