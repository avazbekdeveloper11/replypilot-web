import { useQuery } from "@tanstack/react-query";

import { getOrganization } from "../api/settings.api";

export const organizationQueryKey = ["settings", "organization"] as const;

export function useOrganization() {
  return useQuery({
    queryKey: organizationQueryKey,
    queryFn: getOrganization,
    staleTime: 60_000,
  });
}
