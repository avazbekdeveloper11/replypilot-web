"use client";

import { ClockIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats } from "../hooks/use-dashboard-stats";
import { formatDuration } from "../lib/format";

/** Response Time widget — average time between a customer's first
 * message and the first reply, over the trailing 30 days. Shares the
 * /v1/dashboard/stats query with StatCards (no separate request). */
export function ResponseTimeCard() {
  const { data, isPending } = useDashboardStats();
  const t = useTranslations("dashboard");
  const tt = useTranslations("time");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <CardTitle className="text-sm font-medium">{t("avgFirstResponseTime")}</CardTitle>
        <ClockIcon className="size-4 text-muted-foreground" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        {isPending ? (
          <Skeleton className="h-8 w-24" />
        ) : data?.avg_first_response_seconds != null ? (
          <p className="text-2xl font-semibold tabular-nums text-foreground">
            {formatDuration(data.avg_first_response_seconds, tt)}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">{t("notEnoughResponseData")}</p>
        )}
      </CardContent>
    </Card>
  );
}
