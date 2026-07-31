import { useMutation } from "@tanstack/react-query";

import { startInstagramConnect } from "../api/instagram.api";

/**
 * Kicks off the OAuth flow. The caller is responsible for the actual
 * navigation (`window.location.href = data.authorization_url`) — this
 * hook only does the fetch, since a full-page redirect can't happen
 * inside onSuccess in a way that's testable/composable.
 */
export function useConnectInstagram() {
  return useMutation({
    mutationFn: startInstagramConnect,
  });
}
