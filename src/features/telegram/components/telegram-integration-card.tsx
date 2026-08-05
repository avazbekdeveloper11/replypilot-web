"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

import { useTelegramAccounts } from "../hooks/use-telegram-accounts";
import { useConnectTelegram } from "../hooks/use-connect-telegram";
import { useDisconnectTelegram } from "../hooks/use-disconnect-telegram";
import { buildTelegramSchema, type TelegramFormValues } from "../schemas/telegram.schema";
import type { TelegramAccount } from "../types";

/**
 * The org's Telegram Business bot — once connected AND paired (see
 * TelegramAccount.paired's doc comment), the same AI reply pipeline that
 * answers Instagram DMs (internal/usecase/ai.HandleInboundMessage) answers
 * messages sent to the org's Telegram Business account too, and "Take
 * over" on the Conversations page works identically regardless of channel.
 *
 * One bot per organization for now (see telegram.ConnectUseCase.Connect's
 * doc comment on the backend) — this card shows/replaces a single
 * connection, the same UX shape as ClickIntegrationCard, not a list.
 */
export function TelegramIntegrationCard() {
  const { data: accounts, isPending } = useTelegramAccounts();
  const t = useTranslations("telegram");
  const account = accounts?.[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("cardTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <Skeleton className="h-24 w-full" />
        ) : account ? (
          <ConnectedState account={account} />
        ) : (
          <ConnectForm />
        )}
      </CardContent>
    </Card>
  );
}

function ConnectedState({ account }: { account: TelegramAccount }) {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const disconnectMutation = useDisconnectTelegram();
  const t = useTranslations("telegram");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        {account.paired ? (
          <Badge variant="success">{t("connected")}</Badge>
        ) : (
          <Badge variant="warning">{t("awaitingPairing")}</Badge>
        )}
        {account.bot_username && (
          <span className="text-sm text-muted-foreground">@{account.bot_username}</span>
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        {account.paired ? t("connectedHint") : t("awaitingPairingHint")}
      </p>
      <div>
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
                disconnectMutation.mutate(account.id, { onSuccess: () => setConfirmOpen(false) })
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

function ConnectForm() {
  const connectMutation = useConnectTelegram();
  const t = useTranslations("telegram");
  const tv = useTranslations("validation");

  const telegramSchema = React.useMemo(() => buildTelegramSchema(tv), [tv]);

  const form = useForm<TelegramFormValues>({
    resolver: zodResolver(telegramSchema),
    defaultValues: { bot_token: "" },
  });

  function onSubmit(values: TelegramFormValues) {
    connectMutation.mutate(values.bot_token, {
      onSuccess: () => form.reset(),
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <p className="text-sm text-muted-foreground">{t("connectDescription")}</p>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="telegram-bot-token">{t("botTokenLabel")}</Label>
        <Input
          id="telegram-bot-token"
          autoComplete="off"
          aria-invalid={!!form.formState.errors.bot_token}
          {...form.register("bot_token")}
        />
        {form.formState.errors.bot_token && (
          <p className="text-xs text-destructive">{form.formState.errors.bot_token.message}</p>
        )}
      </div>

      {connectMutation.isError && (
        <FormAlert variant="error">
          {connectMutation.error instanceof ApiError
            ? connectMutation.error.message
            : t("genericError")}
        </FormAlert>
      )}

      <div>
        <Button type="submit" disabled={connectMutation.isPending}>
          {connectMutation.isPending ? t("connecting") : t("connect")}
        </Button>
      </div>
    </form>
  );
}
