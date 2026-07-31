"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ErrorState } from "@/components/feedback/error-state";
import { TableSkeleton } from "@/components/feedback/table-skeleton";
import { FormAlert } from "@/components/feedback/form-alert";
import { ApiError } from "@/lib/api/errors";

import { usePlans } from "../hooks/use-plans";
import { useSubscription } from "../hooks/use-subscription";
import { useCheckout } from "../hooks/use-checkout";
import { formatPriceCents } from "../lib/format";

export function PlanComparison() {
  const [period, setPeriod] = React.useState<"monthly" | "yearly">("monthly");
  const plansQuery = usePlans();
  const subscriptionQuery = useSubscription();
  const checkoutMutation = useCheckout();

  if (plansQuery.isPending) {
    return (
      <Card>
        <CardContent className="p-6">
          <TableSkeleton columns={1} rows={3} />
        </CardContent>
      </Card>
    );
  }

  if (plansQuery.isError) {
    return (
      <Card>
        <CardContent className="p-0">
          <ErrorState
            className="py-16"
            title="Couldn't load plans"
            description={plansQuery.error instanceof Error ? plansQuery.error.message : undefined}
            onRetry={() => plansQuery.refetch()}
          />
        </CardContent>
      </Card>
    );
  }

  const plans = plansQuery.data ?? [];
  const currentPlanCode = subscriptionQuery.data?.plan_code;

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={period} onValueChange={(v) => setPeriod(v as "monthly" | "yearly")}>
        <TabsList>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>
      </Tabs>

      {checkoutMutation.isError && (
        <FormAlert variant="error">
          {checkoutMutation.error instanceof ApiError
            ? checkoutMutation.error.message
            : "Couldn't start checkout. Please try again."}
        </FormAlert>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => {
          const priceCents = period === "yearly" ? plan.price_yearly_cents : plan.price_monthly_cents;
          const isCurrent = plan.code === currentPlanCode;

          return (
            <Card key={plan.code} className={isCurrent ? "border-brand" : undefined}>
              <CardContent className="flex flex-col gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-foreground">{plan.name}</h3>
                    {isCurrent && <Badge variant="brand">Current plan</Badge>}
                  </div>
                  <p className="mt-1 text-2xl font-semibold text-foreground">
                    {formatPriceCents(priceCents)}
                    {priceCents > 0 && (
                      <span className="text-sm font-normal text-muted-foreground">
                        {" "}
                        / {period === "yearly" ? "year" : "month"}
                      </span>
                    )}
                  </p>
                </div>

                <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
                  <li>{plan.message_limit ? `${plan.message_limit.toLocaleString()} messages/mo` : "Unlimited messages"}</li>
                  <li>{plan.seat_limit ? `${plan.seat_limit} seats` : "Unlimited seats"}</li>
                </ul>

                <Button
                  className="mt-auto"
                  variant={isCurrent ? "outline" : "default"}
                  disabled={isCurrent || !plan.self_serve || checkoutMutation.isPending}
                  onClick={() => checkoutMutation.mutate({ planCode: plan.code, period })}
                >
                  {isCurrent
                    ? "Current plan"
                    : !plan.self_serve
                      ? "Contact sales"
                      : checkoutMutation.isPending
                        ? "Redirecting…"
                        : "Upgrade"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
