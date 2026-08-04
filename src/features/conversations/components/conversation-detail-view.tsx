"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/feedback/error-state";
import { InstagramProfileLink } from "@/components/data/instagram-profile-link";

import { useConversation } from "../hooks/use-conversation";
import { MessageThread } from "./message-thread";

const STATUS_VARIANT: Record<string, "brand" | "warning" | "secondary" | "success"> = {
  ai_active: "brand",
  pending_human: "warning",
  human_active: "warning",
  resolved: "success",
  closed: "secondary",
};

/** Keys into the shared "conversationStatus" namespace. */
const STATUS_LABEL_KEY: Record<string, string> = {
  ai_active: "aiActive",
  pending_human: "pendingHuman",
  human_active: "humanActive",
  resolved: "resolved",
  closed: "closed",
};

/**
 * Read-only: there's no send-message endpoint in this codebase yet (only
 * the webhook ingestion path writes messages, from the customer/Meta
 * side) — a composer here would be UI with nothing real to call. That
 * lands with the AI Inbox / human-handoff reply flow, not this page.
 */
export function ConversationDetailView({ conversationId }: { conversationId: string }) {
  const { data, isPending, isError, error, refetch } = useConversation(conversationId);
  const t = useTranslations("conversations");
  const ts = useTranslations("conversationStatus");

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      <Link
        href="/conversations"
        className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" />
        {t("backToConversations")}
      </Link>

      <Card className="flex flex-1 flex-col overflow-hidden py-0">
        <CardHeader className="flex-row items-center justify-between gap-2 border-b border-border py-4">
          {isPending ? (
            <Skeleton className="h-6 w-40" />
          ) : isError ? (
            <span className="text-sm text-destructive">{t("couldntLoadThisConversation")}</span>
          ) : (
            <>
              <div className="flex flex-col">
                <InstagramProfileLink
                  username={data?.customer_username}
                  fallback={t("unknownCustomer")}
                  className="text-sm font-semibold"
                />
              </div>
              <Badge variant={STATUS_VARIANT[data?.status ?? ""] ?? "secondary"}>
                {STATUS_LABEL_KEY[data?.status ?? ""] ? ts(STATUS_LABEL_KEY[data?.status ?? ""]) : data?.status}
              </Badge>
            </>
          )}
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          {isError ? (
            <ErrorState
              className="py-16"
              title={t("couldntLoadThisConversation")}
              description={error instanceof Error ? error.message : undefined}
              onRetry={() => refetch()}
            />
          ) : (
            <MessageThread conversationId={conversationId} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
