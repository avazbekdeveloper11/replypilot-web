import { useMutation, useQueryClient } from "@tanstack/react-query";

import { suspendOrganization } from "../api/admin.api";
import { adminOrganizationsQueryKey } from "./use-organizations";

export function useSuspendOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: suspendOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminOrganizationsQueryKey });
    },
  });
}
