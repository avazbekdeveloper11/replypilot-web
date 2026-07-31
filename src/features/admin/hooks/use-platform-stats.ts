import { useQuery } from "@tanstack/react-query";

import { getPlatformStats } from "../api/admin.api";

export function usePlatformStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: getPlatformStats,
  });
}
