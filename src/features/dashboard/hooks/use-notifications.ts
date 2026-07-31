import { useQuery } from "@tanstack/react-query";

import { getNotifications } from "../api/dashboard.api";

export function useNotifications(limit = 10) {
  return useQuery({
    queryKey: ["dashboard", "notifications", limit],
    queryFn: () => getNotifications(limit),
    refetchInterval: 30_000,
  });
}
