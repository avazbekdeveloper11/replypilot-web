"use client";

import * as React from "react";
import Link from "next/link";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/data/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { TableSkeleton } from "@/components/feedback/table-skeleton";

import { useConversations } from "../hooks/use-conversations";
import { formatRelativeTime } from "../lib/format";
import type { ConversationStatus } from "../types";

const STATUS_VARIANT: Record<string, "brand" | "warning" | "secondary" | "success"> = {
  ai_active: "brand",
  pending_human: "warning",
  human_active: "warning",
  resolved: "success",
  closed: "secondary",
};

const STATUS_LABEL: Record<string, string> = {
  ai_active: "AI active",
  pending_human: "Pending human",
  human_active: "Human active",
  resolved: "Resolved",
  closed: "Closed",
};

const FILTERS: { value: ConversationStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "ai_active", label: "AI active" },
  { value: "pending_human", label: "Pending human" },
  { value: "human_active", label: "Human active" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

export function ConversationList() {
  const [filter, setFilter] = React.useState<ConversationStatus | "all">("all");
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useConversations(filter === "all" ? undefined : filter);

  const conversations = data?.pages.flat() ?? [];

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={filter} onValueChange={(v) => setFilter(v as ConversationStatus | "all")}>
        <TabsList>
          {FILTERS.map((f) => (
            <TabsTrigger key={f.value} value={f.value}>
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-0">
          {isPending ? (
            <div className="p-6">
              <TableSkeleton columns={1} rows={8} />
            </div>
          ) : isError ? (
            <ErrorState
              className="py-16"
              title="Couldn't load conversations"
              description={error instanceof Error ? error.message : undefined}
              onRetry={() => refetch()}
            />
          ) : conversations.length === 0 ? (
            <EmptyState
              className="py-16"
              icon={ChatBubbleLeftRightIcon}
              title="No conversations here"
              description="New Instagram DMs will show up here as soon as a connected account receives one."
            />
          ) : (
            <ul className="divide-y divide-border">
              {conversations.map((conv) => (
                <li key={conv.id}>
                  <Link
                    href={`/conversations/${conv.id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-accent/50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium text-foreground">
                          {conv.customer_username ?? "Unknown customer"}
                        </span>
                        {conv.unread_count > 0 && (
                          <Badge variant="brand">{conv.unread_count}</Badge>
                        )}
                      </div>
                      {conv.last_message_preview && (
                        <p className="truncate text-xs text-muted-foreground">
                          {conv.last_message_preview}
                        </p>
                      )}
                    </div>
                    <Badge variant={STATUS_VARIANT[conv.status] ?? "secondary"}>
                      {STATUS_LABEL[conv.status] ?? conv.status}
                    </Badge>
                    <span className="w-20 shrink-0 text-right text-xs text-muted-foreground">
                      {conv.last_message_at ? formatRelativeTime(conv.last_message_at) : "—"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {hasNextPage && (
        <Button
          variant="outline"
          className="self-center"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? "Loading…" : "Load more"}
        </Button>
      )}
    </div>
  );
}
