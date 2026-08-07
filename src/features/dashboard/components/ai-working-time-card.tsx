"use client";

import { ClockIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAIPerformance } from "../hooks/use-ai-performance";
import { formatDuration } from "../lib/format";

/**
 * Total AI working time — sum of every ai_responses.latency_ms row,
 * all-time. Replaced the old "avg first-response time" card here
 * (formerly response-time-card.tsx): that metric mixes in the wait time
 * for conversations sitting on a human handoff, so it reads as slow even
 * when the AI itself is fast. This one only counts time the AI actually
 * spent generating replies. Shares the /v1/dashboard/ai-performance query
 * with AIPerformanceCard (no separate request).
 */
export function AiWorkingTimeCard() {
  const { data, isPending } = useAIPerformance();
  const t = useTranslations("dashboard");
  const tt = useTranslations("time");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <CardTitle className="text-sm font-medium">{t("totalAiWorkingTime")}</CardTitle>
        <ClockIcon className="size-4 text-muted-foreground" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        {isPending ? (
          <Skeleton className="h-8 w-24" />
        ) : data?.total_latency_ms != null ? (
          <p className="text-2xl font-semibold tabular-nums text-foreground">
            {formatDuration(data.total_latency_ms / 1000, tt)}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">{t("noAiActivityYet")}</p>
        )}
      </CardContent>
    </Card>
  );
}
