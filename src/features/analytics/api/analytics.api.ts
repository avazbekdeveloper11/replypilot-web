import { apiFetch } from "@/lib/api/client";
import type { AIInsights, AIUsagePoint, ConversationOutcomes, ResponseTimePoint } from "../types";

export function getResponseTime(days = 14) {
  return apiFetch<ResponseTimePoint[]>(`/api/analytics/response-time?days=${days}`);
}

export function getAIUsage(days = 14) {
  return apiFetch<AIUsagePoint[]>(`/api/analytics/ai-usage?days=${days}`);
}

export function getConversationOutcomes() {
  return apiFetch<ConversationOutcomes>("/api/analytics/conversation-outcomes");
}

/** Resolves to `undefined` when insights have never been generated — the
 * backend returns 200 with data omitted, not a 404 (same convention as
 * getClickIntegration). The panel treats that as "show a generate
 * button". */
export function getAIInsights() {
  return apiFetch<AIInsights | undefined>("/api/analytics/ai-insights");
}

export function regenerateAIInsights() {
  return apiFetch<AIInsights>("/api/analytics/ai-insights/regenerate", { method: "POST" });
}
