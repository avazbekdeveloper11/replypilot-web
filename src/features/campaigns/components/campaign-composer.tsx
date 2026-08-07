"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MegaphoneIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FormAlert } from "@/components/feedback/form-alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ApiError } from "@/lib/api/errors";

import { formatRelativeTime } from "../lib/format";
import { useDraftCampaign } from "../hooks/use-draft-campaign";
import { useSendCampaign } from "../hooks/use-send-campaign";
import type { CampaignDraft, CampaignSendResult } from "../types";

/**
 * Natural-language broadcast composer — an admin describes who to message
 * and why ("1 oy oldin gaplashgan mijozlarga yozib chiq"), Gemini turns
 * that into a segment + draft message (POST /campaigns/draft), and
 * nothing is sent until the admin reviews the exact recipient list and
 * message text and explicitly clicks Send (POST /campaigns/send) — see
 * the backend campaign.UseCase package doc comment on why there's no
 * autonomous-send path. Only eligible recipients (Telegram always;
 * Instagram only within Meta's 24-hour messaging window) are ever
 * included in the send — ineligible ones are shown, with why, not
 * silently dropped.
 */
export function CampaignComposer() {
  const t = useTranslations("campaigns");
  const tt = useTranslations("time");

  const [instruction, setInstruction] = useState("");
  const [draft, setDraft] = useState<CampaignDraft | null>(null);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<CampaignSendResult | null>(null);

  const draftMutation = useDraftCampaign();
  const sendMutation = useSendCampaign();

  const handleDraft = () => {
    setResult(null);
    draftMutation.mutate(instruction, {
      onSuccess: (d) => {
        setDraft(d);
        setMessage(d.message);
      },
    });
  };

  const handleSend = () => {
    if (!draft) return;
    const conversationIds = draft.recipients
      .filter((r) => r.eligible)
      .map((r) => r.conversation_id);

    sendMutation.mutate(
      { message, conversation_ids: conversationIds },
      {
        onSuccess: (r) => {
          setResult(r);
          setDraft(null);
          setInstruction("");
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-1.5 text-sm font-medium">
            <MegaphoneIcon className="size-4" />
            {t("composerTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">{t("composerHint")}</p>
          <Textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder={t("instructionPlaceholder")}
            rows={3}
            disabled={draftMutation.isPending}
          />
          {draftMutation.isError && (
            <FormAlert variant="error">
              {draftMutation.error instanceof ApiError
                ? draftMutation.error.message
                : t("draftError")}
            </FormAlert>
          )}
          <div>
            <Button
              onClick={handleDraft}
              disabled={!instruction.trim() || draftMutation.isPending}
            >
              {draftMutation.isPending ? t("drafting") : t("draftButton")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <FormAlert variant="success">
          {t("sendResult", { sent: result.sent_count, skipped: result.skipped.length })}
        </FormAlert>
      )}

      {draft && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">{t("previewTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                {t("segmentChannel", { channel: t(`channel.${draft.channel}`) })}
              </Badge>
              <Badge variant="outline">
                {draft.max_days_since_last_message != null
                  ? t("segmentRange", {
                      min: draft.min_days_since_last_message,
                      max: draft.max_days_since_last_message,
                    })
                  : t("segmentMinOnly", { min: draft.min_days_since_last_message })}
              </Badge>
              {draft.exclude_customers_who_paid && (
                <Badge variant="outline">{t("segmentExcludePaid")}</Badge>
              )}
              <Badge variant="success">{t("eligibleCount", { count: draft.eligible_count })}</Badge>
              {draft.ineligible_count > 0 && (
                <Badge variant="warning">
                  {t("ineligibleCount", { count: draft.ineligible_count })}
                </Badge>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                {t("messageLabel")}
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                disabled={sendMutation.isPending}
              />
            </div>

            {draft.recipients.length > 0 && (
              <div className="max-h-72 overflow-y-auto rounded-md border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("tableCustomer")}</TableHead>
                      <TableHead>{t("tableChannel")}</TableHead>
                      <TableHead>{t("tableLastMessage")}</TableHead>
                      <TableHead>{t("tableStatus")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {draft.recipients.map((r) => (
                      <TableRow
                        key={r.conversation_id}
                        className={!r.eligible ? "opacity-60" : undefined}
                      >
                        <TableCell>{r.customer_username ?? t("unknownCustomer")}</TableCell>
                        <TableCell className="capitalize">{r.channel}</TableCell>
                        <TableCell>{formatRelativeTime(r.last_customer_message_at, tt)}</TableCell>
                        <TableCell>
                          {r.eligible ? (
                            <Badge variant="success">{t("eligible")}</Badge>
                          ) : (
                            <span title={r.ineligible_reason}>
                              <Badge variant="warning">{t("ineligible")}</Badge>
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {draft.eligible_count === 0 && (
              <FormAlert variant="error">{t("noEligibleRecipients")}</FormAlert>
            )}

            {sendMutation.isError && (
              <FormAlert variant="error">
                {sendMutation.error instanceof ApiError
                  ? sendMutation.error.message
                  : t("sendError")}
              </FormAlert>
            )}

            <div className="flex items-center gap-2">
              <Button
                onClick={handleSend}
                disabled={draft.eligible_count === 0 || !message.trim() || sendMutation.isPending}
              >
                <PaperAirplaneIcon className="mr-1.5 size-4" />
                {sendMutation.isPending
                  ? t("sending")
                  : t("sendButton", { count: draft.eligible_count })}
              </Button>
              <Button
                variant="outline"
                onClick={() => setDraft(null)}
                disabled={sendMutation.isPending}
              >
                {t("cancel")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
