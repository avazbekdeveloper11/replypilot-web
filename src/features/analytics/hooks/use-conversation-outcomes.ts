import { useQuery } from "@tanstack/react-query";

import { getConversationOutcomes } from "../api/analytics.api";

export function useConversationOutcomes() {
  return useQuery({
    queryKey: ["analytics", "conversation-outcomes"],
    queryFn: getConversationOutcomes,
  });
}
