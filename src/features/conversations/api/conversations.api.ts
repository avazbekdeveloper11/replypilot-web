import { apiFetch } from "@/lib/api/client";
import type { Conversation, ConversationStatus, Message } from "../types";

export function listConversations(params: {
  status?: ConversationStatus;
  search?: string;
  cursor?: string;
  limit?: number;
}) {
  const qs = new URLSearchParams();
  if (params.status) qs.set("status", params.status);
  if (params.search) qs.set("search", params.search);
  if (params.cursor) qs.set("cursor", params.cursor);
  if (params.limit) qs.set("limit", String(params.limit));
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return apiFetch<Conversation[]>(`/api/conversations${suffix}`);
}

export function getConversation(id: string) {
  return apiFetch<Conversation>(`/api/conversations/${id}`);
}

export function listMessages(id: string, params: { cursor?: string; limit?: number }) {
  const qs = new URLSearchParams();
  if (params.cursor) qs.set("cursor", params.cursor);
  if (params.limit) qs.set("limit", String(params.limit));
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return apiFetch<Message[]>(`/api/conversations/${id}/messages${suffix}`);
}

/** Only valid from status=pending_human — see the backend usecase's doc
 * comment on TakeOver. Used by the AI Inbox. */
export function takeOverConversation(id: string) {
  return apiFetch<Conversation>(`/api/conversations/${id}/take-over`, { method: "PATCH" });
}

/** Only valid from status=human_active or pending_human — see the backend
 * usecase's doc comment on Resolve. */
export function resolveConversation(id: string) {
  return apiFetch<Conversation>(`/api/conversations/${id}/resolve`, { method: "PATCH" });
}

/** A human agent's reply — only valid once the conversation is
 * human_active (take over first, see takeOverConversation above). See
 * the backend usecase's doc comment on SendMessage. */
export function sendMessage(id: string, content: string) {
  return apiFetch<Message>(`/api/conversations/${id}/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

/** Generates (or regenerates — always overwrites) an AI summary of this
 * conversation. On-demand only, valid from any status. See the backend
 * usecase's doc comment on Summarize. */
export function summarizeConversation(id: string) {
  return apiFetch<Conversation>(`/api/conversations/${id}/summary`, { method: "POST" });
}
