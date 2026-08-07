import { apiFetch } from "@/lib/api/client";
import type { CustomerOrder, CustomerSummary, RFMSegment } from "../types";

export function listCustomers(search?: string, segment?: RFMSegment) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (segment) params.set("segment", segment);
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiFetch<CustomerSummary[]>(`/api/customers${query}`);
}

export function getCustomerOrders(conversationId: string) {
  return apiFetch<CustomerOrder[]>(
    `/api/customers/${encodeURIComponent(conversationId)}/orders`,
  );
}
