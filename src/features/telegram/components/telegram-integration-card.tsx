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
import { Separator } from "@/components/ui/separator";
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
import { useGenerateNotifyCode } from "../hooks/use-generate-notify-code";
import { useUpdateNotifySettings } from "../hooks/use-update-notify-settings";
import { buildTelegramSchema, type TelegramFormValues } from "../schemas/telegram.schema";
import type { TelegramAccount } from "../types";

/** How often to re-poll while a verification code is on screen, waiting for
 * the admin to send it to the bot — see handlePlainMessage's doc comment on
 * the backend for what flips notify_verified. There's no push channel for
 * this, so a short poll is how the panel notices and auto-closes. */
const NOTIFY_CODE_POLL_MS = 3000;

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

      <Separator />
      <NotifySettingsPanel account={account} />
      <Separator />

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

/**
 * Admin-facing lead/payment notifications through this same bot — separate
 * from Business Bot pairing above (see TelegramAccount.notify_verified's
 * doc comment). Two states: not yet verified (show a "generate code"
 * button, then the code + instructions once generated, polling until the
 * admin sends it to the bot) or verified (show the two toggles).
 */
function NotifySettingsPanel({ account }: { account: TelegramAccount }) {
  const t = useTranslations("telegram");
  const [generatedCode, setGeneratedCode] = React.useState<string | null>(null);
  const generateMutation = useGenerateNotifyCode();
  const updateMutation = useUpdateNotifySettings();

  // Polls only while a code is on screen and not yet verified — see
  // NOTIFY_CODE_POLL_MS's doc comment. Once account.notify_verified flips
  // true, the code panel below stops rendering on its own (the `!
  // account.notify_verified` branch), so no extra effect is needed to clear
  // generatedCode.
  const { data: liveAccounts } = useTelegramAccounts(
    generatedCode && !account.notify_verified ? NOTIFY_CODE_POLL_MS : undefined,
  );
  const liveAccount = liveAccounts?.find((a) => a.id === account.id) ?? account;

  if (!liveAccount.notify_verified) {
    return (
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-sm font-medium text-foreground">{t("notifyTitle")}</p>
          <p className="text-sm text-muted-foreground">{t("notifyDescription")}</p>
        </div>

        {generatedCode ? (
          <div className="flex flex-col gap-2 rounded-md border border-border bg-muted/40 p-3">
            <p className="text-lg font-mono font-semibold tracking-widest text-foreground">
              {generatedCode}
            </p>
            <p className="text-xs text-muted-foreground">
              {liveAccount.bot_username
                ? t("notifyCodeHintWithUsername", { username: liveAccount.bot_username })
                : t("notifyCodeHint")}
            </p>
          </div>
        ) : (
          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={generateMutation.isPending}
              onClick={() =>
                generateMutation.mutate(account.id, {
                  onSuccess: (result) => setGeneratedCode(result.code),
                })
              }
            >
              {generateMutation.isPending ? t("notifyGenerating") : t("notifyGenerateCode")}
            </Button>
            {generateMutation.isError && (
              <p className="mt-2 text-xs text-destructive">{t("genericError")}</p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Badge variant="success">{t("notifyVerified")}</Badge>
      </div>
      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          className="size-4 rounded border-border"
          checked={liveAccount.notify_on_lead}
          disabled={updateMutation.isPending}
          onChange={(e) =>
            updateMutation.mutate({
              id: account.id,
              notifyOnLead: e.target.checked,
              notifyOnPayment: liveAccount.notify_on_payment,
            })
          }
        />
        {t("notifyOnLead")}
      </label>
      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          className="size-4 rounded border-border"
          checked={liveAccount.notify_on_payment}
          disabled={updateMutation.isPending}
          onChange={(e) =>
            updateMutation.mutate({
              id: account.id,
              notifyOnLead: liveAccount.notify_on_lead,
              notifyOnPayment: e.target.checked,
            })
          }
        />
        {t("notifyOnPayment")}
      </label>
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
