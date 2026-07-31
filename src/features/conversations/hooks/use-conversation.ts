import { useQuery } from "@tanstack/react-query";

import { getConversation } from "../api/conversations.api";

export function useConversation(id: string) {
  return useQuery({
    queryKey: ["conversations", "detail", id],
    queryFn: () => getConversation(id),
    refetchInterval: 15_000,
  });
}
