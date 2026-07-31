import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { DashboardView } from "@/features/dashboard/components/dashboard-view";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Live from your connected Instagram accounts and conversations."
      />
      <DashboardView />
    </>
  );
}
