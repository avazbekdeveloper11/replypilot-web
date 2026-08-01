"use client";

import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/layout/page-header";

import { ConversationList } from "./conversation-list";

export function ConversationListView() {
  const t = useTranslations("conversations");

  return (
    <>
      <PageHeader title={t("pageTitle")} description={t("pageDescription")} />
      <ConversationList />
    </>
  );
}
