/** Mirrors backend/internal/delivery/http/v1/dto.go's ClickIntegrationResponse
 * exactly. Never carries anything secret — merchant_id/service_id are
 * Click's own public identifiers, see entity.ClickIntegration's doc
 * comment on the backend. */
export interface ClickIntegration {
  merchant_id: string;
  service_id: string;
  merchant_user_id?: string | null;
  connected_at: string;
}
