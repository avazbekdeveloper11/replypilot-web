import { useMutation, useQueryClient } from "@tanstack/react-query";

import { sendMessage } from "../api/conversations.api";

/** Sends a human agent's reply — see conversations.api.ts's sendMessage
 * doc comment on why this only succeeds once the conversation is
 * human_active. On success, invalidates this conversation's message
 * thread (so the new message appears immediately instead of waiting for
 * useMessages' 10s poll) and its list/detail entries (last_message_preview
 * and unread_count both changed server-side). */
export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => sendMessage(conversationId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations", conversationId, "messages"] });
      queryClient.invalidateQueries({ queryKey: ["conversations", "list"] });
      queryClient.invalidateQueries({ queryKey: ["conversations", "detail", conversationId] });
    },
  });
}
