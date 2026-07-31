"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/feedback/error-state";

import { useConversationOutcomes } from "../hooks/use-conversation-outcomes";

const SEGMENTS: { key: "ai_active" | "pending_human" | "human_active" | "resolved" | "closed"; label: string; color: string }[] = [
  { key: "ai_active", label: "AI active", color: "var(--color-brand)" },
  { key: "pending_human", label: "Pending human", color: "var(--color-warning)" },
  { key: "human_active", label: "Human active", color: "var(--color-warning)" },
  { key: "resolved", label: "Resolved", color: "var(--color-success)" },
  { key: "closed", label: "Closed", color: "var(--color-muted-foreground)" },
];

export function ConversationOutcomesChart() {
  const { data, isPending, isError, error, refetch } = useConversationOutcomes();

  const rows = data
    ? SEGMENTS.map((s) => ({ label: s.label, count: data[s.key], color: s.color }))
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Conversations by status</CardTitle>
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
                  formatter={(value) => [value, "Conversations"]}
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
