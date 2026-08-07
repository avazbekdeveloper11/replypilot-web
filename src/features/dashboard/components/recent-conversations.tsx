"use client";

import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/data/empty-state";
import { InstagramProfileLink } from "@/components/data/instagram-profile-link";
import { ErrorState } from "@/components/feedback/error-state";
import { TableSkeleton } from "@/components/feedback/table-skeleton";
import { useRecentConversations } from "../hooks/use-recent-conversations";
import { formatRelativeTime } from "../lib/format";
import type { ConversationSummary } from "../types";

const STATUS_VARIANT: Record<string, "brand" | "warning" | "secondary" | "success"> = {
  ai_active: "brand",
  pending_human: "warning",
  human_active: "warning",
  resolved: "success",
  closed: "secondary",
};

/** Keys into the shared "conversationStatus" message namespace — reused
 * verbatim by features/conversations and features/ai-inbox, which show
 * the same status vocabulary. */
const STATUS_LABEL_KEY: Record<string, string> = {
  ai_active: "aiActive",
  pending_human: "pendingHuman",
  human_active: "humanActive",
  resolved: "resolved",
  closed: "closed",
};

/** Recent Conversations widget — GET /v1/conversations?limit=5, newest
 * first. Not linked to a conversation-detail route: that page is still a
 * placeholder (out of scope for "the Dashboard page"), so this is
 * read-only for now. */
export function RecentConversations() {
  const { data, isPending, isError, error, refetch } = useRecentConversations(5);
  const t = useTranslations("dashboard");
  const ts = useTranslations("conversationStatus");
  const tt = useTranslations("time");

  return (
    <Card className="h-[26rem]">
      <CardHeader>
        <CardTitle className="text-sm font-medium">{t("recentConversations")}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        {isPending ? (
          <TableSkeleton columns={3} rows={5} />
        ) : isError ? (
          <ErrorState
            title={t("couldntLoadConversations")}
            description={error instanceof Error ? error.message : undefined}
            onRetry={() => refetch()}
          />
        ) : !data || data.length === 0 ? (
          <EmptyState
            icon={ChatBubbleLeftRightIcon}
            title={t("noConversationsYet")}
            description={t("noConversationsDescription")}
            className="py-8"
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("customer")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead className="text-right">{t("lastMessage")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((conv: ConversationSummary) => (
                <TableRow key={conv.id}>
                  <TableCell className="font-medium">
                    <InstagramProfileLink username={conv.customer_username} fallback={t("unknown")} />
                    {conv.unread_count > 0 && (
                      <Badge variant="brand" className="ml-2">
                        {t("newCount", { count: conv.unread_count })}
                      </Badge>
                    )}
                    {conv.last_message_preview && (
                      <p className="truncate text-xs font-normal text-muted-foreground">
                        {conv.last_message_preview}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[conv.status] ?? "secondary"}>
                      {STATUS_LABEL_KEY[conv.status] ? ts(STATUS_LABEL_KEY[conv.status]) : conv.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {conv.last_message_at ? formatRelativeTime(conv.last_message_at, tt) : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
