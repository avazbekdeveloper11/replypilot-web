"use client";

import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/layout/page-header";

import { AIInboxList } from "./ai-inbox-list";

export function AIInboxView() {
  const t = useTranslations("aiInbox");

  return (
    <>
      <PageHeader title={t("pageTitle")} description={t("pageDescription")} />
      <AIInboxList />
    </>
  );
}
