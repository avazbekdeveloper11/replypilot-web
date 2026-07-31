import { useQuery } from "@tanstack/react-query";

import { getAIPerformance } from "../api/dashboard.api";

export function useAIPerformance() {
  return useQuery({
    queryKey: ["dashboard", "ai-performance"],
    queryFn: getAIPerformance,
    refetchInterval: 60_000,
  });
}
