"use client";

import { PageHeader } from "@/components/layout/page-header";

import { PlanComparison } from "./plan-comparison";

export function SubscriptionView() {
  return (
    <>
      <PageHeader
        title="Plans"
        description="Pick the plan that fits — you can change or cancel anytime from the billing portal."
      />
      <PlanComparison />
    </>
  );
}
