"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { FormAlert } from "@/components/feedback/form-alert";
import { ApiError } from "@/lib/api/errors";

import { useCommentAutomation } from "../hooks/use-comment-automation";
import { useUpdateCommentAutomation } from "../hooks/use-update-comment-automation";

/** Mirrors the backend's maxPublicReplyLen (commentautomation.UseCase) —
 * a public auto-reply that runs long reads as spam under every comment. */
const MAX_PUBLIC_REPLY_LEN = 280;

/**
 * Comment-to-DM automation: when someone comments on one of the org's
 * Instagram posts, the AI sends them a private reply (DM) and takes the
 * conversation from there. Off by default — see the backend
 * entity.CommentAutomationSettings doc comment on why enabling this isn't
 * something to switch on for everyone silently.
 */
export function CommentAutomationCard() {
  const { data, isPending } = useCommentAutomation();
  const mutation = useUpdateCommentAutomation();
  const t = useTranslations("commentAutomation");

  const [publicReply, setPublicReply] = React.useState("");
  const [dirty, setDirty] = React.useState(false);

  // Seed the textarea from the server value once loaded, but never clobber
  // what the user is actively typing (dirty) — this component stays
  // mounted while the mutation round-trips.
  React.useEffect(() => {
    if (data && !dirty) setPublicReply(data.public_reply_text ?? "");
  }, [data, dirty]);

  const enabled = data?.enabled ?? false;

  function save(nextEnabled: boolean) {
    mutation.mutate(
      {
        enabled: nextEnabled,
        public_reply_text: publicReply.trim() ? publicReply.trim() : null,
      },
      { onSuccess: () => setDirty(false) },
    );
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2">
        <CardTitle>{t("cardTitle")}</CardTitle>
        {!isPending && (
          <Badge variant={enabled ? "success" : "secondary"}>
            {enabled ? t("enabled") : t("disabled")}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {isPending ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">{t("description")}</p>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="comment-public-reply">{t("publicReplyLabel")}</Label>
              <Textarea
                id="comment-public-reply"
                rows={2}
                maxLength={MAX_PUBLIC_REPLY_LEN}
                placeholder={t("publicReplyPlaceholder")}
                value={publicReply}
                onChange={(e) => {
                  setPublicReply(e.target.value);
                  setDirty(true);
                }}
              />
              <p className="text-xs text-muted-foreground">{t("publicReplyHint")}</p>
            </div>

            {mutation.isError && (
              <FormAlert variant="error">
                {mutation.error instanceof ApiError ? mutation.error.message : t("genericError")}
              </FormAlert>
            )}

            <div className="flex items-center gap-2">
              <Button
                variant={enabled ? "outline" : "default"}
                disabled={mutation.isPending}
                onClick={() => save(!enabled)}
              >
                {mutation.isPending ? t("saving") : enabled ? t("disable") : t("enable")}
              </Button>
              {enabled && dirty && (
                <Button variant="outline" disabled={mutation.isPending} onClick={() => save(true)}>
                  {t("saveChanges")}
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
