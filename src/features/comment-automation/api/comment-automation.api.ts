import { apiFetch } from "@/lib/api/client";
import type { CommentAutomation } from "../types";

export function getCommentAutomation() {
  return apiFetch<CommentAutomation>("/api/integrations/comment-automation");
}

export interface UpdateCommentAutomationInput {
  enabled: boolean;
  public_reply_text?: string | null;
}

export function updateCommentAutomation(input: UpdateCommentAutomationInput) {
  return apiFetch<CommentAutomation>("/api/integrations/comment-automation", {
    method: "PUT",
    body: JSON.stringify(input),
  });
}
