import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateMemberRole } from "../api/team.api";
import { teamMembersQueryKey } from "./use-team-members";

export function useUpdateMemberRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMemberRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamMembersQueryKey });
    },
  });
}
