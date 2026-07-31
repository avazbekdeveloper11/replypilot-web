import { useMutation, useQueryClient } from "@tanstack/react-query";

import { removeMember } from "../api/team.api";
import { teamMembersQueryKey } from "./use-team-members";

export function useRemoveMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamMembersQueryKey });
    },
  });
}
