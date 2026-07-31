"use client";

import { ClockIcon } from "@heroicons/react/24/outline";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats } from "../hooks/use-dashboard-stats";
import { formatDuration } from "../lib/format";

/** Response Time widget — average time between a customer's first
 * message and the first reply, over the trailing 30 days. Shares the
 * /v1/dashboard/stats query with StatCards (no separate request). */
export function ResponseTimeCard() {
  const { data, isPending } = useDashboardStats();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <CardTitle className="text-sm font-medium">Avg. first response time</CardTitle>
        <ClockIcon className="size-4 text-muted-foreground" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        {isPending ? (
          <Skeleton className="h-8 w-24" />
        ) : data?.avg_first_response_seconds != null ? (
          <p className="text-2xl font-semibold tabular-nums text-foreground">
            {formatDuration(data.avg_first_response_seconds)}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Not enough data yet — needs at least one conversation with both an
            inbound message and a reply in the last 30 days.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
