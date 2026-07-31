import { useInfiniteQuery } from "@tanstack/react-query";

import { listMessages } from "../api/conversations.api";

/** Messages come back newest-first per page (same convention as
 * conversations). "Load older" = fetchNextPage. See message-thread.tsx
 * for how pages get flattened/reversed into chronological order for
 * display. */
export function useMessages(conversationId: string) {
  return useInfiniteQuery({
    queryKey: ["conversations", conversationId, "messages"],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      listMessages(conversationId, { cursor: pageParam, limit: 50 }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.length === 0) return undefined;
      return lastPage[lastPage.length - 1].created_at;
    },
    refetchInterval: 10_000,
  });
}
