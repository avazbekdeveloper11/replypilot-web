"use client";

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

const STATUS_HINT: Record<string, string> = {
  connected: "Active — receiving and replying to DMs.",
  expired: "Access token expired. Reconnect to resume replies.",
  revoked: "Access was revoked from Instagram's side. Reconnect to resume replies.",
  error: "Something went wrong with this connection. Reconnect to resume replies.",
};

export function ConnectedAccountsList() {
  const { data, isPending, isError, error, refetch } = useInstagramAccounts();

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
            title="Couldn't load connected accounts"
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
            title="No Instagram account connected"
            description="Connect your Instagram Business account so ReplyPilot can read and reply to your DMs."
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
                  @{account.username ?? "unknown"}
                </span>
                <Badge variant={STATUS_VARIANT[account.status] ?? "secondary"}>
                  {account.status}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">
                {STATUS_HINT[account.status] ?? ""}
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
