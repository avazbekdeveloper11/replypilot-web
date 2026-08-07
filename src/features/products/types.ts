/** Mirrors backend/internal/delivery/http/v1/dto.go's ProductResponse
 * exactly, same convention as every other features/*\/types.ts.
 * PriceCents stays in the smallest currency unit (tiyin) here too — the UI
 * converts to/from whole so'm only at the form boundary, see
 * lib/format.ts's formatPriceCents and schemas/product.schema.ts.
 *
 * price_cents is nullable: null means "price on request" — a product
 * listed with no fixed price. See backend entity.Product's doc comment. */
export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price_cents: number | null;
  currency: string;
  is_active: boolean;
  created_at: string;
}
