import { useQuery } from "@tanstack/react-query";

import { listOrganizations } from "../api/admin.api";

export const adminOrganizationsQueryKey = ["admin", "organizations"] as const;

export function useAdminOrganizations() {
  return useQuery({
    queryKey: adminOrganizationsQueryKey,
    queryFn: listOrganizations,
  });
}
