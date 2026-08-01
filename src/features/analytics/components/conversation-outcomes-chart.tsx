"use client";

import { useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/feedback/error-state";

import { useConversationOutcomes } from "../hooks/use-conversation-outcomes";

/** labelKey is a key into the shared "conversationStatus" namespace
 * (module scope has no React context to translate at definition time —
 * same reasoning as config/navigation.ts). */
const SEGMENTS: { key: "ai_active" | "pending_human" | "human_active" | "resolved" | "closed"; labelKey: string; color: string }[] = [
  { key: "ai_active", labelKey: "aiActive", color: "var(--color-brand)" },
  { key: "pending_human", labelKey: "pendingHuman", color: "var(--color-warning)" },
  { key: "human_active", labelKey: "humanActive", color: "var(--color-warning)" },
  { key: "resolved", labelKey: "resolved", color: "var(--color-success)" },
  { key: "closed", labelKey: "closed", color: "var(--color-muted-foreground)" },
];

export function ConversationOutcomesChart() {
  const { data, isPending, isError, error, refetch } = useConversationOutcomes();
  const t = useTranslations("analytics");
  const ts = useTranslations("conversationStatus");

  const rows = data
    ? SEGMENTS.map((s) => ({ label: ts(s.labelKey), count: data[s.key], color: s.color }))
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{t("conversationsByStatus")}</CardTitle>
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
              <BarChart data={rows} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  tick={{ fontSize: 12, fill: "var(--color-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  width={110}
                />
                <Tooltip
                  formatter={(value) => [value, t("conversationsTooltip")]}
                  contentStyle={{
                    backgroundColor: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {rows.map((row) => (
                    <Cell key={row.label} fill={row.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
