import { useMutation, useQueryClient } from "@tanstack/react-query";

import { takeOverConversation } from "../api/conversations.api";

export function useTakeOverConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: takeOverConversation,
    onSuccess: (_conversation, id) => {
      // Invalidates every conversations list query regardless of status
      // filter — the taken-over conversation needs to disappear from the
      // pending_human filter (AI Inbox) and reappear under human_active
      // (the main Conversations page) at the same time — plus this
      // conversation's own detail query, so a "Take over" button on the
      // Conversation Detail page (see conversation-detail-view.tsx) shows
      // the composer immediately instead of waiting for the next 15s poll.
      queryClient.invalidateQueries({ queryKey: ["conversations", "list"] });
      queryClient.invalidateQueries({ queryKey: ["conversations", "detail", id] });
    },
  });
}
