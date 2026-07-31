import { useMutation, useQueryClient } from "@tanstack/react-query";

import { reactivateOrganization } from "../api/admin.api";
import { adminOrganizationsQueryKey } from "./use-organizations";

export function useReactivateOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reactivateOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminOrganizationsQueryKey });
    },
  });
}
