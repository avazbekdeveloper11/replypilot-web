/** Mirrors backend/internal/delivery/http/v1/dto.go's Response
 * TimePoint / AIUsagePoint / ConversationOutcomesResponse exactly. */
export interface ResponseTimePoint {
  date: string;
  avg_seconds?: number;
}

export interface AIUsagePoint {
  date: string;
  response_count: number;
  total_tokens: number;
  avg_confidence?: number;
}

export interface ConversationOutcomes {
  ai_active: number;
  pending_human: number;
  human_active: number;
  resolved: number;
  closed: number;
}

/** Mirrors AIInsightsResponse. sales_count/sales_amount_cents/lead_count/
 * conversation_count are real numbers as of generated_at, not live — see
 * entity.AIInsights' doc comment on the backend. */
export interface AIInsights {
  summary: string;
  sales_count: number;
  sales_amount_cents: number;
  lead_count: number;
  conversation_count: number;
  generated_at: string;
}
