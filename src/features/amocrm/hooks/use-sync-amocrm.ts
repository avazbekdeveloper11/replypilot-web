import { useMutation } from "@tanstack/react-query";

import { syncCustomerToAmoCRM } from "../api/amocrm.api";

/** No cache invalidation on success — syncing doesn't change anything
 * the customer list/drill-down itself reads (the customer database has
 * no "synced to amoCRM" column). The caller shows a one-off success/error
 * toast-equivalent instead. */
export function useSyncAmoCRM() {
  return useMutation({
    mutationFn: syncCustomerToAmoCRM,
  });
}
