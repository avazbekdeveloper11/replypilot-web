import { useQuery } from "@tanstack/react-query";

import { listCustomers } from "../api/customers.api";
import type { RFMSegment } from "../types";

export function useCustomers(search: string, segment?: RFMSegment) {
  return useQuery({
    queryKey: ["customers", "list", search, segment ?? "all"],
    queryFn: () => listCustomers(search || undefined, segment),
  });
}
