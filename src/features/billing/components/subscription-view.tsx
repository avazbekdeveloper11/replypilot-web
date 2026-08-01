"use client";

import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/layout/page-header";

import { PlanComparison } from "./plan-comparison";

export function SubscriptionView() {
  const t = useTranslations("billing");

  return (
    <>
      <PageHeader title={t("plansPageTitle")} description={t("plansPageDescription")} />
      <PlanComparison />
    </>
  );
}
