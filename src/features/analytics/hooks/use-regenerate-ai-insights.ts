import { useMutation, useQueryClient } from "@tanstack/react-query";

import { regenerateAIInsights } from "../api/analytics.api";
import { aiInsightsQueryKey } from "./use-ai-insights";

export function useRegenerateAIInsights() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: regenerateAIInsights,
    onSuccess: (insights) => {
      queryClient.setQueryData(aiInsightsQueryKey, insights);
    },
  });
}
