import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/layout/page-header";

import { LeadsList } from "./leads-list";

export async function LeadsView() {
  const t = await getTranslations("leads");

  return (
    <>
      <PageHeader title={t("pageTitle")} description={t("pageDescription")} />
      <LeadsList />
    </>
  );
}
