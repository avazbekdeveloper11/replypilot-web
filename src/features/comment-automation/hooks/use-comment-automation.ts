import { useQuery } from "@tanstack/react-query";

import { getCommentAutomation } from "../api/comment-automation.api";

export const commentAutomationQueryKey = ["integrations", "comment-automation"] as const;

export function useCommentAutomation() {
  return useQuery({
    queryKey: commentAutomationQueryKey,
    queryFn: getCommentAutomation,
  });
}
