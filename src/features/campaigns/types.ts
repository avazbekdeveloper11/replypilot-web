/** Mirrors backend/internal/delivery/http/v1/dto.go's
 * CampaignRecipientResponse exactly. Eligible is always true for a
 * Telegram recipient; for Instagram it reflects Meta's 24-hour messaging
 * window at the moment the draft was generated — see the backend
 * campaign.UseCase package doc comment. */
export interface CampaignRecipient {
  conversation_id: string;
  customer_username?: string;
  channel: "instagram" | "telegram";
  last_customer_message_at: string;
  eligible: boolean;
  ineligible_reason?: string;
}

/** Mirrors CampaignDraftResponse. Message is pre-filled but editable —
 * POST /api/campaigns/send takes whatever the admin ends up with, not
 * necessarily this exact string. */
export interface CampaignDraft {
  message: string;
  min_days_since_last_message: number;
  max_days_since_last_message?: number;
  channel: "any" | "instagram" | "telegram";
  exclude_customers_who_paid: boolean;
  recipients: CampaignRecipient[];
  eligible_count: number;
  ineligible_count: number;
}

/** Mirrors CampaignSkippedResponse. */
export interface CampaignSkipped {
  conversation_id: string;
  reason: string;
}

/** Mirrors CampaignSendResponse. */
export interface CampaignSendResult {
  sent_count: number;
  skipped: CampaignSkipped[];
}
