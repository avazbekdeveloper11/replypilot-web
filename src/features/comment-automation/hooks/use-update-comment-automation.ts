import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateCommentAutomation } from "../api/comment-automation.api";
import { commentAutomationQueryKey } from "./use-comment-automation";

export function useUpdateCommentAutomation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCommentAutomation,
    onSuccess: (settings) => {
      queryClient.setQueryData(commentAutomationQueryKey, settings);
    },
  });
}
