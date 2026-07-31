import { useQuery } from "@tanstack/react-query";

import { getDashboardStats } from "../api/dashboard.api";

/** Backs the Statistics Cards + Response Time widgets — one query, both
 * widgets, since the backend already bundles them into one round trip. */
export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: getDashboardStats,
    refetchInterval: 60_000,
  });
}
