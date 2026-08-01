"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations, useLocale } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/feedback/form-alert";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api/errors";
import { intlLocale, type Locale } from "@/i18n/config";

import { useGeminiSettings } from "../hooks/use-gemini-settings";
import { useSetGeminiSettings } from "../hooks/use-set-gemini-settings";
import {
  buildGeminiSettingsSchema,
  type GeminiSettingsValues,
} from "../schemas/gemini-settings.schema";

/**
 * Write-only by design, same principle as ChangePasswordForm: once a key
 * is set, the backend never returns it again (AdminGeminiSettings has no
 * value field) — this form can only replace it, never display or
 * pre-fill it. See platformsettings.GeminiKeyStatus's doc comment on the
 * backend side.
 *
 * A rotated key reaches both the API service and the AI worker within
 * internal/platform/geminikey's poll interval (30s) — no redeploy needed,
 * which is the whole reason this card exists instead of "just edit .env
 * and redeploy".
 */
export function GeminiSettingsCard() {
  const { data, isPending, isError, error } = useGeminiSettings();
  const mutation = useSetGeminiSettings();
  const t = useTranslations("admin");
  const tv = useTranslations("validation");
  const locale = useLocale() as Locale;

  const geminiSettingsSchema = React.useMemo(() => buildGeminiSettingsSchema(tv), [tv]);

  const form = useForm<GeminiSettingsValues>({
    resolver: zodResolver(geminiSettingsSchema),
    defaultValues: { api_key: "" },
  });

  function onSubmit(values: GeminiSettingsValues) {
    mutation.mutate(values.api_key, {
      onSuccess: () => form.reset(),
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("geminiApiKey")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">{t("geminiApiKeyDescription")}</p>

        {isPending ? (
          <Skeleton className="h-5 w-40" />
        ) : isError ? (
          <FormAlert variant="error">
            {error instanceof ApiError ? error.message : t("couldntLoadStatus")}
          </FormAlert>
        ) : (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">{t("statusLabel")}</span>
            {data?.configured ? (
              <Badge variant="success">{t("configured")}</Badge>
            ) : (
              <Badge variant="warning">{t("notConfigured")}</Badge>
            )}
            {data?.configured && data.updated_at && (
              <span className="text-xs text-muted-foreground">
                {t("lastUpdated", {
                  date: new Date(data.updated_at).toLocaleString(intlLocale(locale)),
                })}
              </span>
            )}
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="gemini_api_key">
              {data?.configured ? t("rotateKey") : t("setKey")}
            </Label>
            <Input
              id="gemini_api_key"
              type="password"
              autoComplete="off"
              placeholder="AIzaSy…"
              aria-invalid={!!form.formState.errors.api_key}
              {...form.register("api_key")}
            />
            {form.formState.errors.api_key && (
              <p className="text-xs text-destructive">{form.formState.errors.api_key.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {t("getKeyAt")}{" "}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2"
              >
                aistudio.google.com/apikey
              </a>
              . {t("realKeyHint")}
            </p>
          </div>

          {mutation.isError && (
            <FormAlert variant="error">
              {mutation.error instanceof ApiError ? mutation.error.message : t("genericError")}
            </FormAlert>
          )}

          {mutation.isSuccess && <FormAlert variant="success">{t("keySaved")}</FormAlert>}

          <div>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? t("saving") : data?.configured ? t("rotateKey") : t("saveKey")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
