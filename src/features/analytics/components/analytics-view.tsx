"use client";

import { PageHeader } from "@/components/layout/page-header";

import { ResponseTimeChart } from "./response-time-chart";
import { AIUsageChart } from "./ai-usage-chart";
import { ConversationOutcomesChart } from "./conversation-outcomes-chart";

export function AnalyticsView() {
  return (
    <>
      <PageHeader
        title="Analytics"
        description="Response time, AI reply volume, and conversation outcomes over the trailing 14 days."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <ResponseTimeChart />
        <AIUsageChart />
        <div className="lg:col-span-2">
          <ConversationOutcomesChart />
        </div>
      </div>
    </>
  );
}
