"use client";

import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";

import { CurrentPlanCard } from "./current-plan-card";

export function BillingView() {
  return (
    <>
      <PageHeader
        title="Billing"
        description="Your subscription and payment details."
        actions={
          <Button variant="outline" asChild>
            <Link href="/billing/subscription">View plans</Link>
          </Button>
        }
      />
      <CurrentPlanCard />
    </>
  );
}
