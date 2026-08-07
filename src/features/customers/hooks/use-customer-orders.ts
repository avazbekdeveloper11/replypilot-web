import { useQuery } from "@tanstack/react-query";

import { getCustomerOrders } from "../api/customers.api";

/** Only fetches once a conversation is actually selected (the drill-down
 * panel is opened) — `enabled` gates it so switching customers doesn't
 * fire N requests for every row rendered in the list. */
export function useCustomerOrders(conversationId: string | null) {
  return useQuery({
    queryKey: ["customers", "orders", conversationId],
    queryFn: () => getCustomerOrders(conversationId as string),
    enabled: conversationId !== null,
  });
}
