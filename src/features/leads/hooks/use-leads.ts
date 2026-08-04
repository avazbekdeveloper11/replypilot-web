import { useQuery } from "@tanstack/react-query";

import { listLeads } from "../api/leads.api";
import type { LeadStatus } from "../types";

export function leadsQueryKey(status?: LeadStatus) {
  return ["leads", "list", status ?? "all"] as const;
}

export function useLeads(status?: LeadStatus) {
  return useQuery({
    queryKey: leadsQueryKey(status),
    queryFn: () => listLeads(status),
    // New leads arrive from live customer DMs, not a user action on this
    // page — same short-poll convention as useConversation's detail
    // query, so a lead captured while this page is open shows up on its
    // own.
    refetchInterval: 15_000,
  });
}
