/**
 * Mirrors backend/internal/delivery/http/v1/dto.go's Dashboard* response
 * shapes exactly, same convention as src/features/auth/types.ts.
 *
 * One of these is easy to misread as "the query is broken" when it's just
 * an org with no data yet:
 * - AIPerformanceStats: total_responses is 0 (and everything else null)
 *   for an org the AI pipeline hasn't replied for yet, not because the
 *   pipeline doesn't exist — see usecase/ai.UseCase, which writes a row
 *   to ai_responses on every AI-generated reply.
 * - DashboardStats.avg_first_response_seconds: null (not 0) means no
 *   conversation in the trailing 30 days has both an inbound message and
 *   a subsequent outbound reply yet. Kept in the API/type for now, but no
 *   longer rendered on the Dashboard page directly — it's dragged up by
 *   conversations waiting on a human handoff, so it doesn't fairly
 *   represent AI speed; see AiWorkingTimeCard for what replaced it. The
 *   Analytics page's response-time chart is unrelated (its own endpoint).
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
  /** Sum (not average) of every response's latency — total AI working
   * time, all-time. Shown on the Dashboard instead of avg-first-response
   * time, which human handoffs drag up and so misrepresents AI speed. */
  total_latency_ms: number | null;
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
