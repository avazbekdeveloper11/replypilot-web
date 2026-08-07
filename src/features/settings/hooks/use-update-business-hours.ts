import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateBusinessHours } from "../api/settings.api";
import { organizationQueryKey } from "./use-organization";

/** Writes into the same "settings/organization" cache entry
 * useOrganization reads — business hours are just more fields on the
 * same Organization object, not a separate resource. */
export function useUpdateBusinessHours() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBusinessHours,
    onSuccess: (org) => {
      queryClient.setQueryData(organizationQueryKey, org);
    },
  });
}
