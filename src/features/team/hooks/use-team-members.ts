import { useQuery } from "@tanstack/react-query";

import { listTeamMembers } from "../api/team.api";

export const teamMembersQueryKey = ["team", "members"] as const;

export function useTeamMembers() {
  return useQuery({
    queryKey: teamMembersQueryKey,
    queryFn: listTeamMembers,
  });
}
