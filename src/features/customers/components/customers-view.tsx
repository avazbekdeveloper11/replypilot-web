import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/layout/page-header";

import { CustomersList } from "./customers-list";

export async function CustomersView() {
  const t = await getTranslations("customers");

  return (
    <>
      <PageHeader title={t("pageTitle")} description={t("pageDescription")} />
      <CustomersList />
    </>
  );
}
