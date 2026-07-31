"use client";

import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

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

const STATUS_LABEL: Record<string, string> = {
  ai_active: "AI active",
  pending_human: "Pending human",
  human_active: "Human active",
  resolved: "Resolved",
  closed: "Closed",
};

/** Recent Conversations widget — GET /v1/conversations?limit=5, newest
 * first. Not linked to a conversation-detail route: that page is still a
 * placeholder (out of scope for "the Dashboard page"), so this is
 * read-only for now. */
export function RecentConversations() {
  const { data, isPending, isError, error, refetch } = useRecentConversations(5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Recent conversations</CardTitle>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <TableSkeleton columns={3} rows={5} />
        ) : isError ? (
          <ErrorState
            title="Couldn't load conversations"
            description={error instanceof Error ? error.message : undefined}
            onRetry={() => refetch()}
          />
        ) : !data || data.length === 0 ? (
          <EmptyState
            icon={ChatBubbleLeftRightIcon}
            title="No conversations yet"
            description="New Instagram DMs will show up here as soon as a connected account receives one."
            className="py-8"
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Last message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((conv: ConversationSummary) => (
                <TableRow key={conv.id}>
                  <TableCell className="font-medium">
                    {conv.customer_username ?? "Unknown"}
                    {conv.unread_count > 0 && (
                      <Badge variant="brand" className="ml-2">
                        {conv.unread_count} new
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
                      {STATUS_LABEL[conv.status] ?? conv.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {conv.last_message_at ? formatRelativeTime(conv.last_message_at) : "—"}
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
