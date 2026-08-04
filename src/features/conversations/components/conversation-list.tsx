"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/data/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { TableSkeleton } from "@/components/feedback/table-skeleton";
import { InstagramProfileLink } from "@/components/data/instagram-profile-link";

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

/** Keys into the shared "conversationStatus" namespace (also used by
 * features/dashboard and features/ai-inbox — same status vocabulary). */
const STATUS_LABEL_KEY: Record<string, string> = {
  ai_active: "aiActive",
  pending_human: "pendingHuman",
  human_active: "humanActive",
  resolved: "resolved",
  closed: "closed",
};

const FILTER_VALUES: (ConversationStatus | "all")[] = [
  "all",
  "ai_active",
  "pending_human",
  "human_active",
  "resolved",
  "closed",
];

export function ConversationList() {
  const [filter, setFilter] = React.useState<ConversationStatus | "all">("all");
  const router = useRouter();
  const t = useTranslations("conversations");
  const ts = useTranslations("conversationStatus");
  const tt = useTranslations("time");
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
          {FILTER_VALUES.map((value) => (
            <TabsTrigger key={value} value={value}>
              {value === "all" ? ts("all") : ts(STATUS_LABEL_KEY[value])}
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
              title={t("couldntLoadConversations")}
              description={error instanceof Error ? error.message : undefined}
              onRetry={() => refetch()}
            />
          ) : conversations.length === 0 ? (
            <EmptyState
              className="py-16"
              icon={ChatBubbleLeftRightIcon}
              title={t("noConversationsHere")}
              description={t("noConversationsDescription")}
            />
          ) : (
            <ul className="divide-y divide-border">
              {conversations.map((conv) => (
                <li key={conv.id}>
                  {/* Not a <Link>: the username inside needs its own
                      target="_blank" anchor to Instagram, and anchors can't
                      nest. Row navigation is a click handler instead — see
                      InstagramProfileLink's doc comment. */}
                  <div
                    role="link"
                    tabIndex={0}
                    onClick={() => router.push(`/conversations/${conv.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") router.push(`/conversations/${conv.id}`);
                    }}
                    className="flex cursor-pointer items-center gap-4 px-6 py-4 hover:bg-accent/50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <InstagramProfileLink
                          username={conv.customer_username}
                          fallback={t("unknownCustomer")}
                          className="truncate text-sm font-medium"
                        />
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
                      {STATUS_LABEL_KEY[conv.status] ? ts(STATUS_LABEL_KEY[conv.status]) : conv.status}
                    </Badge>
                    <span className="w-20 shrink-0 text-right text-xs text-muted-foreground">
                      {conv.last_message_at ? formatRelativeTime(conv.last_message_at, tt) : "—"}
                    </span>
                  </div>
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
          {isFetchingNextPage ? t("loadingMore") : t("loadMore")}
        </Button>
      )}
    </div>
  );
}
