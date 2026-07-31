import { apiFetch } from "@/lib/api/client";
import type { AIUsagePoint, ConversationOutcomes, ResponseTimePoint } from "../types";

export function getResponseTime(days = 14) {
  return apiFetch<ResponseTimePoint[]>(`/api/analytics/response-time?days=${days}`);
}

export function getAIUsage(days = 14) {
  return apiFetch<AIUsagePoint[]>(`/api/analytics/ai-usage?days=${days}`);
}

export function getConversationOutcomes() {
  return apiFetch<ConversationOutcomes>("/api/analytics/conversation-outcomes");
}
