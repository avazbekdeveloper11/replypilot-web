import { useMutation } from "@tanstack/react-query";

import { listOrganizationsByEmail } from "../api/auth.api";

/**
 * A mutation, not a query, even though this is a GET under the hood —
 * it's explicitly triggered by the user clicking "Continue" on the email
 * step, not something that should auto-fetch on every keystroke or
 * re-fetch on window focus. useQuery's caching semantics don't fit a
 * one-shot discovery step like this.
 */
export function useOrganizationsByEmail() {
  return useMutation({
    mutationFn: (email: string) => listOrganizationsByEmail(email),
  });
}
