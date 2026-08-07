import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/layout/page-header";

import { CampaignComposer } from "./campaign-composer";

export async function CampaignsView() {
  const t = await getTranslations("campaigns");

  return (
    <>
      <PageHeader title={t("pageTitle")} description={t("pageDescription")} />
      <CampaignComposer />
    </>
  );
}
