import { useMutation, useQueryClient } from "@tanstack/react-query";

import { takeOverConversation } from "../api/conversations.api";

export function useTakeOverConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: takeOverConversation,
    onSuccess: () => {
      // Invalidates every conversations list query regardless of status
      // filter — the taken-over conversation needs to disappear from the
      // pending_human filter (AI Inbox) and reappear under human_active
      // (the main Conversations page) at the same time.
      queryClient.invalidateQueries({ queryKey: ["conversations", "list"] });
    },
  });
}
