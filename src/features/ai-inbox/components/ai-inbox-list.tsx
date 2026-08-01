"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { SparklesIcon } from "@heroicons/react/24/outline";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/data/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { TableSkeleton } from "@/components/feedback/table-skeleton";
import { useConversations } from "@/features/conversations/hooks/use-conversations";
import { useTakeOverConversation } from "@/features/conversations/hooks/use-take-over-conversation";

import { formatRelativeTime } from "../lib/format";

/** Every conversation the AI pipeline handed off — see
 * internal/usecase/ai's confidence-gate doc comment for how a conversation
 * ends up pending_human. This is a fixed status filter, not the
 * multi-status tabs on the full Conversations page (ConversationList) —
 * the AI Inbox is specifically the handoff queue. */
export function AIInboxList() {
  const router = useRouter();
  const { data, isPending, isError, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useConversations("pending_human");
  const takeOverMutation = useTakeOverConversation();
  const t = useTranslations("aiInbox");
  const tt = useTranslations("time");

  const conversations = data?.pages.flat() ?? [];

  if (isPending) {
    return (
      <Card>
        <CardContent className="p-6">
          <TableSkeleton columns={1} rows={6} />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-0">
          <ErrorState
            className="py-16"
            title={t("couldntLoadAiInbox")}
            description={error instanceof Error ? error.message : undefined}
            onRetry={() => refetch()}
          />
        </CardContent>
      </Card>
    );
  }

  if (conversations.length === 0) {
    return (
      <Card>
        <CardContent className="p-0">
          <EmptyState
            className="py-16"
            icon={SparklesIcon}
            title={t("nothingWaitingTitle")}
            description={t("nothingWaitingDescription")}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {conversations.map((conv) => (
              <li
                key={conv.id}
                className="flex items-center gap-4 px-6 py-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium text-foreground">
                      {conv.customer_username ?? t("unknownCustomer")}
                    </span>
                    {conv.unread_count > 0 && <Badge variant="brand">{conv.unread_count}</Badge>}
                  </div>
                  {conv.last_message_preview && (
                    <p className="truncate text-xs text-muted-foreground">
                      {conv.last_message_preview}
                    </p>
                  )}
                </div>
                <span className="w-20 shrink-0 text-right text-xs text-muted-foreground">
                  {conv.last_message_at ? formatRelativeTime(conv.last_message_at, tt) : "—"}
                </span>
                <Button
                  size="sm"
                  disabled={takeOverMutation.isPending}
                  onClick={() => {
                    takeOverMutation.mutate(conv.id, {
                      onSuccess: () => router.push(`/conversations/${conv.id}`),
                    });
                  }}
                >
                  {t("takeOver")}
                </Button>
              </li>
            ))}
          </ul>
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
