/**
 * Mirrors backend/internal/delivery/http/v1/dto.go's Dashboard* response
 * shapes exactly, same convention as src/features/auth/types.ts.
 *
 * Two of these are deliberately "real but empty by construction" today —
 * read the field comments before assuming a 0/null means the query is
 * broken:
 * - AIPerformanceStats: this codebase has no AI reply pipeline
 *   implemented yet, so total_responses is 0 and everything else null
 *   until it exists (docs/DASHBOARD_MILESTONE.md).
 * - DashboardStats.avg_first_response_seconds: null (not 0) means no
 *   conversation in the trailing 30 days has both an inbound message and
 *   a subsequent outbound reply yet.
 */
export interface DashboardStats {
  total_conversations: number;
  ai_active_conversations: number;
  pending_human_conversations: number;
  human_active_conversations: number;
  resolved_conversations: number;
  closed_conversations: number;
  unread_conversations: number;
  messages_today: number;
  connected_instagram_accounts: number;
  avg_first_response_seconds: number | null;
}

export interface DashboardTimeSeriesPoint {
  date: string; // YYYY-MM-DD, UTC
  count: number;
}

export interface AIPerformanceStats {
  total_responses: number;
  avg_confidence: number | null; // 0-1
  avg_latency_ms: number | null;
  handoff_rate: number | null; // 0-1
}

/**
 * An unread conversation surfaced as a notification item — see the doc
 * comment on the backend's dashboard usecase Notifications method for why
 * this isn't backed by a dedicated notifications feed.
 */
export interface DashboardNotification {
  conversation_id: string;
  customer_username?: string;
  preview?: string;
  unread_count: number;
  last_message_at?: string;
}

/** Mirrors ConversationResponse (backend/internal/delivery/http/v1/dto.go). */
export interface ConversationSummary {
  id: string;
  status: string;
  customer_username?: string;
  last_message_preview?: string;
  last_message_at?: string;
  unread_count: number;
}
