import { apiFetch } from "@/lib/api/client";
import type {
  AIPerformanceStats,
  ConversationSummary,
  DashboardNotification,
  DashboardStats,
  DashboardTimeSeriesPoint,
} from "../types";

export function getDashboardStats() {
  return apiFetch<DashboardStats>("/api/dashboard/stats");
}

export function getDashboardTimeSeries(days = 7) {
  return apiFetch<DashboardTimeSeriesPoint[]>(
    `/api/dashboard/timeseries?days=${encodeURIComponent(days)}`,
  );
}

export function getAIPerformance() {
  return apiFetch<AIPerformanceStats>("/api/dashboard/ai-performance");
}

export function getNotifications(limit = 10) {
  return apiFetch<DashboardNotification[]>(
    `/api/dashboard/notifications?limit=${encodeURIComponent(limit)}`,
  );
}

/** Recent Conversations widget — reuses the same GET /v1/conversations
 * the (not-yet-built) Conversations page will use, just capped to a small
 * limit. See app/api/conversations/route.ts. */
export function getRecentConversations(limit = 5) {
  return apiFetch<ConversationSummary[]>(
    `/api/conversations?limit=${encodeURIComponent(limit)}`,
  );
}
