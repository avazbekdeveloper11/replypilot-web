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
export type MessageType =
  | "text"
  | "image"
  | "video"
  | "audio"
  | "file"
  | "quick_reply"
  | "story_reply"
  | "story_mention"
  | "unsupported";

export interface Message {
  id: string;
  direction: MessageDirection;
  sender_type: MessageSenderType;
  message_type: MessageType;
  content?: string;
  /** Absent even for an image/video/audio/file message when the backend
   * withheld it — see toMessageResponse's doc comment on the backend
   * (currently only Telegram voice/photo/video attachments, whose
   * resolved URL would otherwise leak the org's bot token). MessageBubble
   * falls back to a plain label from message_type in that case. */
  attachment_url?: string;
  created_at: string;
}
