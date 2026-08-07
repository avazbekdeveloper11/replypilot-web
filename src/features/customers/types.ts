/** Mirrors backend/internal/delivery/http/v1/dto.go's
 * CustomerSummaryResponse — one row of the customer database. A customer
 * with zero orders still appears here (total_paid_cents: 0), not just
 * ones who already bought — see the backend customer.UseCase.List doc
 * comment. */
export interface CustomerSummary {
  conversation_id: string;
  channel: "instagram" | "telegram";
  customer_username?: string;
  last_message_at?: string;
  total_paid_cents: number;
  paid_order_count: number;
  last_paid_at?: string;
}

/** Mirrors CustomerOrderResponse — one order in a customer's purchase
 * history drill-down. Every status is included (not just paid), so an
 * admin can see an attempted-but-failed purchase too. */
export interface CustomerOrder {
  id: string;
  product_name: string;
  amount_cents: number;
  currency: string;
  status: "pending" | "paid" | "failed" | "cancelled";
  paid_at?: string;
  created_at: string;
}
