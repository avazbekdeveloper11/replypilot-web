"use client";

import { useLocale, useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/feedback/error-state";
import { intlLocale, type Locale } from "@/i18n/config";

import { useAIUsage } from "../hooks/use-ai-usage";
import { formatChartDate } from "../lib/format";

/** Bars are AI replies sent per day; token usage is shown in the tooltip
 * rather than as a second series — a dual-axis chart (count vs. tokens,
 * wildly different scales) reads worse than one clear metric plus detail
 * on hover. */
export function AIUsageChart() {
  const { data, isPending, isError, error, refetch } = useAIUsage(14);
  const t = useTranslations("analytics");
  const locale = useLocale() as Locale;
  const loc = intlLocale(locale);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{t("aiRepliesSent")}</CardTitle>
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
              <BarChart data={data ?? []} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
                  allowDecimals={false}
                />
                <Tooltip
                  formatter={(value, name) =>
                    name === "response_count" ? [value, t("repliesSent")] : [value, name]
                  }
                  labelFormatter={(label) => formatChartDate(label as string, loc)}
                  contentStyle={{
                    backgroundColor: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="response_count" fill="var(--color-brand)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
