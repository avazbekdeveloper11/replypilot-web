"use client";

import type * as React from "react";
import { useTranslations } from "next-intl";
import {
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  LinkIcon,
  SparklesIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/feedback/error-state";
import { useDashboardStats } from "../hooks/use-dashboard-stats";
import type { DashboardStats } from "../types";

interface StatDef {
  /** Key into the "dashboard" message namespace — module scope has no
   * React context to translate at definition time (same reasoning as
   * config/navigation.ts). */
  labelKey: string;
  value: (s: DashboardStats) => number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const STATS: StatDef[] = [
  {
    labelKey: "totalConversations",
    value: (s) => s.total_conversations,
    icon: ChatBubbleLeftRightIcon,
  },
  { labelKey: "unread", value: (s) => s.unread_conversations, icon: EnvelopeIcon },
  { labelKey: "aiActive", value: (s) => s.ai_active_conversations, icon: SparklesIcon },
  {
    labelKey: "pendingHuman",
    value: (s) => s.pending_human_conversations,
    icon: UserGroupIcon,
  },
  { labelKey: "resolved", value: (s) => s.resolved_conversations, icon: CheckCircleIcon },
  {
    labelKey: "connectedAccounts",
    value: (s) => s.connected_instagram_accounts,
    icon: LinkIcon,
  },
];

/** Statistics Cards widget — six counts from GET /v1/dashboard/stats,
 * refreshed every 60s alongside Response Time (same query, see
 * response-time-card.tsx). */
export function StatCards() {
  const { data, isPending, isError, error, refetch } = useDashboardStats();
  const t = useTranslations("dashboard");

  if (isPending) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-3.5 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title={t("couldntLoadStatistics")}
        description={error instanceof Error ? error.message : undefined}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {STATS.map(({ labelKey, value, icon: Icon }) => (
        <Card key={labelKey}>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {t(labelKey)}
            </CardTitle>
            <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums text-foreground">
              {value(data).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
