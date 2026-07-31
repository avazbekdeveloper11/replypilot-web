import { useQuery } from "@tanstack/react-query";

import { getDashboardTimeSeries } from "../api/dashboard.api";

export function useConversationsTimeSeries(days = 7) {
  return useQuery({
    queryKey: ["dashboard", "timeseries", days],
    queryFn: () => getDashboardTimeSeries(days),
    refetchInterval: 60_000,
  });
}
