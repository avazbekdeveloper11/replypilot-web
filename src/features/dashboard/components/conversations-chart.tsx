"use client";

import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/feedback/error-state";
import { useConversationsTimeSeries } from "../hooks/use-conversations-timeseries";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const CHART_OPTIONS: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#18181b",
      titleColor: "#fafafa",
      bodyColor: "#fafafa",
      padding: 10,
      cornerRadius: 8,
      displayColors: false,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#71717a", font: { size: 11 } },
    },
    y: {
      beginAtZero: true,
      ticks: { color: "#71717a", font: { size: 11 }, precision: 0 },
      grid: { color: "#e4e4e7" },
    },
  },
};

/** Charts widget — daily new-conversation counts over the trailing 7
 * days, from GET /v1/dashboard/timeseries. Chart.js per the brief, not
 * Recharts (the rest of this app's dependency for future analytics
 * charts) — this is a deliberate, scoped exception, not drift. */
export function ConversationsChart() {
  const { data, isPending, isError, error, refetch } = useConversationsTimeSeries(7);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Conversations — last 7 days
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <Skeleton className="h-56 w-full" />
        ) : isError ? (
          <ErrorState
            title="Couldn't load chart data"
            description={error instanceof Error ? error.message : undefined}
            onRetry={() => refetch()}
          />
        ) : (
          <div className="h-56">
            <Line
              options={CHART_OPTIONS}
              data={{
                labels: (data ?? []).map((p) =>
                  new Date(p.date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  }),
                ),
                datasets: [
                  {
                    data: (data ?? []).map((p) => p.count),
                    borderColor: "#6366f1",
                    backgroundColor: "rgba(99, 102, 241, 0.12)",
                    fill: true,
                    tension: 0.35,
                    pointRadius: 3,
                    pointBackgroundColor: "#6366f1",
                  },
                ],
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
