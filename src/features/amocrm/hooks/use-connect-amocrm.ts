import { useMutation } from "@tanstack/react-query";

import { startAmoCRMConnect } from "../api/amocrm.api";

/**
 * Kicks off the OAuth flow. The caller is responsible for the actual
 * navigation (`window.location.href = data.authorization_url`) — same
 * "hook only does the fetch" split as useConnectInstagram, since a
 * full-page redirect can't happen inside onSuccess in a way that's
 * testable/composable.
 */
export function useConnectAmoCRM() {
  return useMutation({
    mutationFn: startAmoCRMConnect,
  });
}
