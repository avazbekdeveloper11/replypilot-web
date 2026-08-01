"use client";

import { SparklesIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/data/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { useAIPerformance } from "../hooks/use-ai-performance";
import { formatDuration, formatPercent } from "../lib/format";

/**
 * AI Performance widget. Reads a real, currently-empty query: this
 * project has no AI reply pipeline built yet (no code writes to the
 * ai_responses table), so total_responses is 0 today and this renders an
 * honest empty state rather than invented numbers — see
 * docs/DASHBOARD_MILESTONE.md. Once the AI pipeline exists and starts
 * responding to messages, this card starts showing real figures with no
 * code changes needed here.
 */
export function AIPerformanceCard() {
  const { data, isPending, isError, error, refetch } = useAIPerformance();
  const t = useTranslations("dashboard");
  const tt = useTranslations("time");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-sm font-medium">{t("aiPerformance")}</CardTitle>
        <SparklesIcon className="size-4 text-muted-foreground" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : isError ? (
          <ErrorState
            title={t("couldntLoadAiPerformance")}
            description={error instanceof Error ? error.message : undefined}
            onRetry={() => refetch()}
          />
        ) : !data || data.total_responses === 0 ? (
          <EmptyState
            title={t("noAiActivityYet")}
            description={t("noAiActivityDescription")}
            className="py-8"
          />
        ) : (
          <dl className="grid grid-cols-3 gap-4">
            <div>
              <dt className="text-xs text-muted-foreground">{t("responses")}</dt>
              <dd className="text-lg font-semibold tabular-nums">
                {data.total_responses.toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">{t("avgConfidence")}</dt>
              <dd className="text-lg font-semibold tabular-nums">
                {data.avg_confidence != null ? formatPercent(data.avg_confidence) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">{t("handoffRate")}</dt>
              <dd className="text-lg font-semibold tabular-nums">
                {data.handoff_rate != null ? formatPercent(data.handoff_rate) : "—"}
              </dd>
            </div>
            <div className="col-span-3">
              <dt className="text-xs text-muted-foreground">{t("avgLatency")}</dt>
              <dd className="text-lg font-semibold tabular-nums">
                {data.avg_latency_ms != null
                  ? formatDuration(data.avg_latency_ms / 1000, tt)
                  : "—"}
              </dd>
            </div>
          </dl>
        )}
      </CardContent>
    </Card>
  );
}
