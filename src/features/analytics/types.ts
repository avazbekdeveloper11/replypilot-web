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
