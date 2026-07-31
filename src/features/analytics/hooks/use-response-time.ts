import { useQuery } from "@tanstack/react-query";

import { getResponseTime } from "../api/analytics.api";

export function useResponseTime(days = 14) {
  return useQuery({
    queryKey: ["analytics", "response-time", days],
    queryFn: () => getResponseTime(days),
  });
}
