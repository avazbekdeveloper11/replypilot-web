import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/layout/page-header";
import { DashboardView } from "@/features/dashboard/components/dashboard-view";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");

  return (
    <>
      <PageHeader title={t("pageTitle")} description={t("pageDescription")} />
      <DashboardView />
    </>
  );
}
