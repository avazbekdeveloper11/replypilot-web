"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormAlert } from "@/components/feedback/form-alert";
import { ApiError } from "@/lib/api/errors";

import { useAmoCRMStatus } from "../hooks/use-amocrm-status";
import { useConnectAmoCRM } from "../hooks/use-connect-amocrm";
import { useDisconnectAmoCRM } from "../hooks/use-disconnect-amocrm";

const STATUS_VARIANT: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  connected: "success",
  expired: "warning",
  revoked: "destructive",
  error: "destructive",
};

/**
 * The org's own amoCRM connection (OAuth, one per org). Once connected,
 * the customer database's drill-down sheet gets a "Sync to amoCRM"
 * button per customer — see features/customers/components/customers-list.tsx.
 * This card only handles connect/status/disconnect, not the sync
 * itself — see backend amocrm.OAuthUseCase's doc comment for why sync
 * is a separate, on-demand action rather than automatic.
 */
export function AmoCRMIntegrationCard() {
  const { data: integration, isPending } = useAmoCRMStatus();
  const t = useTranslations("amocrm");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("cardTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <Skeleton className="h-16 w-full" />
        ) : integration ? (
          <ConnectedState subdomain={integration.subdomain} status={integration.status} />
        ) : (
          <ConnectPrompt />
        )}
      </CardContent>
    </Card>
  );
}

function ConnectedState({ subdomain, status }: { subdomain: string; status: string }) {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const disconnectMutation = useDisconnectAmoCRM();
  const t = useTranslations("amocrm");

  const needsReconnect = status !== "connected";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Badge variant={STATUS_VARIANT[status] ?? "secondary"}>{t(`status.${status}`)}</Badge>
        <span className="text-sm text-muted-foreground">
          {subdomain}.amocrm.ru
        </span>
      </div>
      {needsReconnect ? (
        <p className="text-sm text-muted-foreground">{t("reconnectHint")}</p>
      ) : (
        <p className="text-sm text-muted-foreground">{t("connectedHint")}</p>
      )}

      <div className="flex items-center gap-2">
        {needsReconnect && <ConnectPrompt />}
        <Button
          variant="outline"
          onClick={() => {
            disconnectMutation.reset();
            setConfirmOpen(true);
          }}
        >
          {t("disconnect")}
        </Button>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("disconnectTitle")}</DialogTitle>
            <DialogDescription>{t("disconnectDescription")}</DialogDescription>
          </DialogHeader>

          {disconnectMutation.isError && (
            <FormAlert variant="error">
              {disconnectMutation.error instanceof ApiError
                ? disconnectMutation.error.message
                : t("genericError")}
            </FormAlert>
          )}

          <DialogFooter>
            <Button
              variant="destructive"
              disabled={disconnectMutation.isPending}
              onClick={() =>
                disconnectMutation.mutate(undefined, { onSuccess: () => setConfirmOpen(false) })
              }
            >
              {disconnectMutation.isPending ? t("disconnecting") : t("disconnect")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/**
 * A full-page navigation to amoCRM's own authorize screen, not a
 * fetch — same reasoning as ConnectInstagramButton: amoCRM returns an
 * actual login/consent page, not JSON.
 */
function ConnectPrompt() {
  const mutation = useConnectAmoCRM();
  const t = useTranslations("amocrm");

  function handleClick() {
    mutation.mutate(undefined, {
      onSuccess: (result) => {
        window.location.href = result.authorization_url;
      },
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">{t("connectDescription")}</p>
      <div>
        <Button onClick={handleClick} disabled={mutation.isPending}>
          {mutation.isPending ? t("redirecting") : t("connect")}
        </Button>
      </div>
      {mutation.isError && (
        <FormAlert variant="error">
          {mutation.error instanceof ApiError ? mutation.error.message : t("couldntStartConnect")}
        </FormAlert>
      )}
    </div>
  );
}
