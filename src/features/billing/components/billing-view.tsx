"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";

import { CurrentPlanCard } from "./current-plan-card";

export function BillingView() {
  const t = useTranslations("billing");

  return (
    <>
      <PageHeader
        title={t("pageTitle")}
        description={t("pageDescription")}
        actions={
          <Button variant="outline" asChild>
            <Link href="/billing/subscription">{t("viewPlans")}</Link>
          </Button>
        }
      />
      <CurrentPlanCard />
    </>
  );
}
