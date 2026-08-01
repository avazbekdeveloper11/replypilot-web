import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/layout/page-header";
import { InstagramAccountsView } from "@/features/instagram/components/instagram-accounts-view";

export const metadata: Metadata = { title: "Instagram" };

export default async function InstagramPage() {
  const t = await getTranslations("instagram");
  return (
    <>
      <PageHeader title={t("pageTitle")} description={t("pageDescription")} />
      <InstagramAccountsView />
    </>
  );
}
