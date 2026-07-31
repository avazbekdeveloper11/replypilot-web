import { useQuery } from "@tanstack/react-query";

import { getRecentConversations } from "../api/dashboard.api";

export function useRecentConversations(limit = 5) {
  return useQuery({
    queryKey: ["dashboard", "recent-conversations", limit],
    queryFn: () => getRecentConversations(limit),
    refetchInterval: 30_000,
  });
}
