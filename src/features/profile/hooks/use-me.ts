import { useQuery } from "@tanstack/react-query";

import { getMe } from "../api/profile.api";

export const meQueryKey = ["profile", "me"] as const;

/**
 * The one place the app reads "who is logged in" client-side — Topbar's
 * user menu, the Profile page's edit form, and anything else that needs
 * the current user's name/email/avatar all share this cached query
 * instead of each re-fetching or re-deriving it from the JWT.
 */
export function useMe() {
  return useQuery({
    queryKey: meQueryKey,
    queryFn: getMe,
    staleTime: 60_000,
  });
}
