import { useMutation, useQueryClient } from "@tanstack/react-query";

import { summarizeConversation } from "../api/conversations.api";

export function useSummarizeConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: summarizeConversation,
    onSuccess: (conversation, id) => {
      // Same targeted invalidation as use-take-over-conversation.ts — only
      // this conversation's own detail query needs the fresh ai_summary,
      // the list view doesn't show it.
      queryClient.setQueryData(["conversations", "detail", id], conversation);
    },
  });
}
