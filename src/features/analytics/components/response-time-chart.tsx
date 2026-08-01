"use client";

import { useLocale, useTranslations } from "next-intl";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/feedback/error-state";
import { intlLocale, type Locale } from "@/i18n/config";

import { useResponseTime } from "../hooks/use-response-time";
import { formatChartDate, formatSeconds } from "../lib/format";

export function ResponseTimeChart() {
  const { data, isPending, isError, error, refetch } = useResponseTime(14);
  const t = useTranslations("analytics");
  const tt = useTranslations("time");
  const locale = useLocale() as Locale;
  const loc = intlLocale(locale);

  const points = (data ?? []).map((p) => ({
    date: p.date,
    minutes: p.avg_seconds != null ? Math.round((p.avg_seconds / 60) * 10) / 10 : null,
    seconds: p.avg_seconds,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{t("avgFirstResponseTime")}</CardTitle>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <Skeleton className="h-64 w-full" />
        ) : isError ? (
          <ErrorState
            title={t("couldntLoadChartData")}
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
                  tickFormatter={(d: string) => formatChartDate(d, loc)}
                  tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  label={{ value: t("minutes"), angle: -90, position: "insideLeft", fontSize: 11, fill: "var(--color-muted-foreground)" }}
                />
                <Tooltip
                  formatter={(_value, _name, item) => {
                    const seconds = item.payload?.seconds as number | undefined;
                    return [seconds != null ? formatSeconds(seconds, tt) : t("noData"), t("avgResponseTime")];
                  }}
                  labelFormatter={(label) => formatChartDate(label as string, loc)}
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
