"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/feedback/form-alert";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api/errors";

import { useGeminiSettings } from "../hooks/use-gemini-settings";
import { useSetGeminiSettings } from "../hooks/use-set-gemini-settings";
import { geminiSettingsSchema, type GeminiSettingsValues } from "../schemas/gemini-settings.schema";

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
        <CardTitle>Gemini API key</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Used for AI reply generation and knowledge-base embeddings across every
          organization. Rotating it here reaches both the API service and the AI
          worker automatically — no redeploy needed.
        </p>

        {isPending ? (
          <Skeleton className="h-5 w-40" />
        ) : isError ? (
          <FormAlert variant="error">
            {error instanceof ApiError ? error.message : "Couldn't load status."}
          </FormAlert>
        ) : (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Status:</span>
            {data?.configured ? (
              <Badge variant="success">Configured</Badge>
            ) : (
              <Badge variant="warning">Not configured</Badge>
            )}
            {data?.configured && data.updated_at && (
              <span className="text-xs text-muted-foreground">
                Last updated {new Date(data.updated_at).toLocaleString()}
              </span>
            )}
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="gemini_api_key">
              {data?.configured ? "Rotate key" : "Set key"}
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
              Get a key at{" "}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2"
              >
                aistudio.google.com/apikey
              </a>
              . Real Gemini keys start with &quot;AIzaSy&quot; — double-check before
              saving.
            </p>
          </div>

          {mutation.isError && (
            <FormAlert variant="error">
              {mutation.error instanceof ApiError
                ? mutation.error.message
                : "Something went wrong. Please try again."}
            </FormAlert>
          )}

          {mutation.isSuccess && <FormAlert variant="success">Key saved.</FormAlert>}

          <div>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving…" : data?.configured ? "Rotate key" : "Save key"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
