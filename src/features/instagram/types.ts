/**
 * Mirrors backend/internal/delivery/http/v1/dto.go's Instagram* response
 * shapes exactly.
 */
export interface InstagramAccount {
  id: string;
  username?: string | null;
  /** connected | expired | revoked | error — see entity.InstagramAccountStatus. */
  status: string;
}

export interface InstagramConnectResult {
  authorization_url: string;
  state: string;
}
