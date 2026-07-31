import { useMutation, useQueryClient } from "@tanstack/react-query";

import { logout } from "../api/profile.api";

/**
 * Clears every cached query on success — a new session (a different
 * user, possibly a different org) shouldn't ever see stale data left
 * behind from the one that just ended.
 */
export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
