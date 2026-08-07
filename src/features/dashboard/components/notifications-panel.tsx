"use client";

import { BellIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/data/empty-state";
import { InstagramProfileLink } from "@/components/data/instagram-profile-link";
import { ErrorState } from "@/components/feedback/error-state";
import { useNotifications } from "../hooks/use-notifications";
import { formatRelativeTime } from "../lib/format";

/**
 * Notifications widget — unread conversations, newest first. This
 * project has no dedicated notifications table/feed with application
 * code behind it yet (see docs/DASHBOARD_MILESTONE.md); this is real
 * backend-connected data (Conversation.unread_count, which the webhook
 * ingestion path already keeps correct), just a narrower definition of
 * "notification" than a full events system would give.
 */
export function NotificationsPanel() {
  const { data, isPending, isError, error, refetch } = useNotifications(8);
  const t = useTranslations("dashboard");
  const tt = useTranslations("time");

  return (
    <Card className="h-[26rem]">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-sm font-medium">{t("notificationsTitle")}</CardTitle>
        <BellIcon className="size-4 text-muted-foreground" aria-hidden="true" />
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        {isPending ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState
            title={t("couldntLoadNotifications")}
            description={error instanceof Error ? error.message : undefined}
            onRetry={() => refetch()}
          />
        ) : !data || data.length === 0 ? (
          <EmptyState
            icon={BellIcon}
            title={t("allCaughtUp")}
            description={t("noUnreadConversations")}
            className="py-8"
          />
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {data.map((item) => (
              <li key={item.conversation_id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0 flex-1">
                  <InstagramProfileLink
                    username={item.customer_username}
                    fallback={t("newMessage")}
                    className="truncate text-sm font-medium"
                  />
                  {item.preview && (
                    <p className="truncate text-xs text-muted-foreground">{item.preview}</p>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <Badge variant="brand">{item.unread_count}</Badge>
                  {item.last_message_at && (
                    <span className="text-[11px] text-muted-foreground">
                      {formatRelativeTime(item.last_message_at, tt)}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
