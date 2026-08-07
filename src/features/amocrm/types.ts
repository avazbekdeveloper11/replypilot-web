/** Mirrors backend/internal/delivery/http/v1/dto.go's AmoCRM* response
 * shapes exactly. amoCRM is a single connection per org (unlike
 * Instagram's list-of-accounts), same "one row, not a list" shape as
 * the Click integration. */
export interface AmoCRMIntegration {
  subdomain: string;
  /** connected | expired | revoked | error — see entity.AmoCRMIntegrationStatus. */
  status: string;
  connected_at: string;
}

export interface AmoCRMConnectResult {
  authorization_url: string;
  state: string;
}

export interface AmoCRMSyncResult {
  amocrm_contact_id: number;
  synced_at: string;
}
