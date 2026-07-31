"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/feedback/error-state";

import { useResponseTime } from "../hooks/use-response-time";
import { formatChartDate, formatSeconds } from "../lib/format";

export function ResponseTimeChart() {
  const { data, isPending, isError, error, refetch } = useResponseTime(14);

  const points = (data ?? []).map((p) => ({
    date: p.date,
    minutes: p.avg_seconds != null ? Math.round((p.avg_seconds / 60) * 10) / 10 : null,
    seconds: p.avg_seconds,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Average first-response time</CardTitle>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <Skeleton className="h-64 w-full" />
        ) : isError ? (
          <ErrorState
            title="Couldn't load chart data"
            description={error instanceof Error ? error.message : undefined}
            onRetry={() => refetch()}
          />
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatChartDate}
                  tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  label={{ value: "minutes", angle: -90, position: "insideLeft", fontSize: 11, fill: "var(--color-muted-foreground)" }}
                />
                <Tooltip
                  formatter={(_value, _name, item) => {
                    const seconds = item.payload?.seconds as number | undefined;
                    return [seconds != null ? formatSeconds(seconds) : "No data", "Avg response time"];
                  }}
                  labelFormatter={(label) => formatChartDate(label as string)}
                  contentStyle={{
                    backgroundColor: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="minutes"
                  stroke="var(--color-brand)"
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
