/** Mirrors backend/internal/delivery/http/v1/dto.go's TelegramAccountResponse
 * exactly. bot_username is only for display — never anything secret; the
 * bot token itself is never sent back down to the frontend after connect. */
export interface TelegramAccount {
  id: string;
  bot_username?: string | null;
  status: string;
  /** Whether the org has finished pairing this bot inside their own
   * Telegram app yet — see entity.TelegramAccount.BusinessConnectionID's
   * doc comment on the backend. false means the token is saved and the
   * webhook is registered, but no messages will arrive until pairing is
   * done on Telegram's side. */
  paired: boolean;
  /** Whether an admin has bound their own chat via the verification-code
   * handshake (entity.TelegramAccount.NotifyChatID != nil on the backend) —
   * independent of `paired`, since admin notifications work even without
   * Business Bot pairing. See TelegramNotifyCodeResult and
   * use-generate-notify-code.ts. */
  notify_verified: boolean;
  notify_on_lead: boolean;
  notify_on_payment: boolean;
}

/** Mirrors TelegramNotifyCodeResponse on the backend — returned by
 * generating/regenerating a verification code. */
export interface TelegramNotifyCodeResult {
  code: string;
}
