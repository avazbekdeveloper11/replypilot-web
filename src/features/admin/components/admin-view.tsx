"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { PlatformStatsCards } from "./platform-stats-cards";
import { SubscriptionsByPlan } from "./subscriptions-by-plan";
import { OrganizationsTable } from "./organizations-table";
import { GeminiSettingsCard } from "./gemini-settings-card";

/**
 * The whole admin panel is one client boundary — same pattern as
 * DashboardView — so app/(dashboard)/admin/page.tsx stays a Server
 * Component that just renders PageHeader + this.
 */
export function AdminView() {
  return (
    <div className="flex flex-col gap-6">
      <PlatformStatsCards />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Organizations</CardTitle>
            </CardHeader>
            <CardContent>
              <OrganizationsTable />
            </CardContent>
          </Card>
        </div>
        <SubscriptionsByPlan />
      </div>

      <GeminiSettingsCard />
    </div>
  );
}
