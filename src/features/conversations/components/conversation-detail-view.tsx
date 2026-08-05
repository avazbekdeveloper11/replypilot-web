"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/feedback/error-state";
import { FormAlert } from "@/components/feedback/form-alert";
import { InstagramProfileLink } from "@/components/data/instagram-profile-link";
import { ApiError } from "@/lib/api/errors";

import { useConversation } from "../hooks/use-conversation";
import { useResolveConversation } from "../hooks/use-resolve-conversation";
import { useTakeOverConversation } from "../hooks/use-take-over-conversation";
import { MessageComposer } from "./message-composer";
import { MessageThread } from "./message-thread";

/** Resolve is only valid from these two — see the backend usecase.Resolve
 * doc comment on why ai_active is deliberately excluded. */
const RESOLVABLE_STATUSES = new Set(["human_active", "pending_human"]);

/** Take-over is valid from either of these — see the backend
 * usecase.TakeOver doc comment. Not human_active: already taken over,
 * nothing to do (the composer below is what's for). */
const TAKEOVERABLE_STATUSES = new Set(["ai_active", "pending_human"]);

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

export function ConversationDetailView({ conversationId }: { conversationId: string }) {
  const { data, isPending, isError, error, refetch } = useConversation(conversationId);
  const resolveMutation = useResolveConversation();
  const takeOverMutation = useTakeOverConversation();
  const t = useTranslations("conversations");
  const ts = useTranslations("conversationStatus");

  const canResolve = !!data && RESOLVABLE_STATUSES.has(data.status);
  const canTakeOver = !!data && TAKEOVERABLE_STATUSES.has(data.status);
  const canSendMessage = data?.status === "human_active";

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
              <div className="flex items-center gap-2">
                <Badge variant={STATUS_VARIANT[data?.status ?? ""] ?? "secondary"}>
                  {STATUS_LABEL_KEY[data?.status ?? ""] ? ts(STATUS_LABEL_KEY[data?.status ?? ""]) : data?.status}
                </Badge>
                {canTakeOver && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={takeOverMutation.isPending}
                    onClick={() => takeOverMutation.mutate(conversationId)}
                  >
                    {takeOverMutation.isPending ? t("takingOver") : t("takeOver")}
                  </Button>
                )}
                {canResolve && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={resolveMutation.isPending}
                    onClick={() => resolveMutation.mutate(conversationId)}
                  >
                    {resolveMutation.isPending ? t("resolving") : t("markResolved")}
                  </Button>
                )}
              </div>
            </>
          )}
        </CardHeader>
        {(resolveMutation.isError || takeOverMutation.isError) && (
          <div className="border-b border-border px-4 py-2">
            <FormAlert variant="error">
              {resolveMutation.error instanceof ApiError
                ? resolveMutation.error.message
                : takeOverMutation.error instanceof ApiError
                  ? takeOverMutation.error.message
                  : t("genericError")}
            </FormAlert>
          </div>
        )}
        <CardContent className="flex flex-1 flex-col overflow-hidden p-0">
          {isError ? (
            <ErrorState
              className="py-16"
              title={t("couldntLoadThisConversation")}
              description={error instanceof Error ? error.message : undefined}
              onRetry={() => refetch()}
            />
          ) : (
            <>
              <div className="flex-1 overflow-hidden">
                <MessageThread conversationId={conversationId} />
              </div>
              {canSendMessage && <MessageComposer conversationId={conversationId} />}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
