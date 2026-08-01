"use client";

import { useTranslations } from "next-intl";
import { LinkIcon } from "@heroicons/react/24/outline";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/data/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { Skeleton } from "@/components/ui/skeleton";

import { useInstagramAccounts } from "../hooks/use-instagram-accounts";
import { DisconnectAccountDialog } from "./disconnect-account-dialog";
import { ConnectInstagramButton } from "./connect-instagram-button";

const STATUS_VARIANT: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  connected: "success",
  expired: "warning",
  revoked: "destructive",
  error: "destructive",
};

// Keys into the "instagram" namespace's accountStatusHint.* — see
// instagramAccountStatus namespace for the badge label equivalent.
const STATUS_HINT_KEY: Record<string, string> = {
  connected: "accountStatusHintConnected",
  expired: "accountStatusHintExpired",
  revoked: "accountStatusHintRevoked",
  error: "accountStatusHintError",
};

export function ConnectedAccountsList() {
  const { data, isPending, isError, error, refetch } = useInstagramAccounts();
  const t = useTranslations("instagram");
  const tStatus = useTranslations("instagramAccountStatus");

  if (isPending) {
    return (
      <Card>
        <CardContent className="flex flex-col gap-3 py-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
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
            title={t("couldntLoadAccounts")}
            description={error instanceof Error ? error.message : undefined}
            onRetry={() => refetch()}
          />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="p-0">
          <EmptyState
            icon={LinkIcon}
            title={t("noAccountConnected")}
            description={t("noAccountConnectedDescription")}
            action={<ConnectInstagramButton />}
            className="py-16"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {data.map((account) => (
        <Card key={account.id}>
          <CardContent className="flex items-center justify-between gap-4 py-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  @{account.username ?? t("unknownUsername")}
                </span>
                <Badge variant={STATUS_VARIANT[account.status] ?? "secondary"}>
                  {tStatus.has(account.status) ? tStatus(account.status) : account.status}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">
                {STATUS_HINT_KEY[account.status] ? t(STATUS_HINT_KEY[account.status]) : ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {account.status !== "connected" && <ConnectInstagramButton />}
              <DisconnectAccountDialog account={account} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
