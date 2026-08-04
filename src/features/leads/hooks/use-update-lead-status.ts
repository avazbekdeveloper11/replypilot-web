import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateLeadStatus } from "../api/leads.api";

export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateLeadStatus,
    onSuccess: () => {
      // Every status filter's list needs to reflect the move (e.g. out of
      // "new" and into "contacted") — same invalidate-everything-under-the-
      // key approach as conversations.
      queryClient.invalidateQueries({ queryKey: ["leads", "list"] });
    },
  });
}
