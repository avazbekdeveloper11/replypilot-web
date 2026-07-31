/** Mirrors ConversationResponse / MessageResponse
 * (backend/internal/delivery/http/v1/dto.go) exactly. */
export type ConversationStatus =
  | "ai_active"
  | "pending_human"
  | "human_active"
  | "resolved"
  | "closed";

export interface Conversation {
  id: string;
  status: ConversationStatus;
  customer_username?: string;
  last_message_preview?: string;
  last_message_at?: string;
  unread_count: number;
}

export type MessageDirection = "inbound" | "outbound";
export type MessageSenderType = "customer" | "ai" | "human" | "system";

export interface Message {
  id: string;
  direction: MessageDirection;
  sender_type: MessageSenderType;
  content?: string;
  created_at: string;
}
