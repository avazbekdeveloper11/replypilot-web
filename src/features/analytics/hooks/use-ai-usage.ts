import { useQuery } from "@tanstack/react-query";

import { getAIUsage } from "../api/analytics.api";

export function useAIUsage(days = 14) {
  return useQuery({
    queryKey: ["analytics", "ai-usage", days],
    queryFn: () => getAIUsage(days),
  });
}
