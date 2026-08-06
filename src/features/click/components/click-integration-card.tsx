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

import { useClickIntegration } from "../hooks/use-click-integration";
import { useConnectClick } from "../hooks/use-connect-click";
import { useDisconnectClick } from "../hooks/use-disconnect-click";
import { buildClickSchema, type ClickFormValues } from "../schemas/click.schema";

/**
 * Every org's own Click (click.uz) merchant wallet — once connected, the
 * AI reply pipeline builds a ready-to-send payment link for any product
 * the customer asks to buy (see backend/internal/usecase/ai's
 * buildProductContext). Not connected = the AI never sends a payment link
 * at all, by design (internal/integration/clickapi is the only place a
 * link is ever constructed — the LLM never builds one itself).
 *
 * Payme is intentionally not part of this card yet — scoped as
 * Click-first, Payme later, per how this was requested.
 */
export function ClickIntegrationCard() {
  const { data: integration, isPending } = useClickIntegration();
  const t = useTranslations("click");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("cardTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <Skeleton className="h-24 w-full" />
        ) : integration ? (
          <ConnectedState
            merchantId={integration.merchant_id}
            serviceId={integration.service_id}
          />
        ) : (
          <ConnectForm />
        )}
      </CardContent>
    </Card>
  );
}

function ConnectedState({ merchantId, serviceId }: { merchantId: string; serviceId: string }) {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const disconnectMutation = useDisconnectClick();
  const t = useTranslations("click");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Badge variant="success">{t("connected")}</Badge>
        <span className="text-sm text-muted-foreground">
          {t("merchantIdLabel")}: {merchantId} · {t("serviceIdLabel")}: {serviceId}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">{t("connectedHint")}</p>
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

function ConnectForm() {
  const connectMutation = useConnectClick();
  const t = useTranslations("click");
  const tv = useTranslations("validation");

  const clickSchema = React.useMemo(() => buildClickSchema(tv), [tv]);

  const form = useForm<ClickFormValues>({
    resolver: zodResolver(clickSchema),
    defaultValues: { merchant_id: "", service_id: "", secret_key: "", merchant_user_id: "" },
  });

  function onSubmit(values: ClickFormValues) {
    connectMutation.mutate({
      merchant_id: values.merchant_id,
      service_id: values.service_id,
      secret_key: values.secret_key,
      merchant_user_id: values.merchant_user_id?.trim() ? values.merchant_user_id : null,
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <p className="text-sm text-muted-foreground">{t("connectDescription")}</p>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="click-merchant-id">{t("merchantIdLabel")}</Label>
        <Input
          id="click-merchant-id"
          aria-invalid={!!form.formState.errors.merchant_id}
          {...form.register("merchant_id")}
        />
        {form.formState.errors.merchant_id && (
          <p className="text-xs text-destructive">{form.formState.errors.merchant_id.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="click-service-id">{t("serviceIdLabel")}</Label>
        <Input
          id="click-service-id"
          aria-invalid={!!form.formState.errors.service_id}
          {...form.register("service_id")}
        />
        {form.formState.errors.service_id && (
          <p className="text-xs text-destructive">{form.formState.errors.service_id.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="click-secret-key">{t("secretKeyLabel")}</Label>
        <Input
          id="click-secret-key"
          type="password"
          autoComplete="off"
          aria-invalid={!!form.formState.errors.secret_key}
          {...form.register("secret_key")}
        />
        {form.formState.errors.secret_key ? (
          <p className="text-xs text-destructive">{form.formState.errors.secret_key.message}</p>
        ) : (
          <p className="text-xs text-muted-foreground">{t("secretKeyHint")}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="click-merchant-user-id">{t("merchantUserIdLabel")}</Label>
        <Input id="click-merchant-user-id" {...form.register("merchant_user_id")} />
        <p className="text-xs text-muted-foreground">{t("merchantUserIdHint")}</p>
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
