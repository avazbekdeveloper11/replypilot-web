"use client";

import Link from "next/link";
import { CreditCardIcon } from "@heroicons/react/24/outline";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/data/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { FormAlert } from "@/components/feedback/form-alert";
import { ApiError } from "@/lib/api/errors";
import { useSubscription } from "../hooks/use-subscription";
import { useBillingPortal } from "../hooks/use-billing-portal";
import { formatPeriodEnd } from "../lib/format";

const STATUS_VARIANT: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  active: "success",
  trialing: "success",
  past_due: "warning",
  paused: "warning",
  canceled: "destructive",
  unpaid: "destructive",
};

export function CurrentPlanCard() {
  const { data: subscription, isPending, isError, error, refetch } = useSubscription();
  const portalMutation = useBillingPortal();

  if (isPending) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Loading subscription…
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-0">
          <ErrorState
            className="py-16"
            title="Couldn't load your subscription"
            description={error instanceof Error ? error.message : undefined}
            onRetry={() => refetch()}
          />
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardContent className="p-0">
          <EmptyState
            className="py-16"
            icon={CreditCardIcon}
            title="No active plan yet"
            description="Choose a plan to get started — the AI reply pipeline, knowledge base, and team features all require an active subscription."
            action={
              <Button asChild>
                <Link href="/billing/subscription">View plans</Link>
              </Button>
            }
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-foreground">{subscription.plan_name}</span>
              <Badge variant={STATUS_VARIANT[subscription.status] ?? "secondary"}>
                {subscription.status.replace("_", " ")}
              </Badge>
            </div>
            {subscription.current_period_end && (
              <p className="mt-1 text-sm text-muted-foreground">
                {subscription.cancel_at_period_end
                  ? `Cancels on ${formatPeriodEnd(subscription.current_period_end)}`
                  : `Renews on ${formatPeriodEnd(subscription.current_period_end)}`}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/billing/subscription">Change plan</Link>
            </Button>
            <Button
              disabled={portalMutation.isPending}
              onClick={() => portalMutation.mutate()}
            >
              {portalMutation.isPending ? "Opening…" : "Manage billing"}
            </Button>
          </div>
        </div>

        {portalMutation.isError && (
          <FormAlert variant="error">
            {portalMutation.error instanceof ApiError
              ? portalMutation.error.message
              : "Couldn't open the billing portal. Please try again."}
          </FormAlert>
        )}
      </CardContent>
    </Card>
  );
}
