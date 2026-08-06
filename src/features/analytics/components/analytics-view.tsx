"use client";

import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/layout/page-header";

import { AIInsightsPanel } from "./ai-insights-panel";
import { ResponseTimeChart } from "./response-time-chart";
import { AIUsageChart } from "./ai-usage-chart";
import { ConversationOutcomesChart } from "./conversation-outcomes-chart";

export function AnalyticsView() {
  const t = useTranslations("analytics");

  return (
    <>
      <PageHeader title={t("pageTitle")} description={t("pageDescription")} />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <AIInsightsPanel />
        </div>
        <ResponseTimeChart />
        <AIUsageChart />
        <div className="lg:col-span-2">
          <ConversationOutcomesChart />
        </div>
      </div>
    </>
  );
}
