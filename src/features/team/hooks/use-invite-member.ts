import { useMutation, useQueryClient } from "@tanstack/react-query";

import { inviteMember } from "../api/team.api";
import { teamMembersQueryKey } from "./use-team-members";

export function useInviteMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inviteMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamMembersQueryKey });
    },
  });
}
