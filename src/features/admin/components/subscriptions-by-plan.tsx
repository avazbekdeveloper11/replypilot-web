"use client";

import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { usePlatformStats } from "../hooks/use-platform-stats";

/**
 * The exact, non-approximate counterpart to the "Approx. MRR" stat card —
 * a plain count per plan, so the approximation next to it can be
 * sanity-checked rather than trusted blindly.
 */
export function SubscriptionsByPlan() {
  const { data, isPending } = usePlatformStats();
  const t = useTranslations("admin");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{t("activeSubscriptionsByPlan")}</CardTitle>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : !data || data.subscriptions_by_plan.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("noActiveSubscriptions")}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {data.subscriptions_by_plan.map((p) => (
              <li key={p.plan_code} className="flex items-center justify-between text-sm">
                <span className="text-foreground">{p.plan_name}</span>
                <span className="tabular-nums text-muted-foreground">{p.count}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
