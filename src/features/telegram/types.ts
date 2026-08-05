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
}
