"use client";

import { StatCards } from "./stat-cards";
import { AiWorkingTimeCard } from "./ai-working-time-card";
import { AIPerformanceCard } from "./ai-performance-card";
import { ConversationsChart } from "./conversations-chart";
import { RecentConversations } from "./recent-conversations";
import { NotificationsPanel } from "./notifications-panel";

/**
 * Composes all six Dashboard widgets. A single client boundary (rather
 * than one per widget) keeps app/(dashboard)/dashboard/page.tsx a Server
 * Component that just renders PageHeader + this — see
 * FRONTEND_ARCHITECTURE.md §4 on client/server component boundaries.
 */
export function DashboardView() {
  return (
    <div className="flex flex-col gap-6">
      <StatCards />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ConversationsChart />
        </div>
        <AiWorkingTimeCard />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentConversations />
        </div>
        <NotificationsPanel />
      </div>

      <AIPerformanceCard />
    </div>
  );
}
