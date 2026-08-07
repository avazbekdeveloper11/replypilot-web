import { apiFetch } from "@/lib/api/client";
import type { CustomerOrder, CustomerSummary } from "../types";

export function listCustomers(search?: string) {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  return apiFetch<CustomerSummary[]>(`/api/customers${query}`);
}

export function getCustomerOrders(conversationId: string) {
  return apiFetch<CustomerOrder[]>(
    `/api/customers/${encodeURIComponent(conversationId)}/orders`,
  );
}
