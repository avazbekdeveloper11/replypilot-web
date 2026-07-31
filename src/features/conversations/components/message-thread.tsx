"use client";

import * as React from "react";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/data/empty-state";
import { ErrorState } from "@/components/feedback/error-state";

import { useMessages } from "../hooks/use-messages";
import { MessageBubble } from "./message-bubble";

export function MessageThread({ conversationId }: { conversationId: string }) {
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMessages(conversationId);

  const bottomRef = React.useRef<HTMLDivElement>(null);
  const hasScrolledOnce = React.useRef(false);

  // Each page is newest-first; data.pages[0] is the newest page. Flattening
  // in page order and reversing once yields oldest -> newest overall — the
  // order a chat thread reads in top to bottom.
  const messages = React.useMemo(() => {
    return (data?.pages.flat() ?? []).slice().reverse();
  }, [data]);

  React.useEffect(() => {
    if (!hasScrolledOnce.current && messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
      hasScrolledOnce.current = true;
    }
  }, [messages.length]);

  if (isPending) {
    return (
      <div className="flex flex-col gap-4 p-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className={i % 2 === 0 ? "h-12 w-2/3" : "ml-auto h-12 w-1/2"} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        className="py-16"
        title="Couldn't load messages"
        description={error instanceof Error ? error.message : undefined}
        onRetry={() => refetch()}
      />
    );
  }

  if (messages.length === 0) {
    return (
      <EmptyState
        className="py-16"
        icon={ChatBubbleLeftRightIcon}
        title="No messages yet"
        description="This thread hasn't received anything yet."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 overflow-y-auto p-6">
      {hasNextPage && (
        <Button
          variant="outline"
          size="sm"
          className="self-center"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? "Loading…" : "Load older messages"}
        </Button>
      )}
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
