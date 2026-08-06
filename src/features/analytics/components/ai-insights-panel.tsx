"use client";

import { useTranslations } from "next-intl";
import { SparklesIcon } from "@heroicons/react/24/outline";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FormAlert } from "@/components/feedback/form-alert";
import { ApiError } from "@/lib/api/errors";
import { formatPriceCents } from "@/features/products/lib/format";

import { formatRelativeTime } from "../lib/format";
import { useAIInsights } from "../hooks/use-ai-insights";
import { useRegenerateAIInsights } from "../hooks/use-regenerate-ai-insights";

/**
 * Org-wide AI overview — real sales/lead/conversation numbers narrated
 * alongside a qualitative read of recent customer messages (themes,
 * sentiment). On-demand only (Regenerate button); see the backend
 * insights.UseCase.Regenerate doc comment for exactly what's real data
 * versus what Gemini actually reasons about.
 */
export function AIInsightsPanel() {
  const { data, isPending } = useAIInsights();
  const regenerateMutation = useRegenerateAIInsights();
  const t = useTranslations("analytics");
  const tt = useTranslations("time");

  const busy = regenerateMutation.isPending;
  const buttonLabel = busy
    ? t("aiInsightsGenerating")
    : data
      ? t("aiInsightsRegenerate")
      : t("aiInsightsGenerate");

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex-row items-center justify-between gap-2">
        <CardTitle className="flex items-center gap-1.5 text-sm font-medium">
          <SparklesIcon className="size-4" />
          {t("aiInsightsTitle")}
        </CardTitle>
        <Button variant="outline" size="sm" disabled={busy || isPending} onClick={() => regenerateMutation.mutate()}>
          {buttonLabel}
        </Button>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          <>
            {regenerateMutation.isError && (
              <FormAlert variant="error" className="mb-3">
                {regenerateMutation.error instanceof ApiError
                  ? regenerateMutation.error.message
                  : t("aiInsightsError")}
              </FormAlert>
            )}
            {data ? (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border border-border p-3">
                    <div className="text-xs text-muted-foreground">{t("aiInsightsSales")}</div>
                    <div className="mt-1 text-lg font-semibold">{data.sales_count}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatPriceCents(data.sales_amount_cents, "UZS")}
                    </div>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <div className="text-xs text-muted-foreground">{t("aiInsightsLeads")}</div>
                    <div className="mt-1 text-lg font-semibold">{data.lead_count}</div>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <div className="text-xs text-muted-foreground">{t("aiInsightsConversations")}</div>
                    <div className="mt-1 text-lg font-semibold">{data.conversation_count}</div>
                  </div>
                </div>
                <p className="whitespace-pre-line text-sm text-foreground">{data.summary}</p>
                <p className="text-[11px] text-muted-foreground">
                  {t("aiInsightsGeneratedAt", { time: formatRelativeTime(data.generated_at, tt) })}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t("aiInsightsEmpty")}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
