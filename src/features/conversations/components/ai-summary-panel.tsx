"use client";

import { useTranslations } from "next-intl";
import { SparklesIcon } from "@heroicons/react/24/outline";

import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/feedback/form-alert";
import { ApiError } from "@/lib/api/errors";

import { formatRelativeTime } from "../lib/format";
import { useSummarizeConversation } from "../hooks/use-summarize-conversation";
import type { Conversation } from "../types";

/**
 * On-demand AI summary of what this customer and the business actually
 * discussed — see the backend usecase.Summarize's doc comment. Never
 * auto-generated; a click here is the only thing that ever calls the
 * endpoint, so this never adds Gemini cost to the reply pipeline.
 */
export function AISummaryPanel({ conversation }: { conversation: Conversation }) {
  const t = useTranslations("conversations");
  const tt = useTranslations("time");
  const mutation = useSummarizeConversation();

  const summary = conversation.ai_summary;
  const buttonLabel = mutation.isPending
    ? t("aiSummaryGenerating")
    : summary
      ? t("aiSummaryRegenerate")
      : t("aiSummaryGenerate");

  return (
    <div className="border-b border-border bg-muted/30 px-4 py-3">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <SparklesIcon className="size-3.5" />
          {t("aiSummaryTitle")}
        </span>
        <Button
          variant="ghost"
          size="sm"
          disabled={mutation.isPending}
          onClick={() => mutation.mutate(conversation.id)}
        >
          {buttonLabel}
        </Button>
      </div>

      {mutation.isError && (
        <FormAlert variant="error" className="mt-2">
          {mutation.error instanceof ApiError ? mutation.error.message : t("genericError")}
        </FormAlert>
      )}

      {summary ? (
        <>
          <p className="mt-2 whitespace-pre-line text-sm text-foreground">{summary}</p>
          {conversation.ai_summary_generated_at && (
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              {t("aiSummaryGeneratedAt", { time: formatRelativeTime(conversation.ai_summary_generated_at, tt) })}
            </p>
          )}
        </>
      ) : (
        !mutation.isPending && <p className="mt-2 text-sm text-muted-foreground">{t("aiSummaryEmpty")}</p>
      )}
    </div>
  );
}
