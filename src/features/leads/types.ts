/** Mirrors backend/internal/delivery/http/v1/dto.go's LeadResponse
 * exactly. customer_username is joined in from the conversation on the
 * backend (see entity.Lead.CustomerUsername's doc comment), not stored on
 * the lead itself. */
export type LeadStatus = "new" | "contacted" | "done";

export interface Lead {
  id: string;
  conversation_id: string;
  customer_username?: string;
  phone: string;
  summary: string;
  status: LeadStatus;
  created_at: string;
}
