"use client";

import type * as React from "react";
import { useTranslations, useLocale } from "next-intl";
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
import { intlLocale, type Locale } from "@/i18n/config";

import { usePlatformStats } from "../hooks/use-platform-stats";
import { formatCents } from "../lib/format";
import type { AdminPlatformStats } from "../types";

interface StatDef {
  labelKey: string;
  value: (s: AdminPlatformStats, locale: string) => string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const STATS: StatDef[] = [
  {
    labelKey: "organizations",
    value: (s, locale) => s.total_organizations.toLocaleString(locale),
    icon: BuildingOfficeIcon,
  },
  {
    labelKey: "users",
    value: (s, locale) => s.total_users.toLocaleString(locale),
    icon: UsersIcon,
  },
  {
    labelKey: "conversations",
    value: (s, locale) => s.total_conversations.toLocaleString(locale),
    icon: ChatBubbleLeftRightIcon,
  },
  {
    labelKey: "messages",
    value: (s, locale) => s.total_messages.toLocaleString(locale),
    icon: EnvelopeIcon,
  },
  {
    labelKey: "activeSubscriptions",
    value: (s, locale) => s.active_subscriptions.toLocaleString(locale),
    icon: CreditCardIcon,
  },
  {
    labelKey: "approxMrr",
    value: (s, locale) => formatCents(s.mrr_cents_approx, locale),
    icon: BanknotesIcon,
  },
];

/**
 * "Approx. MRR" is labeled, not a typo — see AdminPlatformStats.
 * mrr_cents_approx's doc comment: subscriptions don't record whether a
 * subscriber actually billed monthly or yearly, so this always prices at
 * the monthly rate and overstates true MRR for yearly subscribers.
 */
export function PlatformStatsCards() {
  const { data, isPending, isError, error, refetch } = usePlatformStats();
  const t = useTranslations("admin");
  const locale = useLocale() as Locale;
  const resolvedLocale = intlLocale(locale);

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
        title={t("couldntLoadStats")}
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
              {value(data, resolvedLocale)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
