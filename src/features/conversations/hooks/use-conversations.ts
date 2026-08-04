import { useInfiniteQuery } from "@tanstack/react-query";

import { listConversations } from "../api/conversations.api";
import type { ConversationStatus } from "../types";

/** Cursor pagination via useInfiniteQuery, not offset — matches the
 * backend's keyset design (no OFFSET endpoint exists). Each page's cursor
 * is the last_message_at of the last item in the previous page.
 *
 * `search` is included in the queryKey so switching it starts a fresh
 * cursor chain instead of appending to pages fetched under a different
 * filter — same reasoning as `status` below. Callers are expected to
 * debounce keystrokes before passing search in (see conversation-list.tsx)
 * so this doesn't refetch on every character. */
export function useConversations(status?: ConversationStatus, search?: string) {
  return useInfiniteQuery({
    queryKey: ["conversations", "list", status ?? "all", search ?? ""],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      listConversations({ status, search, cursor: pageParam, limit: 20 }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.length === 0) return undefined;
      return lastPage[lastPage.length - 1].last_message_at;
    },
    refetchInterval: 30_000,
  });
}
