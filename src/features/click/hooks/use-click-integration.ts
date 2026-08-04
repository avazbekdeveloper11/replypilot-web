import { useQuery } from "@tanstack/react-query";

import { getClickIntegration } from "../api/click.api";

export const clickIntegrationQueryKey = ["integrations", "click"] as const;

export function useClickIntegration() {
  return useQuery({
    queryKey: clickIntegrationQueryKey,
    queryFn: getClickIntegration,
  });
}
