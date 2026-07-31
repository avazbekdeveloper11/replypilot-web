"use client";

import type * as React from "react";
import {
  BuildingOfficeIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  CreditCardIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/feedback/error-state";

import { usePlatformStats } from "../hooks/use-platform-stats";
import { formatCents } from "../lib/format";
import type { AdminPlatformStats } from "../types";

interface StatDef {
  label: string;
  value: (s: AdminPlatformStats) => string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const STATS: StatDef[] = [
  { label: "Organizations", value: (s) => s.total_organizations.toLocaleString(), icon: BuildingOfficeIcon },
  { label: "Users", value: (s) => s.total_users.toLocaleString(), icon: UsersIcon },
  { label: "Conversations", value: (s) => s.total_conversations.toLocaleString(), icon: ChatBubbleLeftRightIcon },
  { label: "Messages", value: (s) => s.total_messages.toLocaleString(), icon: EnvelopeIcon },
  { label: "Active subscriptions", value: (s) => s.active_subscriptions.toLocaleString(), icon: CreditCardIcon },
  { label: "Approx. MRR", value: (s) => formatCents(s.mrr_cents_approx), icon: BanknotesIcon },
];

/**
 * "Approx. MRR" is labeled, not a typo — see AdminPlatformStats.
 * mrr_cents_approx's doc comment: subscriptions don't record whether a
 * subscriber actually billed monthly or yearly, so this always prices at
 * the monthly rate and overstates true MRR for yearly subscribers.
 */
export function PlatformStatsCards() {
  const { data, isPending, isError, error, refetch } = usePlatformStats();

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

  if (isError || !data) {
    return (
      <ErrorState
        title="Couldn't load platform stats"
        description={error instanceof Error ? error.message : undefined}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {STATS.map(({ label, value, icon: Icon }) => (
        <Card key={label}>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">{label}</CardTitle>
            <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums text-foreground">{value(data)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
