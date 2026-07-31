import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateOrganization } from "../api/settings.api";
import { organizationQueryKey } from "./use-organization";

export function useUpdateOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateOrganization,
    onSuccess: (org) => {
      queryClient.setQueryData(organizationQueryKey, org);
    },
  });
}
