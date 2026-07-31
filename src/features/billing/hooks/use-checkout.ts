import { useMutation } from "@tanstack/react-query";

import { createCheckoutSession } from "../api/billing.api";

/** Redirects the browser to Stripe's hosted Checkout on success — there is
 * no in-app payment form (see usecase/billing's package doc comment). */
export function useCheckout() {
  return useMutation({
    mutationFn: createCheckoutSession,
    onSuccess: (data) => {
      window.location.href = data.url;
    },
  });
}
