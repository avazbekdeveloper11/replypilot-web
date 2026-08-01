import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/layout/page-header";
import { AdminView } from "@/features/admin/components/admin-view";

export const metadata: Metadata = { title: "Admin" };

export default async function AdminPage() {
  const t = await getTranslations("admin");
  return (
    <>
      <PageHeader title={t("pageTitle")} description={t("pageDescription")} />
      <AdminView />
    </>
  );
}
