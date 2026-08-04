import { useMutation, useQueryClient } from "@tanstack/react-query";

import { resolveConversation } from "../api/conversations.api";

export function useResolveConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resolveConversation,
    onSuccess: (_conversation, id) => {
      // Same reasoning as useTakeOverConversation: invalidate every list
      // query (any status filter) plus this conversation's own detail
      // query, since both need to reflect the new resolved status.
      queryClient.invalidateQueries({ queryKey: ["conversations", "list"] });
      queryClient.invalidateQueries({ queryKey: ["conversations", "detail", id] });
    },
  });
}
