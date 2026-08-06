import { useQuery } from "@tanstack/react-query";

import { getAIInsights } from "../api/analytics.api";

export const aiInsightsQueryKey = ["analytics", "ai-insights"] as const;

export function useAIInsights() {
  return useQuery({
    queryKey: aiInsightsQueryKey,
    queryFn: getAIInsights,
  });
}
