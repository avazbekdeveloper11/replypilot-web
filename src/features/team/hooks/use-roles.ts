import { useQuery } from "@tanstack/react-query";

import { listAssignableRoles } from "../api/team.api";

export function useRoles() {
  return useQuery({
    queryKey: ["team", "roles"],
    queryFn: listAssignableRoles,
    staleTime: 5 * 60_000, // the four system roles change essentially never
  });
}
