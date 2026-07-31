import { useMutation } from "@tanstack/react-query";

import { createPortalSession } from "../api/billing.api";

/** Redirects to Stripe's hosted Billing Portal — payment method, invoice
 * history, and cancellation all live there, not in this app. */
export function useBillingPortal() {
  return useMutation({
    mutationFn: createPortalSession,
    onSuccess: (data) => {
      window.location.href = data.url;
    },
  });
}
